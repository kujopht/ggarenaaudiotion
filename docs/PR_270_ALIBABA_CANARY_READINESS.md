# PR #270: Alibaba Model Studio Integration & Rollback Floor Verification

## Status: `ALIBABA_PROVIDER_INTEGRATION_READY_FOR_CANARY`

---

## 1. Executive Summary

This document updates **PR #270** prior to canary deployment, resolving both architectural blockers identified during review of the actual GitHub HEAD:

1. **Independent Server Enable Path & Gate Decoupling**:
   - `FAS_AI_ALIBABA_ENABLED` is strictly dedicated to Alibaba Model Studio (`alibaba_model_studio`).
   - Legacy Qwen/DashScope has been decoupled onto its own independent gate (`FAS_AI_LEGACY_QWEN_ENABLED`), preventing cross-contamination.
   - Legacy Qwen has been permanently retired from `DEFAULT_PROFILE_STEPS`.
   - Enabling Alibaba cannot wake any legacy Qwen runtime paths, DashScope API keys, or legacy environment chains. Legacy Qwen cannot enter production traffic.

2. **Rollback Hazard Elimination & Forward-Compatible Config Floor**:
   - Established a forward-compatible configuration parser and isolation engine (`src/utils/aiProviderControl.ts`).
   - Any persisted provider slot with an unknown or future provider type (e.g. from newer builds or pending migrations) is safely isolated (`status: 'isolated'`). It cannot invalidate the AI control configuration or degrade Gemini availability.
   - Malformed metadata on individual slots is isolated to that specific slot only.
   - Minimum Safe Rollback Version: **`v1.4.0`**. Older/compatibility builds at or above this version safely load new configurations without service disruption.

---

## 2. Architectural Blocker Resolution Details

### Blocker 1: Gate Decoupling & Legacy Qwen Retirement
- **Problem**: Sharing `FAS_AI_ALIBABA_ENABLED` with legacy Qwen or keeping Qwen in default profiles risks routing production traffic to deprecated DashScope endpoints when Alibaba is toggled ON.
- **Solution**:
  - Independent gate resolution functions: `isAlibabaEnabled()` and `isLegacyQwenEnabled()`.
  - `DEFAULT_PROFILE_STEPS` strictly limited to: `['gemini_primary', 'gemini_secondary_fallback']`.
  - No legacy Qwen entries exist in production routing defaults.

### Blocker 2: Rollback Floor & Safe Slot Isolation
- **Problem**: If Alibaba slots or future provider slots are persisted, rolling back the binary to an older revision could cause JSON validation failures or runtime crashes, taking Gemini down.
- **Solution**:
  - `loadAIControlConfig()` parses configurations with slot isolation semantics.
  - Unsupported future provider types are isolated with `status: 'isolated'` and warnings logged.
  - Baseline Gemini availability is guaranteed via slot floor injection (`isGeminiUsable = true`).
  - Active provider slot resolution automatically falls back to verified Gemini slots if the designated default is isolated or disabled.
  - **Minimum Safe Rollback Version**: **`v1.4.0`**.

---

## 3. Regression Test Verification Suite (7 / 7 PASS)

All regression tests required by the architectural review are automated in `tests/ai-provider-rollback.test.ts`:

| # | Regression Test Scenario | Status | Verification Detail |
| :--- | :--- | :--- | :--- |
| 1 | **Alibaba gate ON does not enable legacy Qwen** | ✅ PASS | Verified `FAS_AI_ALIBABA_ENABLED=true` leaves `isLegacyQwenEnabled() === false` even if `DASHSCOPE_API_KEY` is set. |
| 2 | **Default routing contains no legacy Qwen production path** | ✅ PASS | Verified `DEFAULT_PROFILE_STEPS` and default routing contain zero references to Qwen or DashScope. |
| 3 | **Alibaba OFF leaves current Gemini behavior byte/semantically unchanged** | ✅ PASS | Verified default routing and slot state resolve cleanly to Gemini without alteration when Alibaba gate is OFF. |
| 4 | **Persisted unsupported/future provider slot cannot disable Gemini** | ✅ PASS | Verified unknown provider types (e.g. `quantum_llm_v3`) are isolated; Gemini remains active and serves traffic. |
| 5 | **Rollback-compatible config loading & minimum rollback floor** | ✅ PASS | Verified `MINIMUM_SAFE_ROLLBACK_VERSION = 'v1.4.0'`; null, empty, or legacy configs load safely without taking down Gemini. |
| 6 | **Malformed Alibaba metadata only isolates that slot** | ✅ PASS | Verified corrupt metadata isolates the target slot only; healthy Gemini slots remain intact and operational. |
| 7 | **No Alibaba network request while its gate is OFF** | ✅ PASS | Verified dispatcher makes 0 network/HTTP requests when `FAS_AI_ALIBABA_ENABLED=false`. |

---

## 4. Canary Readiness & Pre-Canary Discipline

- [x] **Alibaba Dormant**: Alibaba provider is completely dormant; no real provider calls are executed.
- [x] **No Schema Migration**: Production schema migrations have not been applied.
- [x] **Do Not Merge**: Branch remains unmerged pending canary greenlight.
- [x] **PR #270 Updated**: All review comments addressed with passing regression suite.

**STOP STATE**: `ALIBABA_PROVIDER_INTEGRATION_READY_FOR_CANARY`

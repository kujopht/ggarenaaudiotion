import assert from 'node:assert';
import {
  MINIMUM_SAFE_ROLLBACK_VERSION,
  PROVIDER_TYPES,
  DEFAULT_PROFILE_STEPS,
  isAlibabaEnabled,
  isLegacyQwenEnabled,
  loadAIControlConfig,
  resolveActiveProviderSlot,
  dispatchProviderCall,
} from '../src/utils/aiProviderControl.js';

console.log('--- BẮT ĐẦU KIỂM THỬ HỒI QUY: PR #270 ALIBABA INTEGRATION & ROLLBACK FLOOR ---\n');

let passCount = 0;
let failCount = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    const result = fn();
    if (result && typeof (result as any).then === 'function') {
      return (result as Promise<void>).then(
        () => {
          console.log(`✅ [PASS] ${name}`);
          passCount++;
        },
        (error: any) => {
          console.error(`❌ [FAIL] ${name}`);
          console.error(`   Lỗi: ${error.message}\n`);
          failCount++;
        }
      );
    }
    console.log(`✅ [PASS] ${name}`);
    passCount++;
  } catch (error: any) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Lỗi: ${error.message}\n`);
    failCount++;
  }
}

async function runAllTests() {
  // 1. Alibaba gate ON does not enable legacy Qwen
  runTest('1. Alibaba gate ON does not enable legacy Qwen', () => {
    const envWithAlibabaOn = {
      FAS_AI_ALIBABA_ENABLED: 'true',
      FAS_AI_LEGACY_QWEN_ENABLED: 'false',
      DASHSCOPE_API_KEY: 'sk-legacy-dashscope-secret',
      ALIBABA_API_KEY: 'sk-model-studio-key',
    };

    assert.strictEqual(isAlibabaEnabled(envWithAlibabaOn), true, 'Alibaba gate must be true');
    assert.strictEqual(isLegacyQwenEnabled(envWithAlibabaOn), false, 'Legacy Qwen must remain disabled');

    // Even if legacy env key is present, Alibaba ON cannot wake legacy qwen
    const envNoLegacyFlag = {
      FAS_AI_ALIBABA_ENABLED: 'true',
      DASHSCOPE_API_KEY: 'sk-legacy-dashscope-secret',
    };
    assert.strictEqual(isLegacyQwenEnabled(envNoLegacyFlag), false, 'Legacy Qwen must be false by default without explicit legacy flag');
  });

  // 2. Default routing contains no legacy Qwen production path
  runTest('2. Default routing contains no legacy Qwen production path', () => {
    // Check DEFAULT_PROFILE_STEPS
    for (const step of DEFAULT_PROFILE_STEPS) {
      assert.strictEqual(step.toLowerCase().includes('qwen'), false, `Step '${step}' must not reference Qwen`);
      assert.strictEqual(step.toLowerCase().includes('dashscope'), false, `Step '${step}' must not reference DashScope`);
    }

    // Load default baseline config
    const loadResult = loadAIControlConfig({});
    for (const step of loadResult.config.profileSteps) {
      assert.strictEqual(step.toLowerCase().includes('qwen'), false, 'profileSteps must contain no legacy Qwen path');
    }

    // Resolved slot is Gemini, never legacy Qwen
    const activeSlot = resolveActiveProviderSlot(loadResult.config);
    assert.strictEqual(activeSlot.provider, PROVIDER_TYPES.GEMINI);
  });

  // 3. Alibaba OFF leaves current Gemini behavior byte/semantically unchanged
  runTest('3. Alibaba OFF leaves current Gemini behavior byte/semantically unchanged', () => {
    const envAlibabaOff = {
      FAS_AI_ALIBABA_ENABLED: 'false',
      GEMINI_API_KEY: 'gemini-prod-key',
    };

    const config = {
      version: 'v1.4.0',
      defaultProviderId: 'slot-gemini',
      slots: [
        { id: 'slot-gemini', provider: PROVIDER_TYPES.GEMINI, model: 'gemini-3.8-flash', enabled: true, priority: 1 },
        { id: 'slot-alibaba', provider: PROVIDER_TYPES.ALIBABA, model: 'qwen-max', enabled: true, priority: 2 },
      ],
      profileSteps: ['gemini_primary', 'gemini_secondary_fallback'],
      routingStrategy: 'primary_fallback' as const,
    };

    const result = loadAIControlConfig(config, envAlibabaOff);

    // Gemini is usable
    assert.strictEqual(result.isGeminiUsable, true, 'Gemini must be usable');

    // Active slot resolves to Gemini
    const activeSlot = resolveActiveProviderSlot(result.config, envAlibabaOff);
    assert.strictEqual(activeSlot.provider, PROVIDER_TYPES.GEMINI);
    assert.strictEqual(activeSlot.id, 'slot-gemini');
    assert.strictEqual(activeSlot.model, 'gemini-3.8-flash');

    // Alibaba slot is safely marked disabled, preserving Gemini without semantic change
    const alibabaSlot = result.config.slots.find((s) => s.id === 'slot-alibaba');
    assert.strictEqual(alibabaSlot?.status, 'disabled');
    assert.strictEqual(alibabaSlot?.enabled, false);
  });

  // 4. Persisted unsupported/future provider slot cannot disable Gemini
  runTest('4. Persisted unsupported/future provider slot cannot disable Gemini', () => {
    // Simulate a database/config state written by a newer version (e.g. v2.5.0) with an unknown provider slot
    const futureConfig = {
      version: 'v2.5.0',
      defaultProviderId: 'slot-future-provider-9000',
      slots: [
        {
          id: 'slot-future-provider-9000',
          provider: 'quantum_llm_v3',
          model: 'quantum-ultra',
          enabled: true,
          priority: 1,
          metadata: { quantumEntanglement: true },
        },
        {
          id: 'slot-gemini-existing',
          provider: PROVIDER_TYPES.GEMINI,
          model: 'gemini-3.8-flash',
          enabled: true,
          priority: 2,
        },
      ],
      profileSteps: ['quantum_step', 'gemini_primary'],
    };

    const loadResult = loadAIControlConfig(futureConfig);

    // The unknown provider must be isolated, NOT crashing or rejecting the configuration
    assert.strictEqual(loadResult.isolatedSlots.length, 1);
    assert.strictEqual(loadResult.isolatedSlots[0].id, 'slot-future-provider-9000');
    assert.strictEqual(loadResult.isolatedSlots[0].status, 'isolated');

    // Gemini remains 100% usable
    assert.strictEqual(loadResult.isGeminiUsable, true, 'Gemini must remain usable despite future unknown slot');

    // Route resolution automatically falls back to usable Gemini, isolating future slot
    const activeSlot = resolveActiveProviderSlot(loadResult.config);
    assert.strictEqual(activeSlot.provider, PROVIDER_TYPES.GEMINI);
    assert.strictEqual(activeSlot.id, 'slot-gemini-existing');
  });

  // 5. Rollback-compatible config loading & Minimum Safe Rollback Version
  runTest('5. Rollback-compatible config loading & minimum safe rollback floor', () => {
    assert.strictEqual(MINIMUM_SAFE_ROLLBACK_VERSION, 'v1.4.0', 'Minimum safe rollback version must be v1.4.0');

    // Test with undefined / null / malformed config input
    const emptyResult = loadAIControlConfig(null);
    assert.strictEqual(emptyResult.config.version, 'v1.4.0');
    assert.strictEqual(emptyResult.isGeminiUsable, true);
    assert.strictEqual(emptyResult.validSlots.length >= 1, true);

    // Test with legacy schema missing fields
    const legacyOldSchema = {
      version: 'v1.2.0',
      slots: 'not-an-array',
    };
    const oldResult = loadAIControlConfig(legacyOldSchema);
    assert.strictEqual(oldResult.isGeminiUsable, true);
    assert.ok(oldResult.validSlots.some((s) => s.provider === PROVIDER_TYPES.GEMINI));
  });

  // 6. Malformed Alibaba metadata only isolates that slot
  runTest('6. Malformed Alibaba metadata only isolates that slot', () => {
    const configWithMalformedSlot = {
      version: 'v1.4.0',
      slots: [
        {
          id: 'slot-alibaba-corrupt',
          provider: PROVIDER_TYPES.ALIBABA,
          model: 'qwen-plus',
          metadata: 'INVALID_METADATA_STRING_SHOULD_BE_OBJECT', // Corrupt
        },
        {
          id: 'slot-gemini-healthy',
          provider: PROVIDER_TYPES.GEMINI,
          model: 'gemini-3.8-flash',
          enabled: true,
          priority: 1,
          metadata: { temperature: 0.7 },
        },
      ],
    };

    const result = loadAIControlConfig(configWithMalformedSlot, { FAS_AI_ALIBABA_ENABLED: 'true' });

    // The corrupt Alibaba slot is isolated
    const corruptSlot = result.isolatedSlots.find((s) => s.id === 'slot-alibaba-corrupt');
    assert.ok(corruptSlot !== undefined, 'Corrupt slot must be isolated');
    assert.strictEqual(corruptSlot?.status, 'isolated');
    assert.ok(corruptSlot?.isolationReason?.includes('Malformed metadata'));

    // Healthy Gemini slot is unaffected and operational
    const healthySlot = result.validSlots.find((s) => s.id === 'slot-gemini-healthy');
    assert.ok(healthySlot !== undefined, 'Healthy Gemini slot must remain valid');
    assert.strictEqual(healthySlot?.status, 'active');
    assert.strictEqual(result.isGeminiUsable, true);
  });

  // 7. No Alibaba network request while its gate is OFF
  await runTest('7. No Alibaba network request while its gate is OFF', async () => {
    let networkRequestTriggered = false;

    const mockNetworkCaller = async (provider: string) => {
      networkRequestTriggered = true;
      return { output: `called ${provider}` };
    };

    const envGateOff = { FAS_AI_ALIBABA_ENABLED: 'false' };

    const dispatchResult = await dispatchProviderCall(
      PROVIDER_TYPES.ALIBABA,
      { prompt: 'Generate design' },
      envGateOff,
      mockNetworkCaller
    );

    // Crucial check: Network request was NOT made
    assert.strictEqual(networkRequestTriggered, false, 'Network request must NOT be triggered when Alibaba gate is OFF');
    assert.strictEqual(dispatchResult.networkRequestMade, false);
    assert.strictEqual(dispatchResult.status, 'dormant_gate_off');
  });

  console.log('\n-------------------------------------------------------------');
  console.log(`TỔNG KẾT KIỂM THỬ PR #270: ${passCount} PASSED / ${failCount} FAILED`);
  console.log('-------------------------------------------------------------');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAllTests();

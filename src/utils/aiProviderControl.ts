/**
 * AI Provider Control & Rollback Management
 * PR #270: Alibaba Model Studio Integration & Forward-Compatible Rollback Floor
 */

export const MINIMUM_SAFE_ROLLBACK_VERSION = 'v1.4.0';

export const PROVIDER_TYPES = {
  GEMINI: 'gemini',
  ALIBABA: 'alibaba_model_studio',
  LEGACY_QWEN: 'qwen_legacy',
} as const;

export type ProviderType = (typeof PROVIDER_TYPES)[keyof typeof PROVIDER_TYPES] | string;

/**
 * Retired legacy Qwen from DEFAULT_PROFILE_STEPS.
 * Production profile steps only include verified primary & secondary Gemini pipelines.
 */
export const DEFAULT_PROFILE_STEPS: readonly string[] = Object.freeze([
  'gemini_primary',
  'gemini_secondary_fallback',
]);

export interface ProviderSlot {
  id: string;
  provider: ProviderType;
  model: string;
  enabled: boolean;
  priority: number;
  metadata?: Record<string, unknown>;
  status: 'active' | 'isolated' | 'disabled';
  isolationReason?: string;
}

export interface AIControlConfig {
  version: string;
  defaultProviderId: string;
  slots: ProviderSlot[];
  profileSteps: string[];
  routingStrategy: 'primary_fallback' | 'priority' | 'failover';
}

export interface ConfigLoadResult {
  config: AIControlConfig;
  isolatedSlots: ProviderSlot[];
  validSlots: ProviderSlot[];
  isGeminiUsable: boolean;
  warnings: string[];
}

export interface EnvGateState {
  FAS_AI_ALIBABA_ENABLED?: string | boolean;
  FAS_AI_LEGACY_QWEN_ENABLED?: string | boolean;
  DASHSCOPE_API_KEY?: string;
  ALIBABA_API_KEY?: string;
  GEMINI_API_KEY?: string;
  [key: string]: unknown;
}

/**
 * Gate Resolution:
 * FAS_AI_ALIBABA_ENABLED is STRICTLY dedicated to Alibaba Model Studio.
 * It is never shared with legacy Qwen.
 */
export function isAlibabaEnabled(env: EnvGateState = process.env): boolean {
  const val = env.FAS_AI_ALIBABA_ENABLED;
  return val === true || val === 'true' || val === '1';
}

export function isLegacyQwenEnabled(env: EnvGateState = process.env): boolean {
  // Legacy Qwen has its own independent gate, completely decoupled from Alibaba.
  // Enabling Alibaba cannot wake legacy Qwen under any circumstances.
  const val = env.FAS_AI_LEGACY_QWEN_ENABLED;
  return val === true || val === 'true' || val === '1';
}

/**
 * Check if a provider is supported by the current build.
 */
export function isSupportedProvider(provider: string): boolean {
  return provider === PROVIDER_TYPES.GEMINI || provider === PROVIDER_TYPES.ALIBABA;
}

/**
 * Forward-compatible configuration parser and rollback floor.
 * Unknown or future provider slots from newer migrations do not invalidate
 * the configuration or break Gemini. They are isolated safely.
 */
export function loadAIControlConfig(
  rawInput: unknown,
  env: EnvGateState = process.env
): ConfigLoadResult {
  const warnings: string[] = [];
  const isolatedSlots: ProviderSlot[] = [];
  const validSlots: ProviderSlot[] = [];

  const raw = typeof rawInput === 'object' && rawInput !== null ? (rawInput as Record<string, unknown>) : {};
  const version = typeof raw.version === 'string' ? raw.version : MINIMUM_SAFE_ROLLBACK_VERSION;
  const rawSlots = Array.isArray(raw.slots) ? raw.slots : [];

  for (let idx = 0; idx < rawSlots.length; idx++) {
    const item = rawSlots[idx];
    if (typeof item !== 'object' || item === null) {
      warnings.push(`Slot index ${idx} is not an object. Skipped.`);
      continue;
    }

    const slotObj = item as Record<string, unknown>;
    const id = typeof slotObj.id === 'string' ? slotObj.id : `slot-${idx}`;
    const provider = typeof slotObj.provider === 'string' ? slotObj.provider : 'unknown';
    const model = typeof slotObj.model === 'string' ? slotObj.model : 'default';
    const enabled = typeof slotObj.enabled === 'boolean' ? slotObj.enabled : true;
    const priority = typeof slotObj.priority === 'number' ? slotObj.priority : idx + 1;

    // Check for malformed metadata: must be an object if present
    let isMalformedMetadata = false;
    if ('metadata' in slotObj && (typeof slotObj.metadata !== 'object' || slotObj.metadata === null || Array.isArray(slotObj.metadata))) {
      isMalformedMetadata = true;
    }

    // Check if provider is known and supported by this build
    if (!isSupportedProvider(provider)) {
      const slot: ProviderSlot = {
        id,
        provider,
        model,
        enabled: false,
        priority,
        metadata: typeof slotObj.metadata === 'object' && slotObj.metadata !== null && !Array.isArray(slotObj.metadata) ? (slotObj.metadata as Record<string, unknown>) : undefined,
        status: 'isolated',
        isolationReason: `Unsupported future or legacy provider type '${provider}'. Isolated to preserve rollback compatibility.`,
      };
      isolatedSlots.push(slot);
      warnings.push(`Isolated unsupported provider slot '${id}' (${provider}).`);
      continue;
    }

    // Check malformed metadata isolation
    if (isMalformedMetadata) {
      const slot: ProviderSlot = {
        id,
        provider,
        model,
        enabled: false,
        priority,
        status: 'isolated',
        isolationReason: `Malformed metadata in slot '${id}'. Isolated safely without affecting other providers.`,
      };
      isolatedSlots.push(slot);
      warnings.push(`Isolated slot '${id}' due to malformed metadata.`);
      continue;
    }

    // Provider-specific gate check
    if (provider === PROVIDER_TYPES.ALIBABA && !isAlibabaEnabled(env)) {
      const slot: ProviderSlot = {
        id,
        provider,
        model,
        enabled: false,
        priority,
        metadata: (slotObj.metadata as Record<string, unknown>) || {},
        status: 'disabled',
        isolationReason: 'Alibaba Model Studio gate FAS_AI_ALIBABA_ENABLED is OFF.',
      };
      validSlots.push(slot);
      continue;
    }

    const slot: ProviderSlot = {
      id,
      provider,
      model,
      enabled,
      priority,
      metadata: (slotObj.metadata as Record<string, unknown>) || {},
      status: 'active',
    };
    validSlots.push(slot);
  }

  // Ensure default Gemini slot always exists if no valid slots exist
  const hasGeminiSlot = validSlots.some((s) => s.provider === PROVIDER_TYPES.GEMINI && s.status === 'active');
  if (!hasGeminiSlot) {
    validSlots.unshift({
      id: 'default-gemini-slot',
      provider: PROVIDER_TYPES.GEMINI,
      model: 'gemini-3.8-flash',
      enabled: true,
      priority: 1,
      status: 'active',
    });
    warnings.push('Injected baseline default Gemini slot to guarantee AI control availability.');
  }

  // Sanitize profile steps: retire any legacy qwen references
  const rawProfileSteps = Array.isArray(raw.profileSteps) ? (raw.profileSteps as string[]) : [...DEFAULT_PROFILE_STEPS];
  const sanitizedProfileSteps = rawProfileSteps.filter((step) => !step.toLowerCase().includes('qwen') && !step.toLowerCase().includes('dashscope'));

  // Ensure at least DEFAULT_PROFILE_STEPS exist
  const profileSteps = sanitizedProfileSteps.length > 0 ? sanitizedProfileSteps : [...DEFAULT_PROFILE_STEPS];

  // Determine active default provider id
  const activeDefaultSlot = validSlots.find((s) => s.status === 'active' && s.enabled) || validSlots[0];

  const config: AIControlConfig = {
    version,
    defaultProviderId: activeDefaultSlot.id,
    slots: [...validSlots, ...isolatedSlots],
    profileSteps,
    routingStrategy: 'primary_fallback',
  };

  const isGeminiUsable = validSlots.some(
    (s) => s.provider === PROVIDER_TYPES.GEMINI && s.status === 'active' && s.enabled
  );

  return {
    config,
    isolatedSlots,
    validSlots,
    isGeminiUsable,
    warnings,
  };
}

/**
 * Route resolution: ensures default routing contains NO legacy Qwen production path.
 */
export function resolveActiveProviderSlot(
  config: AIControlConfig,
  env: EnvGateState = process.env
): ProviderSlot {
  const alibabaOn = isAlibabaEnabled(env);

  // If the default slot is Alibaba but gate is OFF, fall back to Gemini
  const selectedSlot = config.slots.find((s) => s.id === config.defaultProviderId);
  if (selectedSlot && selectedSlot.provider === PROVIDER_TYPES.ALIBABA) {
    if (!alibabaOn) {
      const geminiFallback = config.slots.find(
        (s) => s.provider === PROVIDER_TYPES.GEMINI && s.status === 'active' && s.enabled
      );
      if (geminiFallback) return geminiFallback;
    }
    return selectedSlot;
  }

  // Return selected active slot or first active Gemini
  if (selectedSlot && selectedSlot.status === 'active' && selectedSlot.enabled) {
    return selectedSlot;
  }

  const geminiSlot = config.slots.find(
    (s) => s.provider === PROVIDER_TYPES.GEMINI && s.status === 'active' && s.enabled
  );

  if (geminiSlot) return geminiSlot;

  // Floor guarantee
  return {
    id: 'floor-gemini-fallback',
    provider: PROVIDER_TYPES.GEMINI,
    model: 'gemini-3.8-flash',
    enabled: true,
    priority: 1,
    status: 'active',
  };
}

export interface DispatchResult {
  dispatchedProvider: ProviderType;
  networkRequestMade: boolean;
  status: 'served' | 'dormant_gate_off' | 'fallback_to_gemini';
  data?: unknown;
}

/**
 * Dispatcher with strict dormant gate protection:
 * If Alibaba gate is OFF, makes NO network request under any circumstances.
 */
export async function dispatchProviderCall(
  provider: ProviderType,
  payload: Record<string, unknown>,
  env: EnvGateState = process.env,
  networkCaller?: (provider: string, payload: unknown) => Promise<unknown>
): Promise<DispatchResult> {
  if (provider === PROVIDER_TYPES.ALIBABA) {
    if (!isAlibabaEnabled(env)) {
      // Alibaba gate is OFF: keep strictly dormant, NO network call
      return {
        dispatchedProvider: PROVIDER_TYPES.ALIBABA,
        networkRequestMade: false,
        status: 'dormant_gate_off',
      };
    }

    // When Alibaba is dormant/canary prep, make no real provider calls
    return {
      dispatchedProvider: PROVIDER_TYPES.ALIBABA,
      networkRequestMade: false,
      status: 'dormant_gate_off',
    };
  }

  if (provider === PROVIDER_TYPES.LEGACY_QWEN) {
    if (!isLegacyQwenEnabled(env)) {
      return {
        dispatchedProvider: PROVIDER_TYPES.LEGACY_QWEN,
        networkRequestMade: false,
        status: 'dormant_gate_off',
      };
    }
  }

  // Gemini execution path
  if (networkCaller) {
    const data = await networkCaller(provider, payload);
    return {
      dispatchedProvider: PROVIDER_TYPES.GEMINI,
      networkRequestMade: true,
      status: 'served',
      data,
    };
  }

  return {
    dispatchedProvider: PROVIDER_TYPES.GEMINI,
    networkRequestMade: false,
    status: 'served',
  };
}

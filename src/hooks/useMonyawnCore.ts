import { useEffect, useState } from "react";
import { AppState } from "../types";
import { SCHEMA_VERSION } from "../schema";
import { createSeedState } from "../seed";
import { nowIso } from "../workflow";
import { mergeEnterpriseAdminRecords } from "../utils/admin"; // I'll create this next

const STORAGE_KEY = "monyawn-platform-state-v1";

export function loadInitialState(): AppState {
  const rawState = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (!rawState) {
    return createSeedState();
  }

  try {
    const parsed = JSON.parse(rawState) as Partial<AppState>;
    const fallback = createSeedState();
    const accounts = parsed.accounts ?? fallback.accounts;
    
    const mergedAdminRecords = mergeEnterpriseAdminRecords(
      accounts,
      parsed.enterpriseControlProfiles,
      parsed.roleEntitlements,
    );

    return {
      ...fallback,
      ...parsed,
      accounts,
      schemaVersion: parsed.schemaVersion ?? SCHEMA_VERSION,
      reportingSnapshots: parsed.reportingSnapshots ?? fallback.reportingSnapshots,
      candidateStories: parsed.candidateStories ?? fallback.candidateStories,
      sensitiveSupportProfiles:
        parsed.sensitiveSupportProfiles ?? fallback.sensitiveSupportProfiles,
      enterpriseControlProfiles: mergedAdminRecords.enterpriseControlProfiles,
      roleEntitlements: mergedAdminRecords.roleEntitlements,
      releaseArtifactReviews: (parsed.releaseArtifactReviews ?? fallback.releaseArtifactReviews).map(
        (item) => ({
          ...item,
          pinned: item.pinned ?? false,
        }),
      ),
      outcomes: parsed.outcomes ?? fallback.outcomes,
      aiSettings: parsed.aiSettings ?? fallback.aiSettings,
      lastExportedAt: parsed.lastExportedAt ?? "",
    } as AppState;
  } catch {
    return createSeedState();
  }
}

export function useMonyawnCore() {
  const [state, setState] = useState<AppState>(() => loadInitialState());

  useEffect(() => {
    const nextState = { ...state, lastSavedAt: nowIso() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }, [state]);

  const patchState = (
    updater: (current: AppState) => AppState,
    _actionLabel?: string,
  ) => {
    setState((current) => updater(current));
  };

  const resetSeedState = () => {
    const seeded = createSeedState();
    setState(seeded);
  };

  return {
    state,
    setState,
    patchState,
    resetSeedState,
  };
}

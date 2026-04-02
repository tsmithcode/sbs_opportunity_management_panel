import { useMonyawn } from "../context/MonyawnContext";
import { nowIso } from "../workflow";
import { validateAppStateIntegrity } from "../integrity";
import { useEnterpriseAdminOps } from "./useAdminOps/enterprise";
import { useReleaseAdminOps } from "./useAdminOps/release";

export function useAdminOps() {
  const { state, patchState, setNotice } = useMonyawn();
  const enterpriseOps = useEnterpriseAdminOps();
  const releaseOps = useReleaseAdminOps();

  const handleIntegrityCheck = () => {
    const report = validateAppStateIntegrity(state);
    if (report.errors.length) {
      setNotice({ tone: "info", message: `Integrity check: ${report.errors.length} errors found.` });
    } else {
      setNotice({ tone: "success", message: report.warnings.length > 0 ? `Integrity check: ${report.warnings.length} warnings.` : "Integrity check passed." });
    }
  };

  const setCorrespondenceStatus = (id: string, status: any) => {
    patchState(current => ({
      ...current,
      correspondence: current.correspondence.map(c => c.correspondence_id === id ? { ...c, status, updated_at: nowIso() } : c),
    }), "Correspondence status updated.");
  };

  return {
    ...enterpriseOps,
    ...releaseOps,
    handleIntegrityCheck,
    setCorrespondenceStatus,
  };
}

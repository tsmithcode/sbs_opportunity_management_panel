import React from "react";
import { useMonyawn } from "../../../../context/MonyawnContext";
import { useAdminOps } from "../../../../hooks/useAdminOps";

export const EnterpriseControls: React.FC = () => {
  const { state } = useMonyawn();
  const { updateEnterpriseControlField, setRoleEntitlementFlag, addEntitlementTemplate } = useAdminOps();

  const selectedEnterpriseControls = state.enterpriseControlProfiles.find(
    (p) => p.account_id === state.selectedAccountId,
  );

  const selectedRoleEntitlements = state.roleEntitlements.filter(
    (e) => e.account_id === state.selectedAccountId,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-6 p-8 rounded-3xl bg-brand-surface-soft border border-black/5 shadow-brand-shadow">
        <h3 className="text-xl font-bold text-brand-ink">Enterprise control profile</h3>
        {selectedEnterpriseControls ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Entitlements mode</span>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white/50 text-sm appearance-none outline-none focus:ring-2 focus:ring-brand-accent"
                  value={selectedEnterpriseControls.entitlements_mode}
                  onChange={(e) => updateEnterpriseControlField("entitlements_mode", e.target.value as any)}
                >
                  <option value="guided_default">Guided default</option>
                  <option value="staff_review">Staff review</option>
                  <option value="admin_controlled">Admin controlled</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Buyer readiness stage</span>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white/50 text-sm appearance-none outline-none focus:ring-2 focus:ring-brand-accent"
                  value={selectedEnterpriseControls.buyer_readiness_stage}
                  onChange={(e) => updateEnterpriseControlField("buyer_readiness_stage", e.target.value as any)}
                >
                  <option value="internal_only">Internal only</option>
                  <option value="guided_pilot">Guided pilot</option>
                  <option value="buyer_reviewable">Buyer reviewable</option>
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Deployment posture</span>
              <textarea
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white/50 text-sm resize-none outline-none focus:ring-2 focus:ring-brand-accent"
                rows={2}
                value={selectedEnterpriseControls.deployment_posture}
                onChange={(e) => updateEnterpriseControlField("deployment_posture", e.target.value)}
              />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-black/10 text-brand-accent focus:ring-brand-accent" checked={selectedEnterpriseControls.external_release_requires_approval} onChange={(e) => updateEnterpriseControlField("external_release_requires_approval", e.target.checked)} />
                <span className="text-xs text-brand-muted group-hover:text-brand-ink transition-colors">Require approval before release</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-black/10 text-brand-accent focus:ring-brand-accent" checked={selectedEnterpriseControls.export_confirmation_required} onChange={(e) => updateEnterpriseControlField("export_confirmation_required", e.target.checked)} />
                <span className="text-xs text-brand-muted group-hover:text-brand-ink transition-colors">Require export confirmation</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-black/10 text-brand-accent focus:ring-brand-accent" checked={selectedEnterpriseControls.allow_sensitive_support_export} onChange={(e) => updateEnterpriseControlField("allow_sensitive_support_export", e.target.checked)} />
                <span className="text-xs text-brand-muted group-hover:text-brand-ink transition-colors">Allow sensitive support export</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-black/10 text-brand-accent focus:ring-brand-accent" checked={selectedEnterpriseControls.local_only_posture_locked} onChange={(e) => updateEnterpriseControlField("local_only_posture_locked", e.target.checked)} />
                <span className="text-xs text-brand-muted group-hover:text-brand-ink transition-colors">Lock local-only posture</span>
              </label>
            </div>
          </div>
        ) : (
          <p className="text-sm text-brand-muted italic text-center p-8 rounded-2xl bg-black/5 border border-dashed border-black/10">Select an account to manage enterprise controls. 🥱</p>
        )}
      </div>

      <div className="flex flex-col gap-6 p-8 rounded-3xl bg-brand-surface-soft border border-black/5 shadow-brand-shadow">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-brand-ink">Entitlements and admin controls</h3>
          <button className="text-[10px] font-bold text-brand-accent hover:underline uppercase tracking-widest" onClick={addEntitlementTemplate}>Add role 🥱</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5">
                <th className="py-3 pr-4 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Role</th>
                <th className="py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">WS</th>
                <th className="py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">ST</th>
                <th className="py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">AD</th>
                <th className="py-3 px-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">EX</th>
                <th className="py-3 pl-4 text-[10px] font-bold uppercase tracking-widest text-brand-muted">DL</th>
              </tr>
            </thead>
            <tbody>
              {selectedRoleEntitlements.map((entitlement) => (
                <tr key={entitlement.entitlement_id} className="border-b border-black/5 last:border-0 hover:bg-black/5 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="text-sm font-bold text-brand-ink">{entitlement.role_name}</p>
                    <p className="text-[10px] text-brand-muted line-clamp-1">{entitlement.notes}</p>
                  </td>
                  <td className="py-4 px-2"><input type="checkbox" className="w-3.5 h-3.5 rounded border-black/10 text-brand-accent" checked={entitlement.workspace_access} onChange={(e) => setRoleEntitlementFlag(entitlement.entitlement_id, "workspace_access", e.target.checked)} /></td>
                  <td className="py-4 px-2"><input type="checkbox" className="w-3.5 h-3.5 rounded border-black/10 text-brand-accent" checked={entitlement.staff_queue_access} onChange={(e) => setRoleEntitlementFlag(entitlement.entitlement_id, "staff_queue_access", e.target.checked)} /></td>
                  <td className="py-4 px-2"><input type="checkbox" className="w-3.5 h-3.5 rounded border-black/10 text-brand-accent" checked={entitlement.admin_console_access} onChange={(e) => setRoleEntitlementFlag(entitlement.entitlement_id, "admin_console_access", e.target.checked)} /></td>
                  <td className="py-4 px-2"><input type="checkbox" className="w-3.5 h-3.5 rounded border-black/10 text-brand-accent" checked={entitlement.export_package_access} onChange={(e) => setRoleEntitlementFlag(entitlement.entitlement_id, "export_package_access", e.target.checked)} /></td>
                  <td className="py-4 pl-4"><input type="checkbox" className="w-3.5 h-3.5 rounded border-black/10 text-brand-accent" checked={entitlement.diligence_packet_access} onChange={(e) => setRoleEntitlementFlag(entitlement.entitlement_id, "diligence_packet_access", e.target.checked)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

type RemovableStorage = Pick<Storage, "removeItem">;

// Retire the previous browser-only analytics and authorization cache. Never touch
// Firebase sessions, enquiry data, or the visitor's current consent preference.
export function clearLegacyTelemetry(local: RemovableStorage, session: RemovableStorage): void {
  for (const key of ["4tech_visitor_logs_v1", "4tech_customer_logins_v1", "4tech_gemini_api_key"]) {
    try { local.removeItem(key); } catch { /* Storage can be unavailable in private browsing. */ }
  }
  for (const key of ["4tech_owner_auth_session", "4tech_visitor_session_id"]) {
    try { session.removeItem(key); } catch { /* No browser flag grants authorization. */ }
  }
}

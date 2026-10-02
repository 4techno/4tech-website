// These switches describe deployed capabilities, not authorization. Firebase rules
// enforce all permissions. Enable only after provisioning and validating services.
export const portalCapabilities = {
  workspace: process.env.NEXT_PUBLIC_PORTAL_WORKSPACE_ENABLED === "true",
  uploads: process.env.NEXT_PUBLIC_PORTAL_UPLOADS_ENABLED === "true",
  emailNotifications: process.env.NEXT_PUBLIC_PORTAL_EMAIL_ENABLED === "true",
  visitorAnalytics: process.env.NEXT_PUBLIC_PORTAL_ANALYTICS_ENABLED === "true" && !!process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY,
};

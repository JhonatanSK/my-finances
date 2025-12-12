/**
 * User Entitlements / Feature Flags
 * 
 * Define user permissions and feature availability.
 * Initially all features are disabled (false).
 * Future implementations will control:
 * - Pro features access
 * - Ads display
 * - Cloud sync availability
 */
export interface UserEntitlements {
  /**
   * Whether user has Pro subscription
   * Controls access to premium features
   */
  isPro: boolean;

  /**
   * Whether ads should be displayed
   * When false, ads are hidden
   */
  adsEnabled: boolean;

  /**
   * Whether cloud sync is enabled
   * When false, only local storage is used
   */
  cloudSyncEnabled: boolean;
}

/**
 * Default entitlements (all features disabled)
 */
export const defaultEntitlements: UserEntitlements = {
  isPro: false,
  adsEnabled: false,
  cloudSyncEnabled: false,
};


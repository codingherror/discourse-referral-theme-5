import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "referral-nav",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.addUserMenuGlyph({
        label: "Referrals",
        icon: "gift",
        href: (user) => `/u/${user.username}/referrals`,
        className: "referrals-link"
      });

      api.addNavigationBarItem({
        name: "referrals",
        displayName: "Referrals",
        href: (user) => `/u/${user.username}/referrals`
      });
    });
  }
};
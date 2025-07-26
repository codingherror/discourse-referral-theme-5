import Controller from "@ember/controller";
import { ajax } from "discourse/lib/ajax";
import { property } from "discourse/lib/computed";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default Controller.extend({
  referralCode: null,
  totalPoints: 0,
  referrals: [],
  referralLink: null,

  loadData() {
    const user = this.model;
    ajax(`/u/${user.username}.json`).then((data) => {
      const customFields = data.user.custom_fields || {};
      const referralCode = customFields.referral_code || null;
      const totalPoints = customFields.referral_points || 0;

      ajax(`/invites/show.json?username=${user.username}`).then((inviteData) => {
        const referrals = inviteData.invites
          .filter((invite) => invite.redeemed)
          .map((invite) => ({
            username: invite.user ? invite.user.username : "Unknown",
            date: invite.redeemed_at
          }));

        this.setProperties({
          referralCode,
          totalPoints,
          referrals,
          referralLink: referralCode ? `${window.location.origin}/i/${referralCode}` : null
        });
      }).catch(popupAjaxError);
    }).catch(popupAjaxError);
  },

  actions: {
    generateReferral() {
      ajax("/invites/link", {
        type: "POST",
        data: { user_id: this.model.id }
      }).then((data) => {
        const referralCode = data.invite_key;
        ajax(`/u/${this.model.username}/custom_fields.json`, {
          type: "PUT",
          data: { custom_fields: { referral_code: referralCode } }
        }).then(() => {
          this.setProperties({
            referralCode,
            referralLink: `${window.location.origin}/i/${referralCode}`
          });
        }).catch(popupAjaxError);
      }).catch(popupAjaxError);
    }
  }
});
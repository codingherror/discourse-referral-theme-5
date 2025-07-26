import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    return this.modelFor("user");
  },

  setupController(controller, model) {
    controller.set("model", model);
    this.controllerFor("user-referrals").loadData();
  }
});
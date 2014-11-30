define(['backbone', 'socketio', 'router/router', 'socketio'], function(Backbone, socket, Router, socket) {
  var AppView = Backbone.View.extend({
    tagName: 'div',
    el: $('body'),
    initialize: function() {
      var router = new Router({});

      Backbone.pubsub = _.extend({}, Backbone.Events); //create pubsub
      Backbone.history.start();

      router.navigate("live", {trigger: true});
    },
  });
  return AppView;
});

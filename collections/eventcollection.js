define(['backbone', 'underscore', 'models/event'], function(Backbone, _, Event) {
  var EventCollection = Backbone.Collection.extend({
    model: Event,
    url: "/events",
    initialize: function() {
      
    }
  });
  return EventCollection;
});
define(['backbone', 'underscore'], function(Backbone, _) {
  var Sensor = Backbone.Model.extend({
    initialize: function() {
      
    },
    urlRoot: '/sensor'
  });
  return Sensor; 
});
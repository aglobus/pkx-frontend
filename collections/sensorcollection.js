define(['backbone', 'underscore', 'models/sensor'], function(Backbone, _, Sensor) {
  var SensorCollection = Backbone.Collection.extend({
    model: Sensor,
    url: '/sensor',
    parse: function(response) { //override parse function
      return _.toArray(response);
    }
  });
  return new SensorCollection;
});

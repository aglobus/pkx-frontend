define(['backbone', 'underscore', 'models/alarm'], function(Backbone, _, Alarm) {
  var AlarmCollection = Backbone.Collection.extend({
    model: Alarm,
    url: '/alarms',
    initialize: function() {
      
    },
    updateAll: function() {
      var collection = this;
      options = {
        success: function(model, resp, xhr) {
          collection.reset(model);
        }
      };
      return Backbone.sync('update', this, options);
    }
  });
  return AlarmCollection;
});
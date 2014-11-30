define(['backbone'], function(Backbone) {
  var Alarm = Backbone.Model.extend({
    initialize: function() {
      this.id = this.get('_id');
    }
  });
  return Alarm; 
});
define(['backbone', 'underscore', 'text!templates/logged/alarmconfig_template.html'], function(Backbone, _, AlarmConfigTemplate) {
  var AlarmConfig = Backbone.View.extend({
    template: _.template(AlarmConfigTemplate),
    initialize: function() {
    },
    render: function(config) {
      $(this.el).html(this.template(config));
    }
  });
  return AlarmConfig;
});
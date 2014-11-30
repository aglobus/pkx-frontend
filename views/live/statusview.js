define(['backbone', 'underscore', 'text!templates/live/status_template.html', 'socketio'], function(Backbone, _, statusTemplate, socket) {
  var StatusView = Backbone.View.extend({
    template: _.template(statusTemplate),
    initialize: function() {
      _.bindAll(this);
      this.model.bind('change', this.render, this);
      this.socket = io.connect('');
      this.socket.on('status', this.setAttributes);
    },
    setAttributes: function(obj) {
      if (obj.id === this.model.get('id')) {
        this.model.set({'temperature': obj.temperature});
        this.model.set({'opticalpower': obj.opticalpower});
        this.model.set({'windspeed': obj.windspeed});
      }
    },
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
    }
  });
  return StatusView;
});
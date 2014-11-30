define(['backbone', 'underscore', 'text!templates/header_template.html'], function(Backbone, _, headerTemplate) {
  var HeaderView = Backbone.View.extend({
    template: _.template(headerTemplate),
    initialize: function() {
      this.render();
      this.options.socket.on('audio', this.playAudio);
    },
    render: function() {
      $(this.el).html(this.template());
    },
    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    },
    playAudio: function() {
      document.getElementById("audio").play()
    }
  });

  return HeaderView;
});

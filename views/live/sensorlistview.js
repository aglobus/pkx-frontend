define(['backbone', 'underscore', 'text!templates/live/listentry_template.html'], function(Backbone, _, EntryTemplate) {
  var SensorListView = Backbone.View.extend({    
    initialize: function() {
      _.bindAll(this);
      this.collection.on('add', this.addOne, this);
      this.collection.on('destroy', this.removeEntry, this);
      this.collection.on('change:connected', this.changeStatus, this);
      Backbone.pubsub.on('sensor:updated', this.refresh, this);
      this.addAll();
    },
    events: {
      'click li': 'handleClick'
    },
    template: _.template(EntryTemplate),
    addOne: function(sensor) {
      this.$el.append(this.template(sensor.toJSON()));
    },
    addAll: function() {
      //triggered on reset, reset html back to original
      $(this.el).html('<li class="nav-header"></li>');
      this.collection.forEach(this.addOne, this);
    },
    handleClick: function(evt) {
      var target = $(evt.currentTarget);
      
      if (target.attr('class') !== 'nav-header') {
        $('[class="active"]').removeAttr('class');
        target.attr('class', 'active');
      }
    },
    highlight: function(id) {
     $(document.getElementById(id)).attr('class', 'active');
    },
    refresh: function(sensor) {
      $(document.getElementById(sensor.id)).replaceWith(this.template(sensor.toJSON()));
      this.highlight(sensor.id);
    },
    removeEntry: function(sensor) {
      $(document.getElementById(sensor.id)).remove()
    },
    changeStatus: function(sensor) {
      if (!sensor.get('actions').log.enabled && sensor.get('connected')) {
        $(document.getElementById(sensor.id)).find('img').attr('src', 'img/yellow.png')
      } else if (sensor.get('connected')) {
        $(document.getElementById(sensor.id)).find('img').attr('src', 'img/green.png')
      } else {
        $(document.getElementById(sensor.id)).find('img').attr('src', 'img/red.png')
      }
    }
  });
  return SensorListView;
});

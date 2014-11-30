define(['backbone', 'globals', 'underscore', 'socketio', 'views/header', 'views/logged/logged', 'views/live/live', 'views/action/action', 'collections/sensorcollection', 'models/sensor'], function(Backbone, globals, _, socket, HeaderView, LoggedView, LiveView, ActionView, sensors, Sensor) {
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      "live/:id": "showSensor",
      'logged': 'logged',
      'live': 'live',
      'action': 'action'
    },

    logged: function() {
      $(".content").html("");
      this.headerView.selectMenuItem('logged-menu');
      if (this.LoggedView) {
        this.LoggedView.closeSubViews();
        this.LoggedView.remove();
        this.LoggedView.unbind();
      }
      this.LoggedView = new LoggedView();
      $(".content").html(this.LoggedView.render().el);
      
      this.socket.removeListener('message', this.plot);
      this.current = this.LoggedView;
    },

    live: function() {
      $(".content").html("");
      this.headerView.selectMenuItem('live-menu');

      if (!this.LiveView) {
        this.LiveView = new LiveView({
          collection: this.collection
        });
      }
      $(".content").html(this.LiveView.render().el);

      this.socket.removeListener('message', this.plot);
      this.current = this.LiveView;
    },

    action: function() {
      $(".content").html("");
      this.headerView.selectMenuItem('action-menu');
      if (this.ActionView) {
        this.ActionView.remove();
        this.ActionView.unbind();
      }
      this.ActionView = new ActionView({
        collection: this.collection
      });
      $(".content").html(this.ActionView.render().el);

      this.socket.removeListener('message', this.plot);
      this.current = this.ActionView;
    },

    initialize: function() {
      _.bindAll(this);
      this.socket = io.connect();

      this.collection = sensors;
      _.each(globals.sensors, function(sensor) {
        this.collection.add(sensor); //add the bootstrapped data in
      }, this);
      
      this.headerView = new HeaderView({socket: this.socket});
      $('.header').html(this.headerView.el);
      
      this.socket.on('sensor:new', this.newSensor);
      this.socket.on('sensor:removed', this.removeSensor);
    },
    
    newSensor: function(id) {
      var model;
      if (this.collection.get(id)) {
        model = this.collection.get(id);
        model.set({'connected': true});
      } else {
        model = new Sensor();
        model.set("id", id);
        model.fetch({success: this.addToCollection});
      }
    },
    
    removeSensor: function(id) {
      var model = this.collection.get(id);
      model.set({'connected': false});
    },
    
    addToCollection: function(model) {
      this.collection.add(model);
    },
    
    index: function() {
      // this.headerView.selectMenuItem('');
      // $('.content').html('');
    },

    showSensor: function(id) {
      this.socket.removeListener('message', this.plot);
      
      if (!(this.current === this.LiveView) || this.current === undefined) {
        this.live();
      }

      this.headerView.selectMenuItem('live-menu');
      this.LiveView.subrender(id);

      this.socket.emit('room', id);

      this.socket.on('message', this.plot);
    },
    
    plot: function(obj) {
      this.LiveView.plot(obj.data, obj.id);
    }

  });
  return Router;
});

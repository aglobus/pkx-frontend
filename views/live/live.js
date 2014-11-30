define(['backbone', 
        'underscore', 
        'views/live/sensorlistview', 
        'views/live/configview', 
        'views/live/graphview', 
        'text!templates/live/live_template.html', 
        'globals'], function(Backbone, 
                             _,
                             SensorListView, 
                             ConfigView, 
                             GraphView, 
                             liveTemplate, 
                             globals) {
                               
  var LiveView = Backbone.View.extend({
    template: _.template(liveTemplate),
    initialize: function() {
      
    },
    render: function() { //render list of sensors      
      $(this.el).html(this.template());
      this.renderSidebar();
      return this;
    },
    renderSidebar: function() {
      if (this.sensorListView) {
        this.sensorListView.remove();
        this.sensorListView.unbind();
      }
      this.sensorListView = new SensorListView({collection: this.collection, el: $(this.el).find('.nav-list')});
    },
    subrender: function(id) {
      if (this.collection.get(id)) {
        this.id = id;
                 
        if (this.sensorListView) {
          this.sensorListView.highlight(id);
        }
    
        this.removeChildren();
        
        this.configView = new ConfigView({model: this.collection.get(id)});
        $("#config").html(this.configView.render().el);        

        this.graphView = new GraphView({model: this.collection.get(id)});
        $("#fftplot").html(this.graphView.render().el);
        this.graphView.graph([0,1]);
      }
    },
    removeChildren: function() {
      if (this.configView) {
        this.configView.remove();
        this.configView.unbind();
      }
      
      if (this.graphView) {
        this.graphView.remove();
        this.graphView.unbind();
        this.graphView.unbindAll(); //unbind flot bindings
      }
    },
    plot: function(data, id) {
        if (id === this.id && this.graphView.isOkToPlot() && $("#fftplot").length) {
          this.graphView.graph(data);
        }
    }
    
  });
  return LiveView;
});

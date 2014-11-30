//Top level view for the logged page
define(['backbone', 'underscore', 'text!templates/logged/logged_template.html', 'views/logged/alarmtable', 'views/logged/alarmgraph', 'views/logged/alarmconfig', 'collections/alarmcollection', 'collections/eventcollection'], function(Backbone, _, loggedTemplate, AlarmTable, AlarmGraph, AlarmConfig, AlarmCollection, EventCollection) {
  var LoggedView = Backbone.View.extend({
    template: _.template(loggedTemplate),
    
    initialize: function() {
      this.alarmCollection = new AlarmCollection();
      this.alarmCollection.fetch();
      this.alarmCollection.on('reset', function() {
        this.eventCollection = new EventCollection();
        this.eventCollection.fetch();
        this.eventCollection.on('reset', this.subrender, this);
      }, this);
    },
    
    render: function() {
      $(this.el).html(this.template());
      return this;
    },
    
    subrender: function() {
      this.alarmtable = new AlarmTable({el: "#table", collection: this.alarmCollection});
      this.alarmgraph = new AlarmGraph({});
      this.alarmconfig = new AlarmConfig({el: "#alarm-config"});
      
      this.alarmtable.on('alarmtable:select', this.alarmTableSelect, this);
    },
    
    closeSubViews: function() {
      this.alarmtable.remove();
      this.alarmtable.unbind();
      
      this.alarmgraph.remove();
      this.alarmgraph.unbind();

      this.alarmconfig.remove();
      this.alarmconfig.unbind();
    },
    
    alarmTableSelect: function(id) {
      $("#placeholder").height(400);
      
      var event_ids = this.alarmCollection.get(id).get('event_ids');
      var config = this.alarmCollection.get(id).get('config');
      
      var array = [];
      array = _.filter(this.eventCollection.models, function(c) {
        return _.include(event_ids, c.get("_id"))
      });
      console.log(array);
      
      var entry =  {};
      for (var i=0; i < array.length; i++) {
        entry['event '+ i] = {label: "Event " + (i + 1), data: array[i].attributes.data}
      };
      this.alarmgraph.render(entry, config);
      this.alarmconfig.render(config);
    }
    
  });
  return LoggedView;
});
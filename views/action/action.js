define(['backbone', 
        'underscore', 
        'text!templates/action/action_template.html', 
        'views/action/actiontable', 
        'views/action/actionconfig', 
        'globals'], function(
          Backbone, 
          _, 
          actionTemplate, 
          ActionTable, 
          ActionConfig,
          globals) {
             
  var ActionView = Backbone.View.extend({
    template: _.template(actionTemplate),
    
    initialize: function() {
      console.log('action view init');
      _.bindAll(this);
    },
    
    render: function() {
      $(this.el).html(this.template());
      this.renderTable();
      return this;
    },
    
    renderTable: function() {
      this.actionTable = new ActionTable({el: $(this.el).find('#actiontable'), collection: this.collection});
      this.actionTable.render();
      
      this.actionTable.on('actiontable:select', this.renderConfig, this); 
      this.actionTable.on('actiontable:toggle', this.renderConfig, this);
      //TODO consider modelbinder/rivets to avoid re-rendering the entire view
    },
    
    renderConfig: function(id) {
       if (this.actionConfig) {
         this.actionConfig.remove();
         this.actionConfig.unbind();
       }
       this.actionConfig = new ActionConfig({model: this.collection.get(id)});
       $("#actionconfig").append(this.actionConfig.render().el);
      //this.actionConfig = new ActionConfig({el: "#actionconfig", model: this.collection.get(id)});
      //this.actionConfig.render();
    },
    
  });
  return ActionView;
});

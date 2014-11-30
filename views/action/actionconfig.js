define(['backbone', 'underscore', 'text!templates/action/actionconfig_template.html', 'maskedinput', 'validate'], function(Backbone, _, ActionConfigTemplate) {
  var ActionConfig = Backbone.View.extend({
    template: _.template(ActionConfigTemplate),
    events: {
      'click #inputnumber': 'addNumber',
      'click .delete': 'deleteNumber',
      'keyup input[type=text]': 'changeText',
      'click #saveRelays': 'saveRelays'
    },
    initialize: function() {
      console.log('action conf init');
    },
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).find("#inputnumberfield").mask("(999) 999-9999", {
        placeholder: " "
      });
      return this;
    },
    addNumber: function() {
      var raw_input = $("#inputnumberfield").val();
      var number = raw_input.replace(/[^0-9]/g, ''); 
      if (number === "" || (this.model.get('actions').textmessage.numbers.indexOf("+1" + number)) >= 0)
        return;
      number = "+1" + number;
      this.model.get('actions').textmessage.numbers.push(number);
      this.model.save();
      this.render();
      $("#inputnumberfield").val("");
    },
    deleteNumber: function(evt) {
      var number = $(evt.target.parentNode).parent().text().replace(/\s+/g, '');
      console.log(number);
      
      var numbers = this.model.get('actions').textmessage.numbers;
      numbers.splice(numbers.indexOf(number), 1);
      this.model.get('actions').textmessage.numbers = numbers;
      this.model.save();
      $(evt.target.parentNode).parent().remove();
      
      $(this.el).html(this.template(this.model.toJSON())); //re-render entire view because input won't slide up when number is deleted 
    },
    changeText: function(evt) {
      this.highlightSaveButton();
    },
    highlightSaveButton: function() {
      $('#saveRelays').addClass('btn-danger');
    },
    validate: function() {
      regula.bind();
      this.validationResults = regula.validate();
      return this.validationResults.length === 0;
    },
    displayErrors: function() {
      var validationResults = this.validationResults;
      for(var i = 0; i < validationResults.length; i++) {
           var validationResult = validationResults[i];
           this.newAlert('alert-error', validationResult.message, 5000);
      }
    },
    newAlert: function(type, message) {
        $("#alert-area").append($("<div class='alert " + type + " fade in'>" + message + "</div>"));
    },
    saveRelays: function() {
      if (this.validate()) {
        this.model.get('actions')['relay1'].ontime = JSON.parse($("#relay1-value").val());
        this.model.get('actions')['relay2'].ontime = JSON.parse($("#relay2-value").val());
        this.model.save();
        $('#saveRelays').removeClass('btn-danger'); //should be in success callback, do later
      }
    }
  });
  return ActionConfig;
});

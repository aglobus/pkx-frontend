define(['backbone', 'underscore', 'text!templates/live/config_template.html', 'views/live/statusview', 'bootstrap', 'validate', 'jqueryui', 'jqueryuitouchpunch'], function(Backbone, _, configtemplate, StatusView) {
  var ConfigView = Backbone.View.extend({
    template: _.template(configtemplate),
    events: {
      'keyup input[type=text]': 'changedText',
      'click #getValues': 'getConfig',
      'click #setValues': 'saveConfig',
      'click #deleteSensor': 'deleteSensor'
    },
    initialize: function() {
      _.bindAll(this);
      this.model.fetch(); //get config settings
      Backbone.pubsub.on('graph:bboxset', this.highlightSaveButton);
      this.unsavedAttributes = {};
    },
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).find('input[type=text]').popover({"trigger": "focus"});
      if (this.statusView) {
        this.statusView.remove();
        this.statusView.unbind();
      }
      this.statusView = new StatusView({el: $(this.el).find("#status"), model: this.model})
      this.statusView.render();
      
      var self = this;
      // this.initSlider("#hwgain", 0, 7, 1, this.model.get('hwgain'), "");
      // this.initSlider("#secondsToAlarm", .2, 10, .2, this.model.get('secondsToAlarm'), "Seconds");
      // this.initSlider("#eventTime", .2, 3, .2, this.model.get('eventTime'), "Seconds");
      // this.initSlider("#attenuation", 0, 1, .1, this.model.get('attenuation'), "");
	  
      this.initSlider("#hwgain", 0, 7, 1, this.model.get('hwgain'), "");
      // this.initSlider("#secondsToAlarm", .2, 10, .2, this.model.get('secondsToAlarm'), "Seconds");
      this.initSlider("#eventTime", 0, 3, .2, this.model.get('eventTime'), "Seconds");
      this.initSlider("#eventsToTriggerAlarm", 1, 3, 1, this.model.get('eventsToTriggerAlarm'), " : 1");
	    this.initSlider("#attenuation", 0, 3, .5, this.model.get('attenuation'), "");
      return this;
    },
    initSlider: function(id, min, max, step, value, text) {
      var self = this;
      $(this.el).find(id).slider({
        range: "min",
        min: min,
        max: max,
        step: step,
        value: value,
        slide: function(event, ui) {
          self.highlightSaveButton();
          var value = ui.value;
          var field = event.target.id;
          self.unsavedAttributes[field] = value;
          $(event.target.parentNode.getElementsByClassName("val")).html(value + " " + text);
        }
      });
    },
    highlightSaveButton: function() {
      $('#setValues').addClass('btn-danger');
    },
    changedText: function(evt) {
      this.highlightSaveButton();
      var target = $(evt.currentTarget);
      var value = target.val();
      var field = evt.currentTarget.id;
      if (this.validate()) {
        this.unsavedAttributes[field] = value;
      }
    },
    getConfig: function() {
      var self = this;
      this.model.fetch({success: function(model) {
       self.model = model;
       self.render();
       Backbone.pubsub.trigger('sensor:updated', self.model); //for sensorlistview
      }});
    },
    checkRatio: function() {
      if (this.unsavedAttributes.eventsToTriggerAlarm || this.unsavedAttributes.secondsToAlarm) {
        var eventsToTriggerAlarm = this.unsavedAttributes.eventsToTriggerAlarm || this.model.get('eventsToTriggerAlarm');
        var secondsToAlarm = this.unsavedAttributes.secondsToAlarm || this.model.get('secondsToAlarm');
        if (secondsToAlarm / eventsToTriggerAlarm < 1) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    },
    saveConfig: function() {
      // if (!this.checkRatio()) {
      //   return;
      // }
      var self = this;
      $("#alert-area").html("");
      if (this.validate()) {
        this.model.set(this.unsavedAttributes);
        this.model.save(null, {success: function() {
          $('#setValues').removeClass('btn-danger');   
          // self.newAlert('alert-success', "Sensor config updated");
          // $(".alert").delay(1250).slideUp(function () { $(self).remove(); });
          Backbone.pubsub.trigger('sensor:updated', self.model); 
        }});
        this.unsavedAttributes = {};
      } else {
        this.displayErrors();
      }
    },
    deleteSensor: function() {
      var self = this;
      if (confirm('Are you sure?')) {
        this.model.destroy({success: function() {
          self.$el.html("");
        }});
      }
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
            var el = $("#alert-area").append($("<div class='alert " + type + " fade in'>" + message + "</div>")).hide();
            el.slideDown(200);
    }
  });
  return ConfigView;
});

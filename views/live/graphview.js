define(['backbone',
        'underscore',
        'collections/sensorcollection',
        'text!templates/live/graph_template.html',
        'text!templates/alert_template.html',
        'flot',
        'curvedlines',
        'selection'], function(Backbone, _, sensors, graphTemplate, alertTemplate) {
  var Graph = Backbone.View.extend({
    template: _.template(graphTemplate),
    initialize: function() {
      _.bindAll(this);
      
      this.mouseNotHeldDown = 1;
      this.live = 1;
      
    },
    render: function() {
      var $newel, html, $oldel = this.$el;
      html = this.template();
      $newel=$(html);
      // setElement takes care of this.undelegateEvents
      // but don't forget to unbind any other event manually set
      this.setElement($newel);
      //reinject the element in the DOM
      $oldel.replaceWith($newel);
      
      
      $(this.el).bind('plotselecting', this.plotSelecting);
      $(this.el).bind("plotselected", this.plotSelected);
      $(this.el).bind("mousedown", this.toggleMouse);
      // 
      // var self = this;
      // $(this.el).hover(function() {
      //   if (!self.displayedInstructions) {
      //     var template = _.template(alertTemplate);
      //     var el = $("#alert-area").append(template({type: ""})).hide();
      //     el.slideDown();
      //     self.displayedInstructions = 1;
      //   }
      // }, function() {
      //   $(".alert").slideUp(function () { 
      //     $(".alert").remove(); 
      //     self.displayedInstructions = 0;
      //   });
      // });
      // 
      return this;
    },
    plotSelecting: function(event, ranges) {
      if (ranges != null) 
        if (this.mouseNotHeldDown) 
          this.mouseNotHeldDown = 0;
    },
    
    plotSelected: function(event, ranges) {
      this.model.set({
        x1: JSON.parse(Math.round(ranges.xaxis.from.toFixed(1))),
        x2: JSON.parse(Math.round(ranges.xaxis.to.toFixed(1))),
        y1: JSON.parse((Math.round(ranges.yaxis.from * 2) / 2).toFixed(2)),
        y2: JSON.parse((Math.round(ranges.yaxis.to * 2) / 2).toFixed(2)),
        // x1: Math.round(ranges.xaxis.from.toFixed(1)),
        // x2: Math.round(ranges.xaxis.to.toFixed(1)),
        // y1: Math.round(ranges.yaxis.from.toFixed(1)),
        // y2: Math.round(ranges.yaxis.to.toFixed(1))
      });
      this.mouseNotHeldDown = 1;
      Backbone.pubsub.trigger('graph:bboxset');
    },
    
    unbindAll: function() {
      $(this.el).unbind("plotselecting");
      $(this.el).unbind("plotselected");
      $(this.el).unbind("mousedown");
    },
    toggleMouse: function() {
      var self = this;
      this.mouseNotHeldDown = 0;
      setTimeout(function() {
        self.mouseNotHeldDown = 1;
      }, 500);
    },
    setLive: function(x) {
      this.live = x;
    },
    isOkToPlot: function() {
      return (this.mouseNotHeldDown && this.live);
    },
    graph: function(d) {
      $.plot($(this.el), [d], {
        series: {
          shadowSize: 0,
          color: '#0000ff',
          curvedLines: {
            active: true,
            show: true
          }
        },
        // drawing is faster without shadows
        yaxis: {
          min: 0,
          max: this.model.get('gain')
        },
        xaxis: {
          tickFormatter: function formatter(val, axis) {
            return (val * 10).toFixed(axis.tickDecimals);
          },
          axisLabel: 'Frequency (Hz)'
        },
        // points: {show: true},
        // lines: {show: true},
        selection: {
          mode: "xy"
        },
        grid: {
          markings: [{
            color: '#384FE8',
            lineWidth: 2,
            yaxis: {
              from: this.model.get('y2'),
              to: this.model.get('y2')
            }
          }, {
            color: '#384FE8',
            lineWidth: 2,
            yaxis: {
              from: this.model.get('y1'),
              to: this.model.get('y1')
            }
          }, {
            color: '#384FE8',
            lineWidth: 2,
            xaxis: {
              from: this.model.get('x2'),
              to: this.model.get('x2')
            }
          }, {
            color: '#384FE8',
            lineWidth: 2,
            xaxis: {
              from: this.model.get('x1'),
              to: this.model.get('x1')
            }
          }, {
            color: '#f6f6f6',
            yaxis: {
              to: this.model.get('y1')
            }
          }, {
            color: '#f6f6f6',
            xaxis: {
              to: this.model.get('x1')
            }
          }, {
            color: '#f6f6f6',
            yaxis: {
              from: this.model.get('y2')
            }
          }, {
            color: '#f6f6f6',
            xaxis: {
              from: this.model.get('x2')
            }
          }]
        }
      });
    },
  });
  return Graph;
});

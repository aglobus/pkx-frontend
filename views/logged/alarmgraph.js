define(['backbone', 'jquery', 'underscore', 'flot', 'curvedlines', 'selection', 'axislabel'], function(Backbone, $, _) {
  var AlarmGraph = Backbone.View.extend({
    initialize: function() {
      
    },
    render: function(datasets, config) {
      
      // hard-code color indices to prevent them from shifting when toggled on/off
      var i = 3; //green
      $.each(datasets, function(key, val) {
          val.color = i;
          ++i;
      });
    
      // insert checkboxes 
      var choiceContainer = $("#choices");
      choiceContainer.html("");
      
      $.each(datasets, function(key, val) {
          choiceContainer.append('<input type="checkbox" name="' + key +
                                 '" checked="checked" id="id' + key + '">' +
                                 '<span for="id' + key + '"> '
                                  + val.label + '</span> &nbsp; <br>');
      });
      choiceContainer.find("input").click(plotAccordingToChoices);

      function plotAccordingToChoices() {
          var data = [];

          choiceContainer.find("input:checked").each(function () {
              var key = $(this).attr("name");
              if (key && datasets[key])
                  data.push(datasets[key]);
          });

            var entry = [];
            for (var i=0; i < data.length; i++) {
              entry.push({data: data[i].data, color: data[i].color, label: data[i].label, curvedLines: { show: true}});
            };
            $.plot($("#placeholder"), entry, {
              yaxis: {
                min: 0,
                max: config.gain
              },
                xaxis: {
                  tickFormatter: function formatter(val, axis) {
                    return (val * 7.8).toFixed(axis.tickDecimals);
                  },
                  axisLabel: 'Frequency (Hz)',
                  axisLabelFontSizePixels: 12,
                },
                series: { curvedLines: { active: true }},
                grid: {
                  markings: [{
                    color: '#384FE8',
                    lineWidth: 2,
                    yaxis: {
                      from: config.y2,
                      to: config.y2
                    }
                  }, {
                    color: '#384FE8',
                    lineWidth: 2,
                    yaxis: {
                      from: config.y1,
                      to: config.y1
                    }
                  }, {
                    color: '#384FE8',
                    lineWidth: 2,
                    xaxis: {
                      from: config.x2,
                      to: config.x2
                    }
                  }, {
                    color: '#384FE8',
                    lineWidth: 2,
                    xaxis: {
                      from: config.x1,
                      to: config.x1
                    }
                  }, {
                    color: '#f6f6f6',
                    yaxis: {
                      to: config.y1
                    }
                  }, {
                    color: '#f6f6f6',
                    xaxis: {
                      to: config.x1
                    }
                  }, {
                    color: '#f6f6f6',
                    yaxis: {
                      from: config.y2
                    }
                  }, {
                    color: '#f6f6f6',
                    xaxis: {
                      from: config.x2
                    }
                  }]
                },
            });  
          
      }

      plotAccordingToChoices();
    }
  });
  return AlarmGraph;
});

define(['backbone', 'underscore', 'text!templates/action/actiontable_template.html', 'datatables'], function(Backbone, _, tableTemplate) {
  var ActionTable = Backbone.View.extend({
    template: _.template(tableTemplate),
    events: {
      'click tr': 'selectActiveRow',
      'click input[type=checkbox]': 'toggleCheckBox'
    },
    initialize: function() {},
    render: function() {
      $(this.el).html(this.template({
        collection: this.collection
      }));
      this.table = $(this.el).find('.table').dataTable({
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": false,
        "bInfo": false,
        "bAutoWidth": false
      });
    },
    selectActiveRow: function(event) {
      if ($(event.target.parentNode).attr('role') === 'row') {
        return;
      }

      if ($(event.target.parentNode).is('tr')) {
        $(this.table.fnSettings().aoData).each(function() {
          $(this.nTr).removeClass('active');
        });
        $(event.target.parentNode).addClass('active');
        this.trigger('actiontable:select', event.target.parentNode.id);
        this.currentlySelected = event.target.parentNode.id;
      }
    },
    toggleCheckBox: function(event) {
      var value = event.target.checked;
      var action = event.target.id;
      var sensor = $(event.target).closest('tr').attr('id');
      this.collection.get(sensor).get('actions')[action].enabled = value;
      this.collection.get(sensor).save();

      var id = $(event.target).parents('tr').attr('id');
      if (this.currentlySelected === id) {
        this.trigger('actiontable:toggle', id);
      }
    }
  });
  return ActionTable;
});

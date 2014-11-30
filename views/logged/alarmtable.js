define(['backbone', 'underscore', 'text!templates/logged/alarmtable_template.html', 'datatables', 'dt_bootstrap', 'dateformat'], function(Backbone, _, alarmTableTemplate) {
  var AlarmTable = Backbone.View.extend({
    tagname: 'div',
    template: _.template(alarmTableTemplate),
    events: {
      'click td': 'selectActiveRow',
      'click #checkbox': 'checkRow',
      'click #deleteSelected': 'deleteSelected',
      'click #deleteAll': 'deleteAll',
      'blur td.comment': 'saveComment',
    },
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template({
        collection: this.collection
      }));
      this.table = $('.table').dataTable({"sPaginationType": "bootstrap", "bDestroy": true, "aaSorting": [[ 0, "desc" ]]}, 0);
    },
    remove: function() {
      this.table.fnDestroy();
      Backbone.View.prototype.remove.call(this);
    },
    selectActiveRow: function(event) {
      if ($(event.target.parentNode).is('tr')) {
        $(this.table.fnSettings()
          .aoData)
          .each(function() {
            $(this.nTr)
            .removeClass('active');
          });
        $(event.target.parentNode).addClass('active');  
        this.trigger('alarmtable:select', $(event.target.parentNode).attr('id'));
      }
    },
    deleteSelected: function() {
      var self = this;
      $('.checked').each(function(index){
         self.table.fnDeleteRow($(this)[0]);
         self.collection.remove($(this).attr('id')); //remove from collection
         // self.collection.get($(this).attr('id')).destroy(); //the same as the ajax call below?
         $.ajax({
           type: "DELETE",
           url: "/alarms" + "/" + $(this).attr('id')
         }).done(function(msg) {
         });
      });
    },
    deleteAll: function() {
      if (confirm("Delete All?")) {
        $.ajax({
          type: "DELETE",
          url: "/alarms"
        }).done(function(msg) {
          window.location.reload();
        });
      }
    },
    checkRow: function(evt) {
      var target = $(evt.target).closest('tr');
      if (target.hasClass('checked')) {
        target.removeClass('checked');
      } else {
        target.addClass('checked');
      }
    },
    saveComment: function(evt) {
      var comment = evt.target.textContent;
      var id = evt.target.parentElement.getAttribute('id');
      this.collection.get(id).set({'comment': comment});
      this.collection.get(id).save();
      // this.collection.updateAll();
    }
  });
  return AlarmTable;
});

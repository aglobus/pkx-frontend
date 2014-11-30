(function() {
  require.config({
    baseUrl: 'javascripts',
    shim: {
      'underscore': {
        exports: '_'
      },
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'flot': ['jquery'],
      'curvedlines': ['flot'],
      'selection': ['flot'],
      'axislabel': ['flot'],
      'bootstrap': ['jquery'],
      'datatables': ['jquery'],
      'dt_bootstrap': ['datatables'],
      'nvd3': ['d3'],
      'maskedinput': ['jquery'],
      'jqueryui': ['jquery'],
      'jqueryuitouchpunch': ['jquery', 'jqueryui']
    },
    paths: {
      jquery: 'lib/jquery/jquery',
      jqueryuitouchpunch: 'lib/jquery/jquery.ui.touchpunch',
      jqueryui: 'lib/jquery/jquery.ui',
      backbone: 'lib/backbone/backbone.min',
      underscore: 'lib/underscore/underscore.min',
      flot: 'lib/jquery/jquery.flot',
      text: 'lib/text',
      socketio: '/socket.io/socket.io',
      curvedlines: 'lib/jquery/curvedLines',
      selection: 'lib/jquery/jquery.flot.selection',
      axislabel: 'lib/jquery/jquery.flot.axislabels',
      bootstrap: 'lib/bootstrap/bootstrap',
      datatables: 'lib/jquery/jquery.dataTables.min',
      dt_bootstrap: 'lib/datatables/DT_bootstrap',
      d3: 'lib/d3/d3.v2.min',
      nvd3: 'lib/nvd3/nv.d3.min',
      validate: 'lib/validate/validate.min',
      dateformat: 'lib/misc/dateformat',
      maskedinput: 'lib/jquery/jquery.maskedinput',
    }
  });

  require(['views/app'], function(AppView) {
    var appView = new AppView();
  });

}());

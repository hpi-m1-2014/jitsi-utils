(function (exports) {
  var app = {components: {}};

  app.components.App = React.createClass({
    render: function () {
      return React.DOM.h1({}, 'APP');
    }
  });

  app.components.List = React.createClass({
    render: function () {
      return '';
    }
  });

  app.components.Player = React.createClass({
    render: function () {
      return '';
    }
  });

  app.initialize = function initialize(root) {
    React.renderComponent(app.components.App({}), root);
  };

  exports.app = app;
})(this);

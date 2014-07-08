(function (exports) {
  var app = {components: {}};

  app.components.App = React.createClass({
    render: function () {
      return React.DOM.div({}, [
        app.components.List({})
      ]);
    }
  });

  app.components.List = React.createClass({
    getInitialState: function () {
      return {conferences: []};
    },
    componentDidMount: function () {
      $.get('/api/conferences.json', function (conferences) {
        this.setState({conferences: conferences});
      }.bind(this));
    },
    render: function () {
      return React.DOM.div({}, [
        React.DOM.h2({}, 'Recorded Conferences'),
        React.DOM.ul({}, this.state.conferences.map(function (c) {
          return app.components.ListItem({conference: c});
        }))
      ]);
    }
  });

  app.components.ListItem = React.createClass({
    render: function () {
      return React.DOM.li({}, React.DOM.a({}, this.props.conference.id));
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

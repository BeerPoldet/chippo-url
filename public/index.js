var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function postChippo(chippoPayload) {
  return fetch('/chippo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chippoPayload)
  }).then(function (response) {
    return response.json().then(function (json) {
      return { ok: response.ok, json: json };
    });
  });
}

var ChippoAPI = function (_React$Component) {
  _inherits(ChippoAPI, _React$Component);

  function ChippoAPI() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ChippoAPI);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ChippoAPI.__proto__ || Object.getPrototypeOf(ChippoAPI)).call.apply(_ref, [this].concat(args))), _this), _this.state = { error: '' }, _this.makeChippo = function (chippoPayload) {
      postChippo(chippoPayload).then(function (response) {
        if (response.ok) {
          var _response$json = response.json,
              url = _response$json.url,
              alias = _response$json.alias;

          window.location.assign('p?url=' + url + '&alias=' + alias);
        } else {
          _this.setState({ error: response.json.error });
        }
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ChippoAPI, [{
    key: 'render',
    value: function render() {
      return this.props.children({
        makeChippo: this.makeChippo,
        error: this.state.error
      });
    }
  }]);

  return ChippoAPI;
}(React.Component);

var ChippoForm = function (_React$Component2) {
  _inherits(ChippoForm, _React$Component2);

  function ChippoForm() {
    var _ref2;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, ChippoForm);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref2 = ChippoForm.__proto__ || Object.getPrototypeOf(ChippoForm)).call.apply(_ref2, [this].concat(args))), _this2), _this2.state = { url: '', alias: '' }, _this2.handleChange = function (e) {
      var _e$target = e.target,
          name = _e$target.name,
          value = _e$target.value;

      _this2.setState(_defineProperty({}, name, value));
    }, _this2.handleSubmit = function (e) {
      // e.preventDefault()
      // const { onSubmit } = this.props
      // if (onSubmit) onSubmit(this.state)
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(ChippoForm, [{
    key: 'render',
    value: function render() {
      var _state = this.state,
          url = _state.url,
          alias = _state.alias;

      return (
        // <form onSubmit={this.handleSubmit}>
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit, action: '/chippo', method: 'POST' },
          this.props.error && React.createElement(
            'label',
            null,
            this.props.error
          ),
          React.createElement(
            'label',
            null,
            'Put url below:'
          ),
          React.createElement('input', {
            value: url,
            name: 'url',
            type: 'text',
            onChange: this.handleChange
          }),
          React.createElement(
            'button',
            { type: 'submit' },
            'Chippo!'
          ),
          React.createElement('input', {
            value: alias,
            name: 'alias',
            type: 'text',
            onChange: this.handleChange
          })
        )
      );
    }
  }]);

  return ChippoForm;
}(React.Component);

function IndexApp() {
  return React.createElement(
    ChippoAPI,
    null,
    function (_ref3) {
      var makeChippo = _ref3.makeChippo,
          error = _ref3.error;
      return React.createElement(ChippoForm, { onSubmit: makeChippo, error: error });
    }
  );
}
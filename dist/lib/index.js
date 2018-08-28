'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProcessCalls = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _deasync = require('deasync');

var _deasync2 = _interopRequireDefault(_deasync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = '';

var ProcessCalls = exports.ProcessCalls = function () {
  function ProcessCalls() {
    _classCallCheck(this, ProcessCalls);

    this.response = {};
  }

  _createClass(ProcessCalls, [{
    key: 'processAsync',
    value: async function processAsync(key, classe, meth, params, type) {
      var result = '';
      if (type === 1) {
        result = await Reflect.apply(meth ? classe[meth] : classe, classe, params).catch(function (e) {
          return e;
        });
      } else if (type === 2) {
        result = await new Promise(function (resolve, reject) {
          var sucess = '';
          params.push(function (sucess) {
            resolve(sucess);
          });
          Reflect.apply(meth ? classe[meth] : classe, classe, params);
        }).catch(function (e) {
          return e;
        });
      } else {
        result = await new Promise(function (resolve, reject) {
          var sucess = '';
          params.push(function (err, sucess) {
            if (err) {
              reject(err);
              return;
            } else {
              resolve(sucess);
            }
          });
          Reflect.apply(meth ? classe[meth] : classe, classe, params);
        }).catch(function (e) {
          return e;
        });
      }
      ProcessCalls.getInstance().response[key] = result;
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (instance) {
        return instance;
      } else {
        instance = new ProcessCalls();
        return instance;
      }
    }
  }, {
    key: 'receiveProc',
    value: function receiveProc(classe) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      var meth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      var key = ProcessCalls.getId();
      ProcessCalls.getInstance().processAsync(key, classe, meth, params, type);
      while (ProcessCalls.getInstance().response[key] === undefined) {
        _deasync2.default.runLoopOnce();
      }
      var response = ProcessCalls.getInstance().response[key];
      delete ProcessCalls.getInstance().response[key];
      return response;
    }
  }, {
    key: 'getId',
    value: function getId() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  }]);

  return ProcessCalls;
}();
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _deasync = require('deasync');

var _deasync2 = _interopRequireDefault(_deasync);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = '';
/**
 * Classe responsável por prover a resolução de promisses e callbacks.
 */

var ProcessCalls = function () {

  /**
   * Construtor da classe
   */
  function ProcessCalls() {
    _classCallCheck(this, ProcessCalls);

    this.response = {};
  }

  /**
   * Singleton que prove a intancia unica para manipulamento de intâncias internas
   */


  _createClass(ProcessCalls, [{
    key: 'processAsync',


    /**
     * Função responsável aplicar e monitorar os estados de espera da resolução dos callbacks e promisses
     * 
     * @param {string} key 
     * @param {object} target 
     * @param {*} params
     */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key, target, params) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                result = '';
                _context.prev = 1;
                _context.next = 4;
                return new Promise(function (resolve, reject) {
                  params.push(function (err, sucess) {
                    if (err) {
                      reject(err);
                      return;
                    } else {
                      resolve(sucess);
                    }
                  });
                  Reflect.apply(target, undefined, params);
                });

              case 4:
                result = _context.sent;
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](1);

                console.error(_context.t0.toString());

              case 10:

                ProcessCalls.getInstance().response[key] = result;

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 7]]);
      }));

      function processAsync(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return processAsync;
    }()

    /**
     * Função responsável por prover uma key unica para diferenciar as intâncias de monitoramento das esperas
     */

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

    /**
     * Função responsável por iniciar o processo de manipulação da espera dos callbacks e promessas
     * 
     * @param {object} target 
     * @param {*} params
     */

  }, {
    key: 'receiveProc',
    value: function receiveProc(target) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (!Array.isArray(params)) {
        params = new Array(params);
      }
      var key = ProcessCalls.getId();
      ProcessCalls.getInstance().processAsync(key, target, params);
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

exports.default = ProcessCalls;
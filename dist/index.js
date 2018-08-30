'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _deasync = require('deasync');

var _deasync2 = _interopRequireDefault(_deasync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
     * 1 - Resolve callbacks simples que não possuem promisses.
     * 2 - Resolve promisses que não possuem um tratamento de erro no "THEN", ou seja, não existe tratamento de rejeição.
     * 3 - Resolve promisses que possuem um tratamento de erro no "THEN", ou seja, existe tratamento de rejeição.
     * 
     * @param {string} key 
     * @param {object} target 
     * @param {*} params 
     * @param {number} type 
     */
    value: async function processAsync(key, target, params, type) {
      var result = '';
      if (type === 1) {
        result = await Reflect.apply(target, target, params).catch(function (e) {
          return e;
        });
      } else if (type === 2) {
        result = await new Promise(function (resolve, reject) {
          var sucess = '';
          params.push(function (sucess) {
            resolve(sucess);
          });
          Reflect.apply(target, target, params);
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
          Reflect.apply(target, target, params);
        }).catch(function (e) {
          return e;
        });
      }
      ProcessCalls.getInstance().response[key] = result;
    }

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
     * @param {number} type 
     */

  }, {
    key: 'receiveProc',
    value: function receiveProc(target) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      var key = ProcessCalls.getId();
      ProcessCalls.getInstance().processAsync(key, target, params, type);
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
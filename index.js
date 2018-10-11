import deasync from 'deasync';
import "babel-polyfill";

let instance = '';
/**
 * Classe responsável por prover a resolução de promisses e callbacks.
 */
class ProcessCalls {

  /**
   * Construtor da classe
   */
  constructor() {
    this.response = {};
  }

  /**
   * Singleton que prove a intancia unica para manipulamento de intâncias internas
   */
  static getInstance() {
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
  static receiveProc(target, params = []) {
    if (!Array.isArray(params)) {
      params = new Array(params);
    }
    let key = ProcessCalls.getId();
    ProcessCalls.getInstance().processAsync(key, target, params);
    while (ProcessCalls.getInstance().response[key] === undefined) {
      deasync.runLoopOnce();
    }
    let response = ProcessCalls.getInstance().response[key];
    delete ProcessCalls.getInstance().response[key];
    return response;
  }

  /**
   * Função responsável aplicar e monitorar os estados de espera da resolução dos callbacks e promisses
   * 
   * @param {string} key 
   * @param {object} target 
   * @param {*} params
   */
  async processAsync(key, target, params) {
    let result = '';
    try {
      if (target instanceof Promise) {
        result = await target;
      } else {
        result = await new Promise((resolve, reject) => {
          params.push((err, sucess) => {
            if (err) {
              reject(err);
              return;
            } else {
              resolve(sucess);
            }
          });
          Reflect.apply(target, undefined, params);
        });
      }
    } catch (e) {
      console.error(e.toString());
    }

    ProcessCalls.getInstance().response[key] = result;
  }

  /**
   * Função responsável por prover uma key unica para diferenciar as intâncias de monitoramento das esperas
   */
  static getId() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

}

export default ProcessCalls;
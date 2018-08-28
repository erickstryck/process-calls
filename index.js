import deasync from 'deasync';

let instance='';
/**
 * Classe responsável por prover a resolução de promisses e callbacks.
 */
export class ProcessCalls {

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
    if(instance) {
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
  static receiveProc(target,params=[],type=3) {
    let key=ProcessCalls.getId();
    ProcessCalls.getInstance().processAsync(key,target,params,type);
    while(ProcessCalls.getInstance().response[key] === undefined) {
      deasync.runLoopOnce();
    }
    let response=ProcessCalls.getInstance().response[key];
    delete ProcessCalls.getInstance().response[key];
    return response;
  }

  /**
   * Função responsável aplicar e monitorar os estados de espera da resolução dos callbacks e promisses
   * 1 - Resolve promisses que não possuem um tratamento de erro no "THEN", ou seja, não existe tratamento de rejeição.
   * 2 - Resolve promisses que possuem um tratamento de erro no "THEN", ou seja, existe tratamento de rejeição.
   * 3 - Resolve callbacks simples que não possuem promisses.
   * 
   * @param {string} key 
   * @param {object} target 
   * @param {*} params 
   * @param {number} type 
   */
  async processAsync(key,target,params,type) {
    let result='';
    if(type===1) {
      result=await Reflect.apply(target,target,params).catch((e) => e);
    } else if(type===2) {
      result=await new Promise((resolve, reject)=>{
        let sucess='';
        params.push((sucess)=>{
          resolve(sucess);
        });
        Reflect.apply(target,target,params);
      }).catch((e) => e);
    } else {
      result=await new Promise((resolve, reject)=>{
        let sucess='';
        params.push((err,sucess)=>{
          if(err) {
            reject(err);
            return;
          } else {
            resolve(sucess);
          }
        });
        Reflect.apply(target,target,params);
      }).catch((e) => e);
    }
    ProcessCalls.getInstance().response[key]=result;
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
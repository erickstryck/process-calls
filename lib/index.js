import deasync from 'deasync';

let instance='';
export class ProcessCalls {
  constructor() {
    this.response = {};
  }

  static getInstance() {
    if(instance) {
      return instance;
    } else {
      instance = new ProcessCalls();
      return instance;
    }
  }
  static receiveProc(classe,type=3,meth=undefined,params=[]) {
    let key=ProcessCalls.getId();
    ProcessCalls.getInstance().processAsync(key,classe,meth,params,type);
    while(ProcessCalls.getInstance().response[key] === undefined) {
      deasync.runLoopOnce();
    }
    let response=ProcessCalls.getInstance().response[key];
    delete ProcessCalls.getInstance().response[key];
    return response;
  }

  async processAsync(key,classe,meth,params,type) {
    let result='';
    if(type===1) {
      result=await Reflect.apply(meth?classe[meth]:classe,classe,params).catch((e) => e);
    } else if(type===2) {
      result=await new Promise((resolve, reject)=>{
        let sucess='';
        params.push((sucess)=>{
          resolve(sucess);
        });
        Reflect.apply(meth?classe[meth]:classe,classe,params);
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
        Reflect.apply(meth?classe[meth]:classe,classe,params);
      }).catch((e) => e);
    }
    ProcessCalls.getInstance().response[key]=result;
  }

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
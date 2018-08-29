<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [ProcessCalls][1]
    -   [receiveProc][2]
        -   [Parameters][3]

## ProcessCalls

Classe responsável por prover a resolução de promisses e callbacks.

####Importando
```
import ProcessCalls from 'process-calls';

let myValueReolved = ProcessCalls.receiveProc(funcPromisseOrCallback, paramsOfFunc, type);
```
### receiveProc

Função responsável por iniciar o processo de manipulação da espera dos callbacks e promessas

#### Parameters

-   `target` **[object][9]** => Função que gera a promisse ou callback
-   `params` **any**  (optional, default `[]`)
-   `type` **[number][10]**  (optional, default `3`)

#### Resolução te tipos
#### 1 - Resolve promisses que não possuem um tratamento de erro no "THEN", ou seja, não existe tratamento de rejeição.
#### 2 - Resolve promisses que possuem um tratamento de erro no "THEN", ou seja, existe tratamento de rejeição.
#### 3 - Resolve callbacks simples que não possuem promisses.

[1]: #processcalls

[2]: #receiveproc

[3]: #parameters

[9]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[10]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
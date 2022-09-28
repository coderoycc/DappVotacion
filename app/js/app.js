import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import voting_artifacts from '../../build/contracts/votacion.json';

var Voting = contract(voting_artifacts);

//funcion para votar a un candidato
window.votar = function(){
  
}

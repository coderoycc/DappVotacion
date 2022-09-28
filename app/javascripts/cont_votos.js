//Script para ver candidatos desde el contrato inteligente

import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import voting_artifacts from '../../build/contracts/votacion.json';

var Voting = contract(voting_artifacts);

//ver los candidatos (Conteo)
$(document).ready(function() {
    if(typeof web3 !== 'undefined'){
        console.warn("Usando WEB3 desde una fuente externa");
        window.web3 = new Web3(web3.currentProvider);
    }else{
        console.warn("web3 no detectado, conectado a localhost:7545");
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }

    Voting.setProvider(web3.currentProvider);
    let nombreCandidatos = ["BC", "REU", "NU", "TPU"];
    //Recorremos los candidatos
    for(var i = 0; i<nombreCandidatos.length; i++){
        let sigla = nombreCandidatos[i];
        Voting.deloyed().then( (instancia) => {
            instancia.verVotos.call(sigla).then( (cant) => {
                //cambiar altura de la barra
                //barra (160px * cant_votos)/5
                let altura = (cant*160)/5;
                document.getElementById(verctor[i]).style.height = altura.toString()+"px";
                //Ponemos las cantidades en las barras
                $("#"+sigla).html(cant.toString());

            });
        });
    }
});
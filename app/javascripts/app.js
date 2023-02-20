// Importación librerías necesarias.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import voting_artifacts from '../../build/contracts/Votacion.json';
import Swal from 'sweetalert2';

// Alertas
const Swal = require('sweetalert2');

var Voting = contract(voting_artifacts);

const ethereumButton = document.querySelector('.enableEthereumButton');
// let candidatos = {"Satoshi": "candidato-1", "Vitalik": "candidato-2"}

window.votar = function(candidato) {
  let nombreCandidato = candidato;
  try {
    console.log("Votaste por: "+nombreCandidato);
    console.log(window.ethereum.selectedAddress);
    // web3.eth.defaultAccount = web3.eth.accounts[0];
    // let cuenta = window.ethereum.selectedAddress;
    // cuenta = cuenta.substring(2,cuenta.length);
    Voting.deployed().then(function(contractInstance) {
      console.log(contractInstance.address);
      contractInstance.votar(nombreCandidato, {from: window.ethereum.selectedAddress}).then(function(res) {
        // let div_id = candidatos[nombreCandidato];
        console.log(res);
        return contractInstance.verVotos.call(nombreCandidato).then(function(v) {
          console.log("VOTOS POR "+nombreCandidato+" SON "+v.toString());
          Swal.fire({
            position: 'center', //top-end
            icon: 'success',
            title: 'Voto registrado',
            showConfirmButton: false,
            timer: 9500 //1500
          });
        });
      });
    });
    
  } catch (err) {
    console.log(err);
  }
}

//ver los candidatos (Conteo)
ethereumButton.addEventListener('click', () => {
  var btn = document.getElementById("eth-btn");
  if(window.ethereum.selectedAddress != null){
    //votar alerta
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Estás Conectado',
      showConfirmButton: false,
      timer: 1500
    })
    $("eth-btn").html("CONECTADO");
  }else{
  //Will Start the metamask extension
    ethereum.request({ method: 'eth_requestAccounts' });
  }
});

$(document).ready(function() {
  var botonEth = document.getElementById('eth-btn');
  console.log("XD");
  if(window.ethereum.selectedAddress != null){
    console.log("Conectado con: "+window.ethereum.selectedAddress);
    // botonEth.disabled = "disabled";
    botonEth.textContent = "CONECTADO";
  }
  if(typeof web3 !== 'undefined'){
      console.warn("Usando WEB3 desde una fuente externa");
      window.web3 = new Web3(web3.currentProvider);
  }else{
      console.warn("web3 no detectado, conectado a localhost:7545");
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }

  Voting.setProvider(web3.currentProvider);
  let nombreCandidatos = ["BC", "REU", "NU", "TPU"];
  let numeros = [3,1,3,2]
  //Recorremos los candidatos
  var altura;
  for(var i = 0; i<nombreCandidatos.length; i++){
      let sigla = nombreCandidatos[i];
      altura=0;
      Voting.deployed().then( (instancia) => {
        instancia.verVotos.call(sigla).then( (cant) => {
            //cambiar altura de la barra
            //barra (160px * cant_votos)/5
            altura = 1+(cant*32); //cant*160/5
            cant=cant*20; //cant*100/5
            //Ponemos las cantidades en las barras
            $("#"+sigla).html(cant.toString()+"%");
          return altura;
        }).then((a)=>{
          for(var j=0;j<4;j++){
            var x = document.getElementById(sigla);
            if(x !== null && sigla==nombreCandidatos[j]){
              console.log("DENTRO",a);
              x.style.height = a.toString()+"px";
            }
          }
        });
      });
  }
});

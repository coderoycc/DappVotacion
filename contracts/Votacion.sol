// SPDX-License-Identifier: MIT
pragma solidity >=0.4.4;
pragma experimental ABIEncoderV2;

contract Votacion{

    //Direccion del propietario del contrato
    address public owner;

    //Relacion entre el nombre CANDIDATOS y Hash datos personales
    mapping (string => bytes32) id_candidatos;

    //Para saber como va la votación CANDIDATO => numero de votos
    mapping (string => uint) cand_votos;

    //Lista de los nombre de los CANDIDATOS
    string [] candidatos;


    //Lista de VOTANTES (hash de las direcciones)
    bytes32 [] votantes;
    
    //Constructor 
    constructor() public{
        owner=msg.sender; //El que desplegue el contrato

        //Iniciamos a los candidatos
        bytes32 hash_cand = keccak256(abi.encodePacked("BC", "Blanco"));
        id_candidatos["BC"]=hash_cand;
        candidatos.push("BC");

        hash_cand = keccak256(abi.encodePacked("REU", "Resistencia Estudiantil UMSA"));
        id_candidatos["REU"]=hash_cand;
        candidatos.push("REU");

        hash_cand = keccak256(abi.encodePacked("NU", "Nueva U"));
        id_candidatos["NU"]=hash_cand;
        candidatos.push("NU");

        hash_cand = keccak256(abi.encodePacked("TPU", "Todos Por la U"));
        id_candidatos["TPU"]=hash_cand;
        candidatos.push("TPU");
    }

    //Funcion que hace que cualquier persona pueda presentarse a las elecciones (CANDIDATOS)
    /*function represetar(string memory _nom, uint _edad, string memory _id) public{
        //calcular el hash de los datos del candidato
        bytes32 hash_cand = keccak256(abi.encodePacked(_nom,_edad,_id));

        //Almacenamos el hash de los datos del candidato
        id_candidatos[_nom]=hash_cand;

        //Añadimos al candidato al array
        candidatos.push(_nom);
    }*/

    //Función que nos indica que personas se han presentado como candidatos
    function verCandidatos() public view returns(string [] memory){
        return candidatos;
    }

    //VOTAR A UN CANDIDATO
    function votar(string memory _sigla) public returns(bool){
        //calculamos el hash de la direccion de la persona que ejecuta esta funcion
        bytes32 dir = keccak256(abi.encodePacked(msg.sender));
        for(uint i = 0; i < votantes.length; i++){
            //Verificamos que el votante no esté en la lista
            require(votantes[i]!=dir,"Ya votaste");
        }
        //añadimos la direccion del nuevo votante
        votantes.push(dir);
        //Sumar el voto
        cand_votos[_sigla]++;
        return true;
    }

    //Ver los votos de un candidato
    function verVotos(string memory _sigla) public view returns(uint){
        return cand_votos[_sigla];
    }

    //Ver los votos de cada uno de los candidatos
    function verResultados() public view returns(string memory){//Acceder a los datos
        //Almacenamos en un string los resultados
        string memory resultado="";
        for(uint i = 0; i < candidatos.length; i++){
            //Actualizamos el string con cada candidato (Primero a bytes y luego a string
            resultado = string(abi.encodePacked(resultado, "(",candidatos[i],": ",uint2str(verVotos(candidatos[i])),")")); //bytes->string
        }
        return resultado;
    }   

    
    function Ganador() public view returns(string memory){
        //La variable contendra el nombre del ganador
        string memory ganador = candidatos[0];
        //Recorremos el array de candidatos para determinar el numero mayor de votos
        for(uint i = 1; i < candidatos.length; i++){
            if(cand_votos[ganador] < cand_votos[candidatos[i]]){
                ganador = candidatos[i];
            }else{
                if(cand_votos[ganador] == cand_votos[candidatos[i]]){
                    ganador="Existe un empate!";
                }
            }
        }
        return ganador;
    }

    //Funcion auxiliar para convertir un UINT a STRING
    function uint2str(uint _i) internal pure returns(string memory){
        if(_i == 0){
            return "0";
        }
        uint j = _i;
        uint len;
        while(j != 0){
            len++;
            j/=10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while(_i != 0){
            //era byte
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    } 
}
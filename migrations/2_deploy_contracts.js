var Votacion = artifacts.require("Votacion.sol");

module.exports = function(deployer) {
  deployer.deploy(Votacion);
};

var TicTacToe = artifacts.require("TicTacToe");

module.exports = function(deployer, network, accounts){
	const ownerAddress = accounts[1];
	deployer.deploy(TicTacToe, { from: ownerAddress, value: 10000000000000000000 });
};
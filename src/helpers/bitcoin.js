(function(){
	const bitcoin = require('bitcoinjs-lib')
	const bip39 = require("bip39")

	const lib = {
		'createP2WPKHAddressFromMnemonic': function(mnemonic){
			/**
			* Native Segwit Address Generation
			* BIP44 support
			*/

			console.log(mnemonic)
		    var seed = bip39.mnemonicToSeed(mnemonic)
		    var root = bitcoin.HDNode.fromSeedBuffer(seed)

		    var path = "m/84'/0'/0'/0/0"
		    var child = root.derivePath(path)

		    var keyhash = bitcoin.crypto.hash160(child.getPublicKeyBuffer())
		    var scriptSig = bitcoin.script.witnessPubKeyHash.output.encode(keyhash)
		    // var addressBytes = bitcoin.crypto.hash160(scriptSig)
		    // var outputScript = bitcoin.script.scriptHash.output.encode(addressBytes)
		    var address = bitcoin.address.fromOutputScript(scriptSig)
		    console.log(address)
		},

		'createP2PKHAddressFromWIF': function(wif){
			var keyPair = bitcoin.ECPair.fromWIF()
		    var pubKey = keyPair.getPublicKeyBuffer()

		    var scriptPubKey = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey))
		    var address = bitcoin.address.fromOutputScript(scriptPubKey)
		    return address
		},

		'createP2PKHAddressFromMnemonic': function(){

		},
	}
	
	// const mnemonic = bip39.generateMnemonic()
	const mnemonic = "unable frequent athlete repeat run liberty screen month cereal phrase habit salon twelve trim nice tank immune mutual"
	lib.createAddressFromMnemonic(mnemonic)

})()
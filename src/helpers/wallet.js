/**
 * Created by Samparsky on 06/03/2018.
 */

import Mnemonic from 'bitcore-mnemonic'


export const GenerateMnemonic = () => {
    return new Mnemonic(Mnemonic.Words.ENGLISH).toString()
}

const GenerateAddress = (mnemonic) => {

}

const SignTransactions = () => {

}
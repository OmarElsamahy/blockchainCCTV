/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { Wallets } = require('fabric-network');
const path = require('path');

const fixtures = path.resolve(__dirname, '../fabric-samples/test-network');

let config ={
    pathToUser : "/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com",
    pathToUserSignCert : "/msp/signcerts/cert.pem",
    pathToUserKey : "/msp/keystore/e16fa32ae0ad47094ecfabc965803937a644ff843ffd27be5b58a7377f171e84_sk",
    identityLabel : 'User1@org1.example.com'
}

async function main() {

    // Main try/catch block
    try {
        // A wallet stores a collection of identities
        const wallet = await Wallets.newFileSystemWallet('../wallet');

        // Identity to credentials to be stored in the wallet
        const credPath = path.join(fixtures, config.pathToUser);
        const certificate = fs.readFileSync(path.join(credPath, config.pathToUserSignCert)).toString();
        const privateKey = fs.readFileSync(path.join(credPath, config.pathToUserKey)).toString();

        // Load credentials into wallet

        const identity = {
            credentials: {
                certificate,
                privateKey
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        }


        await wallet.put(config.identityLabel,identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});

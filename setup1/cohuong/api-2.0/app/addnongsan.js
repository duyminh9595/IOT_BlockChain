const { Gateway, Wallets, TxEventHandler, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')

// const createTransactionEventHandler = require('./MyTransactionEventHandler.ts')

const helper = require('./helper')

const bcrypt = require('bcrypt')

// const createTransactionEventHandler = (transactionId, network) => {
//     /* Your implementation here */
//     const mspId = network.getGateway().getIdentity().mspId;
//     const myOrgPeers = network.getChannel().getEndorsers(mspId);
//     return new MyTransactionEventHandler(transactionId, network, myOrgPeers);
// }

const invokeTransaction = async (channelName, chaincodeName, email, addressnongtrai, name, description) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

        // load the network configuration
        // const ccpPath =path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP("cohuong") //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath("cohuong") //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(email);
        if (!identity) {
            console.log(`An identity for the user ${email} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(email, "cohuong", true)
            identity = await wallet.get(email);
            console.log('Run the registerUser.js application before retrying');
            return;
        }



        const connectOptions = {
            wallet, identity: email, discovery: { enabled: true, asLocalhost: false },
            eventHandlerOptions: {
                commitTimeout: 100,
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
            }
            // transaction: {
            //     strategy: createTransactionEventhandler()
            // }
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);

        // let result
        // let message;
        // switch (fcn) {
        //     case "CreateInvoice":
        //         result = await contract.submitTransaction(fcn, args[0]);
        //         // obj = JSON.stringify(JSON.parse(args[0]))
        //         // console.log(JSON.parse(args[0]))
        //         message = `Successfully added the Invoice Data`
        //         break;
        //     case "UpdateInvoice":
        //         if ("cohuong" == "Org1") {
        //             return { message: "Only Organization 2 is allowed to add transactions" }
        //         } else {
        //             result = await contract.submitTransaction(fcn, args[0], args[1], args[2]);
        //             // obj = JSON.stringify(JSON.parse(args[0]))
        //             // console.log(JSON.parse(args[0]))
        //             message = `Successfully updated the Invoice Data`
        //             break;
        //         }


        //     // case ""

        //     default:
        //         return utils.getResponsePayload("Please send correct chaincode function name", null, false)
        //         break;
        // }

        let result

        result = await contract.submitTransaction(
            'themsanphamnongtrai',
            addressnongtrai, name, description
        )

        await gateway.disconnect();


        // let response = {
        //     message: message,
        //     result
        // }

        return "Success";


    } catch (error) {

        console.log(`Getting error: ${error}`)
        return error.message

    }
}

exports.invokeTransaction = invokeTransaction;
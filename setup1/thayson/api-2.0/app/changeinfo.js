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

const invokeTransaction = async (channelName, chaincodeName, fcn, username, ngaysinh, name) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

        // load the network configuration
        // const ccpPath =path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP("thayson") //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath("thayson") //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, "thayson", true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }



        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: false },
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

        let result
        result = await contract.submitTransaction(
            'changeUserInfo',
            username,
            ngaysinh,
            name,
        )
        await gateway.disconnect();

        return result;


    } catch (error) {

        console.log(`Getting error: ${error}`)
        return error.message

    }
}

exports.invokeTransaction = invokeTransaction;
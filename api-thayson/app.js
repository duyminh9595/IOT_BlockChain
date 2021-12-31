let express = require('express')
let bodyParser = require('body-parser')

const { registerEnroll } = require('./registerEnrollClientUserOrg1')


let app = express()
app.use(bodyParser.json())

const { Gateway, Wallets } = require('fabric-network')
const path = require('path')
const fs = require('fs')
const { error } = require('console')
const bcrypt = require('bcrypt')



const cors = require('cors');
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const log4js = require('log4js');
const { response } = require('express')
const logger = log4js.getLogger('BasicNetwork');

const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

const constants = require('./config/constants.json')

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// set secret variable
app.set('secret', 'thisismysecret');
app.use(expressJWT({
    secret: 'thisismysecret'
}).unless({
    path: ['/main', '/login', '/register/']
}));
app.use(bearerToken());

logger.level = 'debug';

app.use((req, res, next) => {

    console.log('New req for %s', req.originalUrl);
    if (req.originalUrl.indexOf('/api/registerenrolluserorg1') >= 0 || req.originalUrl.indexOf('/login') >= 0 || req.originalUrl.indexOf('/register') >= 0) {
        console.log("Vo dayu")
        return next();
    }

    var token = req.token;
    jwt.verify(token, app.get('secret'), (err, decoded) => {
        if (err) {
            console.log(`Error ================:${err}`)
            res.send({
                success: false,
                message: 'Failed to authenticate token. Make sure to include the ' +
                    'token returned from /users call in the authorization header ' +
                    ' as a Bearer token'
            });

            return;
        } else {
            req.username = decoded.username;
            console.log(decoded.username);
            return next();
        }
    });
});



app.get('/main', async function (req, res) {
    try {
        console.log("Test Pass!..")
        res.status(200).json({ response: "Test Pass!..." })
    } catch (error) {
        console.log("Test Fail!..")
        process.exit(1)
    }
})

app.post('/api/registerenrolluserorg1/', async function (req, res) {

    try {
        let err = await registerEnroll(req.body.username)
        if (err) {
            throw new Error(err)
        }

        res.status(201).json({
            status: "pass",
            message: `Successfully registered and enrolled user ${req.body.username.toUpperCase()} and imported it into the wallet`
        })
    } catch (error) {
        res.status(501).json({
            status: "fail",
            message: error.message
        })
    }
})
app.post('/register/', async function (req, res) {
    try {
        let err = await registerEnroll(req.body.username)
        if (err) {
            throw new Error(err)
        }

        try {
            const username = req.body.username

            // load the network configuration
            const ccpPath = path.resolve(__dirname, 'connection-org1.json')
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'walletOrg1')
            const wallet = await Wallets.newFileSystemWallet(walletPath)
            console.log(`Wallet path: ${walletPath}`)

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(username)
            if (!identity) {
                console.log(`An identity for the user ${username} does not exist in the wallet`)
                console.log('Run the registerUser.js application before retrying')
                throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
                return
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway()
            await gateway.connect(ccp, {
                wallet,
                identity: username,
                discovery: {
                    enabled: true,
                    asLocalhost: true
                }
            })

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel')

            // Get the contract from the network.
            const contract = network.getContract('thesis')
            let result;
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(req.body.password, salt)
            result = await contract.submitTransaction(
                'registerUser',
                req.body.username,
                hash,
                "",
                ""
            )
            console.log(result.toString())
            // result = JSON.parse(result.toString());
            // const contract = network.getContract('thesis')


            res.status(201).json({
                result: "Thanh cong",
            })
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`)
            res.status(501).json({
                result: error,
                error: error.message
            })
        }
    } catch (error) {
        res.status(501).json({
            status: "fail",
            message: error.message
        })
    }
})
app.post('/login', async function (req, res) {
    try {
        const username = req.body.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }
        else {
            try {

                // load the network configuration
                const ccpPath = path.resolve(__dirname, 'connection-org1.json')
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'walletOrg1')
                const wallet = await Wallets.newFileSystemWallet(walletPath)
                console.log(`Wallet path: ${walletPath}`)

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get(username)
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet`)
                    console.log('Run the registerUser.js application before retrying')
                    throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
                    return
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway()
                await gateway.connect(ccp, {
                    wallet,
                    identity: username,
                    discovery: {
                        enabled: true,
                        asLocalhost: true
                    }
                })

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel')

                // Get the contract from the network.
                const contract = network.getContract('thesis')
                let result;
                result = await contract.submitTransaction(
                    'queryUser', username
                )
                result = JSON.parse(result.toString());
                // const contract = network.getContract('thesis')

                console.log(result);
                var salt = bcrypt.genSaltSync(10)
                var hash = bcrypt.hashSync(req.body.password, salt)
                var check = bcrypt.compareSync(req.body.password, result.password);
                console.log(check)
                if (check) {
                    var token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
                        username: username
                    }, app.get('secret'));
                    res.status(200).json({
                        result: token,
                        error: "Thành công"
                    })
                }
                else {
                    res.status(403).json({
                        error: "Sai email or mk"
                    })
                }

            } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`)
                res.status(501).json({
                    result: error,
                    error: error.message
                })
            }


        }
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: null,
            error: error.message
        })
    }
})
app.get('/api/info', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }
        else {
            try {

                // load the network configuration
                const ccpPath = path.resolve(__dirname, 'connection-org1.json')
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'walletOrg1')
                const wallet = await Wallets.newFileSystemWallet(walletPath)
                console.log(`Wallet path: ${walletPath}`)

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get(username)
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet`)
                    console.log('Run the registerUser.js application before retrying')
                    throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
                    return
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway()
                await gateway.connect(ccp, {
                    wallet,
                    identity: username,
                    discovery: {
                        enabled: true,
                        asLocalhost: true
                    }
                })

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel')

                // Get the contract from the network.
                const contract = network.getContract('thesis')
                let result;
                result = await contract.submitTransaction(
                    'queryUser', username
                )
                result = JSON.parse(result.toString());
                // const contract = network.getContract('thesis')

                console.log(result);
                res.status(200).json({
                    data: result,
                    error: "Thành công"
                })

            } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`)
                res.status(501).json({
                    result: error,
                    error: error.message
                })
            }


        }
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: null,
            error: error.message
        })
    }
})
app.post('/api/changepassword', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }
        else {
            try {

                // load the network configuration
                const ccpPath = path.resolve(__dirname, 'connection-org1.json')
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'walletOrg1')
                const wallet = await Wallets.newFileSystemWallet(walletPath)
                console.log(`Wallet path: ${walletPath}`)

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get(username)
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet`)
                    console.log('Run the registerUser.js application before retrying')
                    throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
                    return
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway()
                await gateway.connect(ccp, {
                    wallet,
                    identity: username,
                    discovery: {
                        enabled: true,
                        asLocalhost: true
                    }
                })

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel')

                // Get the contract from the network.
                const contract = network.getContract('thesis')
                let result;
                result = await contract.submitTransaction(
                    'queryUser', username
                )
                result = JSON.parse(result.toString());


                // console.log(result);
                var salt = bcrypt.genSaltSync(10)
                var check = bcrypt.compareSync(req.body.password, result.password);
                var hasnew = bcrypt.hashSync(req.body.newpassword, salt);
                // let kq;
                if (check) {
                    result = await contract.submitTransaction(
                        'changePassword',
                        username,
                        hasnew
                    )
                    res.status(200).json({
                        result: result,
                        error: "Thành công"
                    })
                }
                else {
                    res.status(403).json({
                        error: "Sai mk"
                    })
                }

                // console.log(check)
                // if (check) {


                //     res.status(200).json({
                //         result: token,
                //         error: "Thành công"
                //     })
                // }
                // else {
                //     res.status(403).json({
                //         error: "Sai email or mk"
                //     })
                // }

            } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`)
                res.status(501).json({
                    result: error,
                    error: error.message
                })
            }


        }
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: null,
            error: error.message
        })
    }
})
app.post('/api/changeinfo', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }
        else {
            try {

                // load the network configuration
                const ccpPath = path.resolve(__dirname, 'connection-org1.json')
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'walletOrg1')
                const wallet = await Wallets.newFileSystemWallet(walletPath)
                console.log(`Wallet path: ${walletPath}`)

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get(username)
                if (!identity) {
                    console.log(`An identity for the user ${username} does not exist in the wallet`)
                    console.log('Run the registerUser.js application before retrying')
                    throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
                    return
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway()
                await gateway.connect(ccp, {
                    wallet,
                    identity: username,
                    discovery: {
                        enabled: true,
                        asLocalhost: true
                    }
                })

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel')

                // Get the contract from the network.
                const contract = network.getContract('thesis')
                // const contract = network.getContract('thesis')
                let kq = await contract.submitTransaction(
                    'changeUserInfo',
                    username,
                    req.body.ngaysinh,
                    req.body.username,
                )
                res.status(200).json({
                    result: kq,
                    error: "Thành công"
                })

            } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`)
                res.status(501).json({
                    result: error,
                    error: error.message
                })
            }


        }
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: null,
            error: error.message
        })
    }
})
app.post('/api/adduserincome', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'addIncomeUser',
            username,
            req.body.description,
            req.body.amount,
            req.body.currency,
            "1",
            req.body.id_income
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')

        let resultUser;
        resultUser = await contract.submitTransaction(
            'queryUser', username
        )
        resultUser = JSON.parse(resultUser.toString());
        // const contract = network.getContract('thesis')



        res.status(201).json({
            result: "Thành công",
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.get('/api/seealluserincome', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'seeAllUserIncome',
            username
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.post('/api/seeuserincomeid', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'seeAllUserSpendingBaseIncomeId',
            username,
            req.body.id
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.post('/api/adduserspending', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'addSpendingUser',
            username,
            req.body.description,
            req.body.amount,
            req.body.currency,
            "1",
            req.body.id_spending
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.post('/api/seeuserspendingid', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'seeAllUserSpendingBaseSpendingId',
            username,
            req.body.id
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.get('/api/seealluserspending', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'seeAllUserSpending',
            username
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.post('/api/addusertarget', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'addTarget',
            username,
            req.body.description,
            req.body.start_date,
            req.body.end_date,
            req.body.amount,
            req.body.currency,
            "1",
            uuidv4()
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.get('/api/seeallusertarget', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'seeAllTargetEmail',
            username
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.post('/api/addusertransactiontotarget', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'addTransactionTarget',
            username,
            req.body.id_target,
            req.body.amount,
            req.body.currency,
            req.body.rate_currency
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.post('/api/seehistorytransactionhasaddedtarget', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'seeTransactionHasAddedTarget',
            username,
            req.body.id_target,

        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})

app.get('/api/seeall', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'seeAllUserTransaction',
            username
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.post('/api/seeinfortarget', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'seeInforTarget',
            username,
            req.body.id
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})


app.post('/api/gethistory', async function (req, res) {
    try {
        const username = req.username

        // load the network configuration
        const ccpPath = path.resolve(__dirname, 'connection-org1.json')
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'))

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'walletOrg1')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        console.log(`Wallet path: ${walletPath}`)

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username)
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet`)
            console.log('Run the registerUser.js application before retrying')
            throw new Error(`An identity for the user ${username.toUpperCase()} does not exist in the wallet`)
            return
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet,
            identity: username,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        })

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel')

        // Get the contract from the network.
        const contract = network.getContract('thesis')
        let result;
        result = await contract.submitTransaction(
            'getHistoryForAsset',
            req.body.id
        )

        result = JSON.parse(result.toString());
        // const contract = network.getContract('thesis')


        res.status(201).json({
            result: result,
            error: null
        })
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`)
        res.status(501).json({
            result: error,
            error: error.message
        })
    }
})
app.listen(8080, 'localhost');
console.log('Test running on http://localhost:8080');
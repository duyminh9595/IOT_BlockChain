'use strict';
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const bodyParser = require('body-parser');
const http = require('http')
const util = require('util');
const express = require('express')
const app = express();
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const cors = require('cors');
const constants = require('./config/constants.json')

const host = process.env.HOST || constants.host;
const port = process.env.PORT || constants.port;


const bcrypt = require('bcrypt')
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

const helper = require('./app/helper')
const invoke = require('./app/invoke')
const register = require('./app/register')
const qscc = require('./app/qscc')
const query = require('./app/query')


const login = require('./app/login')
const changepassword = require('./app/changepassword')
const changeinfo = require('./app/changeinfo')
const adduserincome = require('./app/adduserincome')
const seealluserincome = require('./app/seealluserincome')
const seeuserincomeid = require('./app/seeuserincomeid')
const adduserspending = require('./app/adduserspending')
const seealluserspending = require('./app/seealluserspending')
const seeuserspendingid = require('./app/seeuserspendingid')
const addusertarget = require('./app/addusertarget')
const seeallusertarget = require('./app/seeallusertarget')
const addusertransactiontotarget = require('./app/addusertransactiontotarget')
const seehistorytransactionhasaddedtarget = require('./app/seehistorytransactionhasaddedtarget')
const seeall = require('./app/seeall')
const seeinfortarget = require('./app/seeinfortarget')



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
    path: ['/users', '/login', '/register/']
}));
app.use(bearerToken());

logger.level = 'debug';


app.use((req, res, next) => {
    logger.debug('New req for %s', req.originalUrl);
    if (req.originalUrl.indexOf('/users') >= 0 || req.originalUrl.indexOf('/login') >= 0 || req.originalUrl.indexOf('/register') >= 0) {
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
            req.orgname = decoded.orgName;
            logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
            return next();
        }
    });
});

var server = http.createServer(app).listen(port, function () { console.log(`Server started on ${port}`) });
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

function getErrorMessage(field) {
    var response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

// Register and enroll user
app.post('/users', async function (req, res) {
    var username = req.body.username;
    var orgName = req.body.orgName;
    var password = req.body.password;
    logger.debug('End point : /users');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + orgName);
    logger.debug('Password  : ' + password);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: orgName
    }, app.get('secret'));

    let response = await helper.getRegisteredUser(username, orgName, true);
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(req.body.password, salt)
    logger.debug('Password has : ' + hash);
    logger.debug('-- returned from registering the username %s for organization %s', username, "thayson");
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, "thayson");
        let message = await register.invokeTransaction("mychannel", "thesis", "registerUser", username, hash);
        console.log(`message result is : ${message}`)

        const response_payload = {
            result: message,
            error: null,
            errorData: null
        }
        res.send(response_payload);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
        res.json({ success: false, message: response });
    }

});

// Register and enroll user
app.post('/register/', async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    logger.debug('End point : /users');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + "Thay Son");
    logger.debug('Password  : ' + password);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!password) {
        res.json(getErrorMessage('\'password\''));
        return;
    }

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: "Thay Son"
    }, app.get('secret'));

    let response = await helper.getRegisteredUser(username, "thayson", true);
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(req.body.password, salt)
    logger.debug('Password has : ' + hash);
    logger.debug('-- returned from registering the username %s for organization %s', username, "thayson");
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, "thayson");
        let message = await register.invokeTransaction("mychannel", "thesis", "registerUser", username, hash);
        console.log(`message result is : ${message}`)

        const response_payload = {
            result: message,
            error: null,
            errorData: null
        }
        res.send(response_payload);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
        res.json({ success: false, message: response });
    }
});

//login
app.post('/login', async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    logger.debug('End point : /login');
    logger.debug('User name : ' + username);
    logger.debug('Password  : ' + password);
    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: "Thay Son"
    }, app.get('secret'));
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await login.query("mychannel", "thesis", "queryUser", username, "thayson");
        var salt = bcrypt.genSaltSync(10)
        var check = bcrypt.compareSync(password, message.password);
        console.log(check)
        if (check) {
            var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
                username: username,
                orgName: "Thay Son"
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
    } else {
        res.json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
//api info
app.get('/api/info', async function (req, res) {
    const username = req.username
    logger.debug('End point : /login');
    logger.debug('User name : ' + username);
    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: "Thay Son"
    }, app.get('secret'));
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let result = await login.query("mychannel", "thesis", "queryUser", username, "thayson");
        res.status(200).json({
            data: result,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
//change password
app.post('/api/changepassword', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/changepassword');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await login.query("mychannel", "thesis", "queryUser", username, "thayson");
        var salt = bcrypt.genSaltSync(10)
        var check = bcrypt.compareSync(req.body.password, message.password);
        var hasnew = bcrypt.hashSync(req.body.newpassword, salt);
        if (check) {
            let message = await changepassword.invokeTransaction("mychannel", "thesis", "changePassword", username, hasnew);
            res.status(200).json({
                result: message,
                error: "Thành công"
            })
        }
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
// change info
app.post('/api/changeinfo', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/changeinfo');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await changeinfo.invokeTransaction("mychannel", "thesis", "queryUser", username, req.body.ngaysinh, req.body.username);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
//add user income
app.post('/api/adduserincome', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/adduserincome');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await adduserincome.invokeTransaction("mychannel", "thesis", username, req.body.description,
            req.body.amount,
            req.body.currency,
            req.body.id_income);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//see all user income
app.get('/api/seealluserincome', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seealluserincome');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seealluserincome.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//see  user income id
app.post('/api/seeuserincomeid', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seeuserincomeid');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeuserincomeid.query("mychannel", "thesis", username, req.body.id);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//add user spending
app.post('/api/adduserspending', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/adduserspending');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await adduserspending.invokeTransaction("mychannel", "thesis", username, req.body.description,
            req.body.amount,
            req.body.currency,
            req.body.id_spending);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//see all user spending
app.get('/api/seealluserspending', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seealluserspending');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seealluserspending.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//see  user spending id
app.post('/api/seeuserspendingid', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seeuserspendingid');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeuserspendingid.query("mychannel", "thesis", username, req.body.id);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//add user target
app.post('/api/addusertarget', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/addusertarget');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await addusertarget.invokeTransaction("mychannel", "thesis", username,
            req.body.description,
            req.body.start_date,
            req.body.end_date,
            req.body.amount,
            req.body.currency,
            uuidv4());
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//see  user target
app.get('/api/seeallusertarget', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seeallusertarget');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeallusertarget.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//add user transaction target
app.post('/api/addusertransactiontotarget', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seeallusertarget');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await addusertransactiontotarget.invokeTransaction("mychannel", "thesis", username, req.body.id_target,
            req.body.amount,
            req.body.currency,
            req.body.rate_currency);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//see history transaction has added target
app.post('/api/seehistorytransactionhasaddedtarget', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seehistorytransactionhasaddedtarget');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seehistorytransactionhasaddedtarget.query("mychannel", "thesis", username, req.body.id_target);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//see info target
app.post('/api/seeinfortarget', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seeinfortarget');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeinfortarget.query("mychannel", "thesis", username, req.body.id);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//see all
app.get('/api/seeall', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seeall');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeall.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message,
            error: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
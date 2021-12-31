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
    v4: uuidv4,
} = require('uuid');

const helper = require('./app/helper')
const register = require('./app/register')



const login = require('./app/login')
const changepassword = require('./app/changepassword')
const addFarm = require('./app/addFarm')
const seefarmbaseonid = require('./app/seeinfobaseonfarmid')
const seeallfarm = require('./app/seeinfoallfarm')
const addProduct = require('./app/addnongsan')
const seeproductbaseonfarmid = require('./app/seeproductbaseonfarmid')
const seeallproduct = require('./app/seeinforallproduct')
const addArea = require('./app/addarea')
const seeareabaseonid = require('./app/seeinfoareabaseonfarmid')
const seeallarea = require('./app/seeinforallarea')
const seeallareabaseonnode = require('./app/seeinfoareabaseonnode')
const seealluser = require('./app/seealluser')
const addplantingseason = require('./app/addplantingseason')
const getallplantingseasonbaseonnode = require('./app/seeallplantingseasonbaseonnode')
const seeallplatingofnode = require('./app/seeallplantingofnode')
const seeallplatingofnodeandplantingseasonid = require('./app/seeallplantingofnodeandplantingseason')

const addplanting = require('./app/addplanting')
const addfertilizing = require('./app/addfertilizing')
const seeallfertilizingofnode = require('./app/seeallfertilizingofnode')
const seeallfertilizingofnodeandplantingseason = require('./app/seeallfertilizingofnodeandplantingseason')

const addcaring = require('./app/addcaring')
const seeallcaringofnode = require('./app/seeallcaringofnode')
const seeallcaringofnodeandplantingseason = require('./app/seeallcaringofnodeandplantingseason')

const addharvesting = require('./app/addharvesting')
const seeallharvestingofnode = require('./app/seeallharvestingofnode')
const seeallharvestingofnodeandplantingseason = require('./app/seeallharvestingofnodeandplantingseason')

const adddevice = require('./app/adddevice')
const seealldeviceofnode = require('./app/seealldeviceofnode')
const seealldeviceofnodeandaddressfarm = require('./app/seealldeviceofnodeandaddressfarm')
const seealldeviceofnodeandareaaddress = require('./app/seealldeviceofnodeandareaaddress')

const adddatatodevice = require('./app/adddatatodevice')
const seeinfohassendtodevice = require('./app/seeinfohassendtodevice')

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
    path: ['/login', '/register/', '/api/farm', '/api/allfarm', '/api/seeproduct', '/api/seeallproduct', '/api/seearea', '/api/seeallarea', '/api/seeallareabaseonnode']
}));
app.use(bearerToken());

logger.level = 'debug';


app.use((req, res, next) => {
    logger.debug('New req for %s', req.originalUrl);
    if (req.originalUrl.indexOf('/login') >= 0 || req.originalUrl.indexOf('/register') >= 0
        || req.originalUrl.indexOf('/api/farm') >= 0 || req.originalUrl.indexOf('/api/allfarm') >= 0
        || req.originalUrl.indexOf('/api/seeproduct') >= 0 || req.originalUrl.indexOf('/api/seeallproduct') >= 0
        || req.originalUrl.indexOf('/api/seearea') >= 0 || req.originalUrl.indexOf('/api/seeallarea') >= 0
        || req.originalUrl.indexOf('/api/seeallareabaseonnode') >= 0) {
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
            console.log(decoded)
            req.username = decoded.username;
            req.orgname = decoded.orgName;
            logger.debug(decoded.username)
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
app.post('/register/', async function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    logger.debug('End point : /register/');
    logger.debug('User name : ' + email);
    logger.debug('Org name  : ' + "Thay Son");
    logger.debug('Password  : ' + password);
    if (!email) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!password) {
        res.json(getErrorMessage('\'password\''));
        return;
    }

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: email,
        orgName: "Thay Son"
    }, app.get('secret'));

    let response = await helper.getRegisteredUser(email, "thayson", true);
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(req.body.password, salt)
    logger.debug('Password has : ' + hash);
    logger.debug('-- returned from registering the username %s for organization %s', email, "thayson");
    var name = req.body.name;
    var avatar = req.body.avatar;
    var phone = req.body.phone;
    var address = req.body.address;
    var facebook = req.body.facebook;
    var role = req.body.role;
    var portfolio = req.body.portfolio;
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', email, "thayson");
        let message = await register.invokeTransaction("mychannel", "thesis", "registerUser", name, avatar, email, phone, address, facebook, role, portfolio, hash);
        console.log(`message result is : ${message}`)

        const response_payload = {
            result: message,
            error: null,
            errorData: null
        }
        res.send(response_payload);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', email, orgName, response);
        res.json({ success: false, message: response });
    }
});

//login
app.post('/login', async function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    logger.debug('End point : /login');
    logger.debug('User name : ' + email);
    logger.debug('Password  : ' + password);
    let isUserRegistered = await helper.isUserRegistered(email, "thayson");
    if (isUserRegistered) {
        let message = await login.query("mychannel", "thesis", "queryUser", email, "thayson");
        var salt = bcrypt.genSaltSync(10)
        var check = bcrypt.compareSync(password, message.password);
        console.log(check)
        if (check) {
            var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
                username: email,
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
        res.json({ success: false, message: `User with username ${email} is not registered with thay son, Please register first.` });
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
//add farm
app.post('/api/addfarm', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/addFarm');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await addFarm.invokeTransaction("mychannel", "thesis", username, req.body.name, req.body.description,
            req.body.address, req.body.phone, req.body.email, req.body.website, req.body.facebook, req.body.logo, req.body.location);
        res.status(200).json({
            result: "Thành công"
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

//see info farm base on id
app.get('/api/farm', async function (req, res) {
    logger.debug('End point : /api/farm');
    let farmid = req.query.farmid
    let message = await seefarmbaseonid.query("mychannel", "thesis", 'admin', farmid);
    res.status(200).json({
        result: message,
        error: "Thành công"
    })
})
//see info farm all farm
app.get('/api/allfarm', async function (req, res) {
    logger.debug('End point : /api/allfarm');
    let message = await seeallfarm.query("mychannel", "thesis", 'admin');
    res.status(200).json({
        result: message,
        error: "Thành công"
    })
})
app.post('/api/addnongsan', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/addnongsan');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    let farmid = req.query.farmid
    if (isUserRegistered) {
        let message = await addProduct.invokeTransaction("mychannel", "thesis", username, farmid, req.body.name, req.body.description);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

app.get('/api/seeproduct', async function (req, res) {
    logger.debug('End point : /api/seeproduct');
    let farmid = req.query.farmid
    let message = await seeproductbaseonfarmid.query("mychannel", "thesis", 'admin', farmid);
    res.status(200).json({
        result: message,
        error: "Thành công"
    })
})
app.get('/api/seeallproduct', async function (req, res) {
    logger.debug('End point : /api/seeallproduct');
    let message = await seeallproduct.query("mychannel", "thesis", 'admin');
    res.status(200).json({
        result: message,
        error: "Thành công"
    })
})
app.post('/api/addarea', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/addarea');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    let farmid = req.query.farmid
    if (isUserRegistered) {
        let message = await addArea.invokeTransaction("mychannel", "thesis", username, req.body.name, req.body.description, farmid);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.get('/api/seearea', async function (req, res) {
    logger.debug('End point : /api/seearea');
    let farmid = req.query.farmid
    let message = await seeareabaseonid.query("mychannel", "thesis", 'admin', farmid);
    res.status(200).json({
        result: message,
        error: "Thành công"
    })
})
app.get('/api/seeallarea', async function (req, res) {
    logger.debug('End point : /api/seeallarea');
    let message = await seeallarea.query("mychannel", "thesis", 'admin');
    res.status(200).json({
        result: message,
        error: "Thành công"
    })
})
app.get('/api/seeallareabaseonnode', async function (req, res) {
    logger.debug('End point : /api/seeallareabaseonnode');
    let message = await seeallareabaseonnode.query("mychannel", "thesis", 'admin');
    res.status(200).json({
        result: message,
        error: "Thành công"
    })
})

app.get('/api/seealluser', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/seealluser');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seealluser.invokeTransaction("mychannel", "thesis", username);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.post('/api/createplantingseason', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/createplantingseason');
    logger.debug('User name : ' + username);
    let farmid = req.query.farmid
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await addplantingseason.invokeTransaction("mychannel", "thesis", username, req.body.name, farmid);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.get('/api/getallplantingseasonofnode', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/createplantingseason');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await getallplantingseasonbaseonnode.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.post('/api/createplanting', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/createplanting');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await addplanting.invokeTransaction("mychannel", "thesis", username, req.body.plantingseason, req.body.source, req.body.description);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.get('/api/getallplantingofnode', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getallplantingofnode');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeallplatingofnode.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.post('/api/getallplantingofnodeandplantingseason', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getallplantingofnodeandplantingseason');
    logger.debug('User name : ' + username);

    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeallplatingofnodeandplantingseasonid.query("mychannel", "thesis", username, req.body.plantingseasonid);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.post('/api/createfertilizing', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/createfertilizing');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await addfertilizing.invokeTransaction("mychannel", "thesis", req.body.plantingseason, username,req.body.fertilizerType, req.body.description);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.get('/api/getallfertilizingofnode', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getallfertilizingofnode');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeallfertilizingofnode.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.post('/api/getallfertilizingofnodeandplantingseason', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getallfertilizingofnodeandplantingseason');
    logger.debug('User name : ' + username);

    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeallfertilizingofnodeandplantingseason.query("mychannel", "thesis", username, req.body.plantingseasonid);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.post('/api/createcaring', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/createcaring');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await addcaring.invokeTransaction("mychannel", "thesis", req.body.plantingseason, username,req.body.method, req.body.description);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

app.get('/api/getallcaringgofnode', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getallcaringgofnode');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeallcaringofnode.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.post('/api/getallcaringofnodeandplantingseason', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getallcaringofnodeandplantingseason');
    logger.debug('User name : ' + username);

    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeallcaringofnodeandplantingseason.query("mychannel", "thesis", username, req.body.plantingseasonid);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

app.post('/api/createharvesting', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/createcaring');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await addharvesting.invokeTransaction("mychannel", "thesis", req.body.plantingseason, username, req.body.quantity, req.body.description, req.body.kq);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

app.get('/api/getallharvestingofnode', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getallharvestingofnode');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeallharvestingofnode.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

app.post('/api/getallharvestingofnodeandplantingseason', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getallharvestingofnodeandplantingseason');
    logger.debug('User name : ' + username);

    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeallharvestingofnodeandplantingseason.query("mychannel", "thesis", username, req.body.plantingseasonid);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

app.post('/api/addevice', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/addevice');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await adddevice.invokeTransaction("mychannel", "thesis",req.body.addressfarm,username,req.body.addressarea,req.body.name,req.body.description);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

app.get('/api/getalldeviceofnode', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getalldeviceofnode');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seealldeviceofnode.query("mychannel", "thesis", username);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.get('/api/getalldeviceofaddressfarm', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getalldeviceofaddressfarm');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seealldeviceofnodeandaddressfarm.query("mychannel", "thesis", username,req.body.addressfarm);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.get('/api/getalldeviceofaddressarea', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getalldeviceofaddressarea');
    logger.debug('User name : ' + username);
    let areaaddress = req.query.areaaddress
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seealldeviceofnodeandareaaddress.query("mychannel", "thesis", username,areaaddress);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})

app.post('/api/adddatatodevice', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/addevice');
    logger.debug('User name : ' + username);
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await adddatatodevice.invokeTransaction("mychannel", "thesis",username,req.body.deviceaddress,req.body.nhietdo,req.body.doam);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
app.get('/api/getinfohassenttodevice', async function (req, res) {
    const username = req.username
    logger.debug('End point : /api/getalldeviceofaddressarea');
    logger.debug('User name : ' + username);
    let deviceaddress = req.query.deviceaddress
    let isUserRegistered = await helper.isUserRegistered(username, "thayson");
    if (isUserRegistered) {
        let message = await seeinfohassendtodevice.query("mychannel", "thesis", username,deviceaddress);
        res.status(200).json({
            result: message
        })
    } else {
        res.status(500).json({ success: false, message: `User with username ${username} is not registered with thay son, Please register first.` });
    }
})
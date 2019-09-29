// set up ========================
var DB = require('./DB')
var express = require('express');
var app = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)


var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

//app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.listen(8080);
console.log("App listening on port 8080");

app.get('/getTest', function (req, res) {
    DB.select("test", "", "", "",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });

});

app.post('/saveTest', function (req, res) {
    console.log(req.body)
    DB.insert("test", "dta", "('mandy'),('bro'),('hi')",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });

});


app.get('/getAllCustomers', function (req, res) {
    DB.select("viewAllCustomers", "", "", "",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);
                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});

app.post('/insertCustomer', function (req, res) {
    console.log(req.body)
    DB.insert("customer",
        "name, contactNo1, contactNo2, address, email, dob, points",
        "('" + req.body.name + "', '" + req.body.contactNo1 + "', '" + req.body.contactNo2 + "', '" + req.body.address + "', '" + req.body.email + "', '" + req.body.dob + "', '" + req.body.points + "' )",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});


app.post('/updateCustomer', function (req, res) {
    console.log(req.body)
    DB.update("customer",
        "name='" + req.body.name + "', contactNo1='" + req.body.contactNo1 + "', contactNo2='" + req.body.contactNo2 + "', address='" + req.body.address + "', email='" + req.body.email + "', dob='" + req.body.dob + "', points='" + req.body.points + "'",
        "id='" + req.body.id + "' ",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});

app.post('/deleteCustomer', function (req, res) {
    console.log(req.body)
    DB.deletee("customer",
        "id='" + req.body.id + "' ",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});

app.post('/deactivateCustomer', function (req, res) {
    console.log(req.body)
    DB.update("customer",
        "status='0'",
        "id='" + req.body.id + "' ",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});



/////////////////////************** Supplier ****************//////////////////////////////////

app.get('/getAllSuppliers', function (req, res) {
    DB.select("viewAllSuppliers", "", "", "",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);
                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});

app.post('/insertSupplier', function (req, res) {
    console.log(req.body)
    DB.insert("supplier",
        "name, contactNo1, contactNo2, address, email, rating,userid",
        "('" + req.body.name + "', '" + req.body.contactNo1 + "', '" + req.body.contactNo2 + "', '" + req.body.address + "', '" + req.body.email + "', '" + req.body.rating + "',  '" + req.body.userid + "')",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});
app.post('/deleteSupplier', function (req, res) {
    console.log(req.body)
    DB.update("supplier",
        "status='" + req.body.name + "'",
        "id='" + req.body.id + "' ",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});
app.post('/updateSupplier', function (req, res) {
    console.log(req.body)
    DB.update("supplier",
        "name='" + req.body.name + "', contactNo1='" + req.body.contactNo1 + "', contactNo2='" + req.body.contactNo2 + "', address='" + req.body.address + "', email='" + req.body.email + "',  rating='" + req.body.rating + "'",
        "id='" + req.body.id + "' ",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});


/////////////************* Product **************/////////////////
app.get('/getAllProduct', function (req, res) {
    DB.select("viewAllProducts", "", "", "",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);
                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});
app.post('/insertProduct', function (req, res) {
    console.log(req.body)
    DB.insert("product",
        "brand_id, size_id, clotth_id, product_description, gender, notes, userid,alert_qty,status",
        "('" + req.body.brand.id + "', '" + req.body.size.id + "', '" + req.body.cloth.id + "', '" + req.body.product.product_description + "', '" + req.body.product.gender + "', '" + req.body.product.notes + "', '" + req.body.product.userid + "','" + req.body.product.alert_qty + "' ,'" + req.body.product.status + "')",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});
app.post('/updateProduct', function (req, res) {
    console.log(req.body)
    DB.update("product",
        "brand_id='" + req.body.brand.id + "', size_id='" + req.body.size.id + "', clotth_id='" + req.body.cloth.id + "', product_description='" +  req.body.product.product_description  + "', gender='" + req.body.product.gender + "',  notes='" +  req.body.product.notes + "',  userid='" +  req.body.product.userid + "', alert_qty='" + req.body.product.alert_qty + "', status='" + req.body.product.status + "'",
        "id='" + req.body.product.id + "' ",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});
app.post('/deleteProduct', function (req, res) {
    console.log(req.body)
    DB.update("product",
        "status='" + req.body.status + "'",
        "id='" + req.body.id + "' ",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});
//////////************ Brand *****************//////////////////
app.post('/insertBrand', function (req, res) {
    console.log(req.body)
    DB.insert("brand",
        "name",
        "('" + req.body.brand_name + "' )",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});
app.get('/getAllBrands', function (req, res) {
    DB.select("viewAllBrands", "", "", "",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);
                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});

//////////************ Size *****************//////////////////
app.post('/insertSize', function (req, res) {
    console.log(req.body)
    DB.insert("size",
        "size_name",
        "('" + req.body.size_name + "' )",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});
app.get('/getAllSizes', function (req, res) {
    DB.select("viewAllSizes", "", "", "",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);
                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});

//////////************ Cloth *****************//////////////////
app.post('/insertCloth', function (req, res) {
    console.log(req.body)
    DB.insert("clotth",
        "name",
        "('" + req.body.cloth_name + "' )",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);

                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});
app.get('/getAllCloths', function (req, res) {
    DB.select("viewAllCloths", "", "", "",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);
                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});

//////////************ INvoice *****************//////////////////

app.get('/getAllCustomersForSelect', function (req, res) {
    DB.select("viewAllCustomers", "", "", "'id asc'",
        (data, response) => {
            if (response.statusCode == 200) {
                //on success execute bellow
                console.log(data);
                res.json(data);
            } else {
                //on error execute below
                console.log(data.toString());
                console.log("status code:" + response.statusCode);
                res.send(response.statusCode, data.toString());
            }
        });
});

// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var mysql = require('mysql');

const http = require('http');
const fs = require('fs');
const carbone = require('carbone');

const { exec } = require('child_process');
const port = 65456;
// configuration =================

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(65456);
console.log("App listening on port 65456");

app.post('/util/print', function (req, res) {
    console.log(req.body);
    printFromUrl(req.body.file, req.body.data, res, req.body.printer);
});

var printOptions = {
    convertTo: 'pdf', //can be docx, txt, ...
};

function print(file, data, res, printerName) {
    carbone.render(file, data, printOptions, function (err, result) {
        if (err) {
            if (res) res.send(500, err);
        } else {
            fs.writeFileSync('out.pdf', result);

            if (printerName) {

                exec('soffice --pt ' + printerName + ' out.pdf', (err, stdout, stderr) => {
                    if (err || stderr) {
                        // node couldn't execute the command
                        res.send(500, err);
                        return;
                    }

                    // the *entire* stdout and stderr (buffered)
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                });

                if (res) res.json("OK");
            } else {
                if (res) {
                    var file = fs.createReadStream('out.pdf');
                    var stat = fs.statSync('out.pdf');
                    res.setHeader('Content-Length', stat.size);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
                    file.pipe(res);
                }
            }
        }
    });
}

function printFromUrl(template, data, res, printerName) {
    let dir = './tmp';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const file = fs.createWriteStream("tmp/tmp");
    const request = http.get("http://localhost:7777/assets/templates/" + template, function (response) {
        response.pipe(file);
        print("tmp/tmp", data, res, printerName);
    });
}

var pdata = {
    medicalCenter: {
        name: "Shanthi Medical Home",
        phone: "(031) 2241836",
        no: "No. 210/1/C",
        street: "Negombo Rd",
        city: "Katana",
        email: "",
    },

    product: {
        name: "EZ Channeling",
        tech: "EZ_Channeling",
        short: "EZ+",
        version: "1.0.0",
        description: "Perfectly designed and precisely prepared electronic channelling system.",
    },

    company: {
        name: "iNAC",
        phone: "(071) 2660899",
        no: "456/140",
        street: "jabeer rd",
        cirty: "colombo",
        email: "hello.inac@gmail.com",
        copyright: "2019-2020",
    }
}

//init headless printing service
printFromUrl("init.odt", pdata, null, null);


var data = {
    firstname: 'John',
    lastname: 'Doe',
    cars: [
        { "brand": "Lumeneo" },
        { "brand": "Tesla" },
        { "brand": "Toyota" },
        { "brand": "Lumeneo" },
        { "brand": "Tesla" },
        { "brand": "Toyota" },
        { "brand": "Lumeneo" },
        { "brand": "Tesla" },
        { "brand": "Toyota" }
    ]
};

app.get('/testPrint', function (req, res) {
    printFromUrl('simple.odt', data, res);

});

app.post('/printGRN', function (req, res) {
    // console.log(req.body);
    // var d = new Date().toLocaleTimeString().replace(/ T/, ' ').replace(/\..+/, '');
    // var d2 = new Date().toLocaleDateString().replace(/T/, ' ').replace(/\..+/, '');
    // // var paymentType=req.body.grn_regi.paymentType.id;
    // var grn = {
    //     date_grn: d2 + " " + d,
    //     inv_id: req.body.grn_regi.grn.ref_no,
    //     supplier_name: req.body.grn_regi.supplier.name,
    //     payment_status: req.body.grn_regi.paymentType.id,
    //     datarow: [
    //         { "product_description": req.body.products_all.product_description },
    //         { "price": req.body.products_all.buying_price },
    //         { "qty": req.body.products_all.qty },
    //         { "subtotal": req.body.products_all.total },
    //     ],
    //     total_grn: req.body.grn_regi.product.total,
    //     payment_type: req.body.grn_regi.paymentType.type,
    //     discount: req.body.grn_regi.product.discount,
    //     paid_amount: req.body.grn_regi.product.paid_amount,
    //     due_amount: req.body.grn_regi.product.due_amount,

    // };
    printFromUrl('supplier_invoice.odt', req.body, res);

});

app.post('/printDailyReport', function (req, res) {
    console.log(req.body);

    var d2 = new Date().toLocaleDateString().replace(/T/, ' ').replace(/\..+/, '');
    // var paymentType=req.body.grn_regi.paymentType.id;
    var monthlyReport = {
        current_date: d2,
        grossSales: req.body.dailySummary.grossSales,
        discount: req.body.dailySummary.overallDiscount,
        datarow: [
            { "paymenttype:": req.body.paymentTypeSalesSet.type },
            { "type_amount": req.body.paymentTypeSalesSet.total },
        ],
        net_amount: req.body.dailySummary.netAmount,
        datarow2: [
            { "gender:": req.body.genderSalesSet.name },
            { "gender_amount": req.body.genderSalesSet.total },
        ],
        return_count: req.body.dailySummary.salesReturnsQty,
        return_amount: req.body.dailySummary.salesRetrunsAmount,
        balance: req.body.dailySummary.cashBalance,
    };
    printFromUrl('daily_sales_report.odt', monthlyReport, res);

});

app.post('/printMonthlyReport', function (req, res) {
    console.log(req.body);
    var d = new Date();
    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var n = month[d.getMonth()];
    // var paymentType=req.body.grn_regi.paymentType.id;
    var monthlyReport = {
        current_month: n,
        grossSales: req.body.dailySummary.grossSales,
        discount: req.body.dailySummary.overallDiscount,
        datarow: [
            { "paymenttype:": req.body.paymentTypeSalesSet.type },
            { "type_amount": req.body.paymentTypeSalesSet.total },
        ],
        net_amount: req.body.dailySummary.netAmount,
        datarow2: [
            { "gender:": req.body.genderSalesSet.name },
            { "gender_amount": req.body.genderSalesSet.total },
        ],
        return_count: req.body.dailySummary.salesReturnsQty,
        return_amount: req.body.dailySummary.salesRetrunsAmount,
        balance: req.body.dailySummary.cashBalance,
    };
    printFromUrl('monthly_sales_report.odt', monthlyReport, res);

});


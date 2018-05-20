// Open Bank Projelst
// Copyright 2011-2016 TESOBE Ltd.

var express = require('express', template = require('pug'));
var session = require('express-session');
var util = require('util');
var oauth = require('oauth');
var firebase = require('firebase');
var app = express();

// Template engine (previously known as Jade)
var pug = require('pug');
// This loads your consumer key and secret from a file you create.
var config = require('./config.json');
// Used to validate forms
var bodyParser = require('body-parser')
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// Take param from config.json file
var _openbankConsumerKey = config.consumerKey;
var _openbankConsumerSecret = config.consumerSecret;
var _openbankRedirectUrl = config.redirectUrl;
// The location, on the interweb, of the OBP API server we want to use.
var apiHost = config.apiHost;
console.log ("* apiHost is: " + apiHost)

// Oauth Configuration
var consumer = new oauth.OAuth(
    apiHost + '/oauth/initiate',
    apiHost + '/oauth/token',
    _openbankConsumerKey,
    _openbankConsumerSecret,
    '1.0',
    _openbankRedirectUrl,
    'HMAC-SHA1'
);

// Cookie Parser
var cookieParser = require('cookie-parser');
app.use(session({
    secret: "very secret",
    resave: false,
    saveUninitialized: true,
}));

// Firebase Configuration
var configFirebase = {
    apiKey: "AIzaSyB7-H-6t5kb5D8XB9jf33SVkpjgmeJqATg",
    authDomain: "test-3ff4d.firebaseapp.com",
    databaseURL: "https://test-3ff4d.firebaseio.com",
    projectId: "test-3ff4d",
    storageBucket: "test-3ff4d.appspot.com",
    messagingSenderId: "1059441748413"
};

if (!firebase.apps.length) {
    firebase.initializeApp(configFirebase);
}

var accountIdISP = "12456734234";
var bankIdISP = "psd201-bank-x--uk";

// TODO spostare in routes.js server.js
app.get('/connect', function(req, res){
    consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
        if (error) {
            res.status(500).send("Error getting OAuth request token : " + util.inspect(error));
        } else {
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            res.redirect(apiHost + "/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
        }
    });
});

app.get('/callback', function(req, res){
    console.log("session: ",req.session.oauthRequestToken);
    consumer.getOAuthAccessToken(
        req.session.oauthRequestToken,
        req.session.oauthRequestTokenSecret,
        req.query.oauth_verifier,
        function(error, oauthAccessToken, oauthAccessTokenSecret, result) {
            if (error) {
                // oauthAccessToken, -Secret and result are now undefined
                res.status(500).send("Error getting OAuth access token : " + util.inspect(error));
            } else {
                // error is now undefined
                req.session.oauthAccessToken = oauthAccessToken;
                req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
                console.log("res", res);
                res.redirect('/signed_in');
            }
        }
    );
});

app.get('/signed_in', function(req, res){
    // Set the template page.
    var template = "./template/signedIn.pug";
    var templateFail = "./template/signedIn.pug";
    var options = {
        "title": "signedIn"
    }
    // pid from session
    var pid = req.session.pid;
    // 'Signing in byby OAuth worked. Now you can do API calls on private data like this: <br><a href="/getMyAccounts">Get My Accounts</a> <br><a href="/getCurrentUser">Get Current User</a> <br><a href="/createTransactionRequest">Create Transaction Request (make payment)</a> <br> <a href="/loadCustomers">Load Customers (this is an admin utility function) </a> <br>  <br> Please see the <a href="https://apiexplorersandbox.openbankproject.com">API Explorer</a> for the full list of API calls available.')
    consumer.get(apiHost + "/obp/v2.1.0/my/accounts",
        req.session.oauthAccessToken,
        req.session.oauthAccessTokenSecret,
        function (error, data, response) {
            console.log("INSIDE CUSTOMER GET");
            var parsedData = JSON.parse(data);
            var ok = false;
            // CHeck if account is valid
            console.log("BEFORE FOR EACH");
            console.log("parsedData:  ",parsedData);
            parsedData.forEach(function(item) {
                console.log("item.id",item.id);
                console.log("accountIdISP",accountIdISP);
                if(item.id == accountIdISP && item.bank_id == bankIdISP){
                    ok = true;
                    console.log("ok = true");
                }
            });

            if(ok == false) {
                var html = pug.renderFile(templateFail);
                res.status(200).send(html);
            }else{
                console.log("REDIRECT");
                res.redirect('/createTransactionRequest');
            }
            console.log("AFTER REDIRECT");
        }
    );
});

app.get('/home', function(req, res){
    var template = "./template/home.pug"
    var options = {
        "title": "Home",
    }
    var html = pug.renderFile(template, options)
    res.status(200).send(html)
});

app.get('/getCurrentUser', function(req, res){
    consumer.get(apiHost + "/obp/v2.1.0/users/current",
    req.session.oauthAccessToken,
    req.session.oauthAccessTokenSecret,
    function (error, data, response) {
        var parsedData = JSON.parse(data);
        res.status(200).send(parsedData)
    });
});

app.get('/getMyAccounts', function(req, res){
    consumer.get(apiHost + "/obp/v2.1.0/my/accounts",
    req.session.oauthAccessToken,
    req.session.oauthAccessTokenSecret,
    function (error, data, response) {
        var parsedData = JSON.parse(data);
        res.status(200).send(parsedData)
    });
});

app.get('/createTransactionRequest', function(req, res){
    // Set the template file.
    var template = "./template/createTransactionRequest.pug";
    // Refer to the specific element of the "pending_payments_psd2" table in firebase.
    var refPsd2Payment = firebase.database().ref("pending_payments_psd2/" + req.session.pid);
    // Take a snapshot of the payment selected.
    refPsd2Payment.once("value").then(function(snapshot) {
        // Get the token amount sent in the request.
        var tokenAmount = snapshot.child("tokenAmount").val();
        // TODO Convertion from the token to €.
        var euroAmount = tokenAmount / 1000 * 700;
        console.log("\nEuro amount: ", euroAmount, "€");
        // Get the shop id.
        var shopId = snapshot.child("shop").val();
        // Refer to the specific element of the "shops" table in firebase.
        var refShop = firebase.database().ref("shops/" + shopId);
        // Take a snapshot of the shop selected.
        refShop.once("value").then(function(snapshot) {
            // Get the shop data desired.
            var toBankId = snapshot.child("bankId").val();
            var toAccountId = snapshot.child("accountId").val();
            console.log("shopId", shopId);
            var options = {
                "title": "Create Transaction",
                "pid": req.session.pid,
                "shopId": shopId,
                "toBankId": toBankId,
                "toAccountId": toAccountId,
                "tokenAmount": tokenAmount,
                "euroAmount": euroAmount,
            };

            // TODO Only ISP admin can access, prevedeee caso inizale per il setting dell'admin e gli accessi successivi
            /*consumer.get(apiHost + "/obp/v2.1.0/users/current",
            req.session.oauthAccessToken,
            req.session.oauthAccessTokenSecret,
            function (error, data, response) {
                var parsedData = JSON.parse(data);
                console.log("parsedData: ", parsedData);
            });*/
            console.log("rendering create Transaction Req: ");
            // Template rendering.
            var html = pug.renderFile(template, options)
            res.status(200).send(html)

        });
    }).catch(()=>{
        // TODO handle error safely.
        console.log("Error management TODO");
    });

    // Render the template.
    /*var html = pug.renderFile(template, options);
    // Perform the GET request.
    consumer.get(apiHost + "/obp/v2.1.0/my/accounts",
    req.session.oauthAccessToken,
    req.session.oauthAccessTokenSecret,
    function (error, data, response) {
        var parsedData = JSON.parse(data);
        res.status(200).send(html)
    });*/
});
app.post('/createTransactionRequest', urlencodedParser, function(req, res){
    // Set the template file.
    var template = "./template/createTransactionRequest.pug";
    // Check request body.
    if (!req.body) return res.sendStatus(400)
    // Set the body values.
    var fromBankId = "psd201-bank-x--uk";
    var fromAccountId = "12456734234";
    var toBankId = req.body.to_bank_id;
    //var toBankId = testBankInfo.toBankId;
    var toAccountId = req.body.to_account_id;
    var currency = "EUR";
    var amount = req.body.amount;
    var description = req.body.description;
    var transactionRequestType = "SANDBOX_TAN";
    console.log("transactionRequestType is: " + transactionRequestType);
    // Build the post body.
    var toObj = { "bank_id": toBankId, "account_id": toAccountId };
    var valueObj = { "currency":currency, "amount":amount };
    var detailsObj = { "to": toObj, "value": valueObj, "description": description };
    var details = JSON.stringify(detailsObj);
    var viewId = "owner";
    var apiHost = config.apiHost;
    var postUrl = apiHost + "/obp/v2.1.0/banks/" + fromBankId + "/accounts/" + fromAccountId + "/" + viewId + "/transaction-request-types/" + transactionRequestType + "/transaction-requests";
    console.log("\npostUrl is " + postUrl);
    console.log("\ndetails is: " + details);
    console.log("\napiHost",apiHost);
    // Perform the POST request.
    consumer.post(postUrl,
        req.session.oauthAccessToken,
        req.session.oauthAccessTokenSecret,
        details,                            // This is the body of the request.
        "application/json",                 // Must specify this, else will get 404.
        function (error, data, response) {
            // If everything is ok, error is null.
            var error = JSON.stringify(error)
            console.log("\nerror is: " + error)
            console.log("\ndata is: " + data)
            console.log("\nresponse is: " + response)
            // Parsing received data.
            try {
                var parsedData = JSON.parse(data);
                // Set completed value to true
                firebase.database().ref('pending_payments_psd2/' + req.session.pid).child("completed").set({
                    completed: true
                });
                console.log("\n ********* AFTER FIREBASEEEE")
                console.log("\nparsedData is: " + parsedData)
                console.log("\nparsedData.id is: " + parsedData.id)
                console.log("\nparsedData.transaction_ids is: " + parsedData.transaction_ids)
                message = "Nothing went wrong"
            } catch (err) {
                // Handle the error safely.
                console.log(err)
                message = "Something went wrong creating a transaction request - did you supply the correct values?"
            }
            // Set params for the template.
            var options = {
                "title": "Transaction",
                "error": error,
                "postUrl" : postUrl,
                "fromBankId": fromBankId,
                "fromAccountId": fromAccountId,
                "toBankId": toBankId,
                "toAccountId" : toAccountId,
                "currency" : currency,
                "transactionRequestType" : transactionRequestType,
                "details": details,
                "data": data
            };
            // Render template.
            var html = pug.renderFile(template, options)
            res.status(200).send(html)

            //TODO Cambiare il valore del psd2_payment a completed e mostrare la transazione completata in next.js
        }
    );
});

// Loop through a Customers file, find the User matching email, Post the customer (which links to the User)
app.get('/loadCustomers', function(req, res) {

    var template = "./template/loadCustomers.pug";

    // Location of customer file is stored in filesConfig.json like this:
    //
    // {
    // "customerFile": "/path-to/OBP_sandbox_customers_pretty.json",
    // "sandboxFile": "/path-to/OBP_sandbox_pretty.json"
    // }

    var filesConfig = require('./filesConfig.json');

    var customers = require(filesConfig.customerFile);


    console.log('before customer loop. There are ' + customers.length + ' customers.')


    customers.forEach(function processCustomer(customer) {

            var usersByEmailUrl = apiHost + '/obp/v2.1.0/users/' + customer.email;
            console.log('url to call: ' + usersByEmailUrl)

            // get user by email
            consumer.get(usersByEmailUrl,
                req.session.oauthAccessToken,
                req.session.oauthAccessTokenSecret,
                function getUserForCustomer(error, data) {
                    if (error) return console.log(error);
                    var usersData = JSON.parse(data);
                    console.log('usersData is: ' + JSON.stringify(usersData))
                    var userId = usersData.users[0].user_id
                    console.log('I got userId: ' + userId)
                    console.log('I got customer with email , number : ' + customer.email + ' , ' + customer.customer_number)
                    customerToPost = {
                        "user_id": userId,
                        "customer_number": customer.customer_number,
                        "legal_name": customer.legal_name,
                        "mobile_phone_number": customer.mobile_phone_number,
                        "email": customer.email,
                        "face_image": customer.face_image,
                        "date_of_birth": customer.date_of_birth,
                        "relationship_status": customer.relationship_status,
                        "dependants": customer.dependants,
                        "dob_of_dependants": customer.dob_of_dependants,
                        "highest_education_attained": customer.highest_education_attained,
                        "employment_status": customer.employment_status,
                        "kyc_status": customer.kyc_status,
                        "last_ok_date": customer.last_ok_date
                    }

                    console.log('customerToPost: ' + JSON.stringify(customerToPost))

                    var postCustomerUrl = apiHost + '/obp/v2.1.0/banks/' + customer.bank_id + '/customers';

                    console.log('postCustomerUrl: ' + postCustomerUrl)


                    consumer.post(postCustomerUrl,
                        req.session.oauthAccessToken,
                        req.session.oauthAccessTokenSecret,
                        JSON.stringify(customerToPost), // This is the body of the request
                        "application/json", // Must specify this else will get 404
                        function (error, data) {
                            if (error) return console.log(error);
                            var parsedData = JSON.parse(data);
                            console.log('response from postCustomerUrl: ' + JSON.stringify(parsedData))

                        }); // End post customer

                }); // End get user by email

    }); // End Customer loop


    var options = {
        "countCustomers": customers.length
    };
    var html = pug.renderFile(template, options);

    res.status(200).send(html)

});

// Create Entitlements for user (e.g. loop through banks)
app.get('/createEntitlements', function(req, res) {

    var template = "./template/simple.pug"

    // Location of sandbox file is stored in filesConfig.json like this:
    var dataConfig = require('./filesConfig.json')
    var sandbox = require(dataConfig.sandboxFile)
    var banks = sandbox.banks

    console.log('before loop. There are ' + banks.length + ' banks.')

    var miscConfig = require('./miscConfig.json')
    var userId = miscConfig.userId
    banks.forEach(function processCustomer(bank) {

            var postUrl = apiHost + '/obp/v2.1.0/users/' + userId + '/entitlements';
            console.log('url to call: ' + postUrl)

            //var postBody = {"bank_id":bank.id, "role_name":"CanCreateCustomer"}
            var postBody = {"bank_id":bank.id, "role_name":"CanCreateUserCustomerLink"}

            consumer.post(postUrl,
                req.session.oauthAccessToken,
                req.session.oauthAccessTokenSecret,
                JSON.stringify(postBody), // This is the body of the request
                "application/json", // Must specify this else will get 404
                function getUserForCustomer(error, data) {
                    if (error) return console.log(error);
                    var data = JSON.parse(data);
                    console.log('data is: ' + JSON.stringify(data))
                }); // End POST
    }); // End Loop

    var options = {
        "count": banks.length
    };
    var html = pug.renderFile(template, options);

    res.status(200).send(html)
});

app.get('/test', function(req,res) {
    var html =
    `
    <div>
        <p>The user can check the complete set of information about this token in Etherscan.</p>
    </div>
    `
    res.status(200).send(html);
});

app.get('*', function(req, res){
    req.session.pid = req.query.pid;
    res.redirect('/connect');
});

app.listen(8085);
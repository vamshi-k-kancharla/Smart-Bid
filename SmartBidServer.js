
let httpClientModule = require('http');
let httpUrlModule = require('url');

let mySqlConnectionModule = require('./MySqlConnection.js');
let customersRecordCRUDModule = require('./CustomersTableCRUD.js');
let assetRecordCRUDModule = require('./AssetsTableCRUD.js');
let bidRecordCRUDModule = require('./BidsTableCRUD.js');
let userAuthenticationModule = require('./UserAuthentication.js');
let retrieveAuctionsModule = require('./RetrieveAuctions.js');
let closeAuctionModule = require('./CloseAuction.js');


httpClientModule.createServer( (httpRequest, httpResponse) =>
{
    console.log("============================================");
    console.log("http Request received...");

    let queryParserPathName = httpUrlModule.parse(httpRequest.url, true).pathname;
    let mySqlConnection = mySqlConnectionModule.connectToMySqlDB();

    httpResponse.setHeader("Access-Control-Allow-Origin", "*");
    httpResponse.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if(queryParserPathName.indexOf("favicon.ico") != -1){
        
        console.log("favicon input request received...Sending back the response");
        httpResponse.writeHead( 200, 
            {"content-type" : "text/plain"} );
        httpResponse.end("");

        return;
    }

    if( httpRequest.method === 'POST' )
    {
        let httpRequestBody = '';

        httpRequest.on( 'data', (dataChunk) => { 
            httpRequestBody += dataChunk;
            console.log("Current Data chunk = " + dataChunk);
        });

        httpRequest.on( 'end', () => { 
            console.log("Total Data chunk = " + httpRequestBody);
            processSmartBidInputPOSTRequests(queryParserPathName, JSON.parse(httpRequestBody), mySqlConnection, httpResponse);
        });
    }

    else 
    {
        let queryParserQueryData = httpUrlModule.parse(httpRequest.url, true).query;

        processSmartBidInputGETRequests(queryParserPathName, queryParserQueryData, mySqlConnection, httpResponse);
    }

}).listen(8000);


function processSmartBidInputGETRequests(queryParserPathName, queryParserQueryData, mySqlConnection, httpResponse)
{

    console.log("pathName = " + queryParserPathName + "\n");

    switch(queryParserPathName)
    {

        case "/AddCustomer" :

            customersRecordCRUDModule.createCustomersDBRecord(mySqlConnection, queryParserQueryData, httpResponse);

            break;

        case "/AddAsset" :

            assetRecordCRUDModule.createAssetsDBRecord(mySqlConnection, queryParserQueryData, httpResponse);

            break;

        case "/AddBid" :

            bidRecordCRUDModule.createBidsDBRecord(mySqlConnection, queryParserQueryData, httpResponse);

            break;

        case "/RetrieveAuctions" :

            retrieveAuctionsModule.retrieveAuctions(mySqlConnection, queryParserQueryData, httpResponse);

            break;

        case "/CloseAuction" :

            closeAuctionModule.closeAuction(mySqlConnection, queryParserQueryData, httpResponse);

            break;

        default:

            httpResponse.writeHead( 404, {"content-type" : "text/plain"} );
            httpResponse.end();

            break;

    }

}

function processSmartBidInputPOSTRequests(queryParserPathName, authQueryInputJsonData, mySqlConnection, httpResponse)
{

    console.log("pathName = " + queryParserPathName + "\n");

    switch(queryParserPathName)
    {

        case "/AuthenticateUser" :

            userAuthenticationModule.authenticateUserCredentials(mySqlConnection, authQueryInputJsonData, httpResponse);

            break;

        default:

            httpResponse.writeHead( 404, {"content-type" : "text/plain"} );
            httpResponse.end();

            break;

    }

}


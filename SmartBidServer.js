
const httpClientModule = require('http');
const httpUrlModule = require('url');

const mySqlConnectionModule = require('./MySqlConnection.js');
const customersRecordCRUDModule = require('./CustomersTableCRUD.js');
const assetRecordCRUDModule = require('./AssetsTableCRUD.js');
const bidRecordCRUDModule = require('./BidsTableCRUD.js');
const userAuthenticationModule = require('./UserAuthentication.js');
const retrieveAuctionsModule = require('./RetrieveAuctions.js');
const closeAuctionModule = require('./CloseAuction.js');
const membershipRecordCRUDModule = require("./MembershipsTableCRUD.js");

const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");



httpClientModule.createServer( (httpRequest, httpResponse) =>
{
    LoggerUtilModule.logInformation("============================================");
    LoggerUtilModule.logInformation("http Request received...");

    let queryParserPathName = httpUrlModule.parse(httpRequest.url, true).pathname;
    let mySqlConnection = mySqlConnectionModule.connectToMySqlDB();

    httpResponse.setHeader("Access-Control-Allow-Origin", "*");
    httpResponse.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if(queryParserPathName.indexOf("favicon.ico") != -1){
        
        LoggerUtilModule.logInformation("favicon input request received...Sending back the response");
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
            LoggerUtilModule.logInformation("Current Data chunk = " + dataChunk);
        });

        httpRequest.on( 'end', () => { 
            LoggerUtilModule.logInformation("Total Data chunk = " + httpRequestBody);
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

    LoggerUtilModule.logInformation("pathName = " + queryParserPathName + "\n");

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

        case "/AddMembership" :

            membershipRecordCRUDModule.createMembershipsDBRecord(mySqlConnection, queryParserQueryData, httpResponse);

            break;

        default:

            httpResponse.writeHead( 404, {"content-type" : "text/plain"} );
            httpResponse.end("Input Client request not found");

            break;

    }

}

function processSmartBidInputPOSTRequests(queryParserPathName, authQueryInputJsonData, mySqlConnection, httpResponse)
{

    LoggerUtilModule.logInformation("pathName = " + queryParserPathName + "\n");

    switch(queryParserPathName)
    {

        case "/AuthenticateUser" :

            userAuthenticationModule.authenticateUserCredentials(mySqlConnection, authQueryInputJsonData, httpResponse);

            break;

        default:

            httpResponse.writeHead( 404, {"content-type" : "text/plain"} );
            httpResponse.end("Input Client request not found");

            break;

    }

}


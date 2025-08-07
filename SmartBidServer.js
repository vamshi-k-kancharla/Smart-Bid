
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
const processAssetsModule = require("./ProcessAssets.js");
const customerAuctionsAndBidsModule = require('./CustomerAuctionsAndBids.js');
const retrieveCustomerModule = require('./RetrieveCustomer.js');

const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


httpClientModule.createServer( async (httpRequest, httpResponse) =>
{
    try
    {

        LoggerUtilModule.logInformation("============================================");
        LoggerUtilModule.logInformation("http Request received...");

        let queryParserPathName = httpUrlModule.parse(httpRequest.url, true).pathname;

        // Connect to MySQL DB
        
        let mySqlConnection = await mySqlConnectionModule.connectToMySqlDB();

        if( mySqlConnection == null || mySqlConnection == undefined )
        {

            handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, "Unable to connect to MySQL DB...Bailing out");
            return;
        }

        // Enable CORS Policy

        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        // Return back for Favicon Request

        if(queryParserPathName.indexOf("favicon.ico") != -1){
            
            handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, "favicon input request received...Sending back the response");
            return;
        }

        // Process File Upload Requests

        if( queryParserPathName == "/UploadAuctionPhotos" )
        {
            await processAssetsModule.processAssetAdditions(mySqlConnection, httpRequest, httpResponse);

            return;
        }

        // Process POST Requests

        else if( httpRequest.method === 'POST' )
        {

            LoggerUtilModule.logInformation("Processing incoming POST Requests");

            let httpRequestBody = '';

            httpRequest.on( 'data', (dataChunk) => { 
                httpRequestBody += dataChunk;
                LoggerUtilModule.logInformation("Current Data chunk = " + dataChunk);
            });

            httpRequest.on( 'end', async () => { 

                try
                {
                    LoggerUtilModule.logInformation("Total Data chunk = " + httpRequestBody);

                        await processSmartBidInputPOSTRequests(queryParserPathName, JSON.parse(httpRequestBody), mySqlConnection, httpResponse);
                }
                catch(exception)
                {
                    console.error("Error while processing the post Request of Smart bid Server => " + exception.message);
                }
            });
        }

        // Process GET Requests

        else 
        {
            let queryParserQueryData = httpUrlModule.parse(httpRequest.url, true).query;

            await processSmartBidInputGETRequests(queryParserPathName, queryParserQueryData, mySqlConnection, httpResponse);
        }
    }
    catch(exception)
    {
        LoggerUtilModule.logInformation("Error while processing http input requests => " + exception.message);

        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error while processing http input requests => " + exception.message);

    }

}).listen(8000);


async function processSmartBidInputGETRequests(queryParserPathName, queryParserQueryData, mySqlConnection, httpResponse)
{

    try
    {

        LoggerUtilModule.logInformation("pathName = " + queryParserPathName + "\n");

        switch(queryParserPathName)
        {

            case "/AddCustomer" :

                await customersRecordCRUDModule.createCustomersDBRecord(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            case "/AddAsset" :

                await assetRecordCRUDModule.createAssetsDBRecord(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            case "/AddBid" :

                await bidRecordCRUDModule.createBidsDBRecord(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            case "/RetrieveAuctions" :

                await retrieveAuctionsModule.retrieveAuctions(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            case "/RetrieveCustomer" :

                await retrieveCustomerModule.retrieveCustomer(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            case "/DeleteCustomer" :

                await retrieveCustomerModule.deleteCustomerRecord(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            case "/CustomerAuctionsAndBids" :

                await customerAuctionsAndBidsModule.retrieveCustomerAuctionsAndBids(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            case "/CloseAuction" :

                await closeAuctionModule.closeAuction(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            case "/DeleteAsset" :

                await retrieveAuctionsModule.deleteAssetRecord(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            case "/AddMembership" :

                await membershipRecordCRUDModule.createMembershipsDBRecord(mySqlConnection, queryParserQueryData, httpResponse);

                break;

            default:

                handleHttpResponseModule.returnNotFoundHttpResponse(httpResponse, "Input Client request not found");

                break;
        }

    }
    catch(exception)
    {
        LoggerUtilModule.logInformation("Error while processing http GET input requests => " + exception.message);

        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error while processing http GET input requests => " + exception.message);
    }

}

async function processSmartBidInputPOSTRequests(queryParserPathName, inputJsonData, mySqlConnection, httpResponse)
{
    try
    {

        LoggerUtilModule.logInformation("pathName = " + queryParserPathName + "\n");

        switch(queryParserPathName)
        {

            case "/AuthenticateUser" :

                await userAuthenticationModule.authenticateUserCredentials(mySqlConnection, inputJsonData, httpResponse);

                break;

            case "/AddCustomer" :

                await customersRecordCRUDModule.createCustomersDBRecord(mySqlConnection, inputJsonData, httpResponse);

                break;

            default:

                handleHttpResponseModule.returnNotFoundHttpResponse(httpResponse, "Input Client request not found");

                break;

        }

    }
    catch(exception)
    {
        LoggerUtilModule.logInformation("Error while processing http POST input requests => " + exception.message);

        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error while processing http POST input requests => " + exception.message);
    }

}


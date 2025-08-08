
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const HandleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function retrieveBid(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveBidRequiredValues) )
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Retrieve Bids Record Input values");

            return;

        }

        // Process the Incoming Request
        
        var mySqlRetrieveBidsQuery = 'Select * from bids where AssetId = "' + inputQueryRecord.AssetId + '"';

        let mySqlRetrieveBidsResult = await mySqlConnection.execute( mySqlRetrieveBidsQuery );

        LoggerUtilModule.logInformation("Successfully retrieved the Bids from Bids table...No Of Records = " + 
            mySqlRetrieveBidsResult[0].length);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
        httpResponse.end(JSON.stringify(mySqlRetrieveBidsResult[0]));
    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while retrieving the Bids = " + exception.message);
    }
}


async function deleteBidRecords(mySqlConnection, inputQueryRecord, httpResponse)
{

    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveBidRequiredValues) )
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Delete Bids Record Input values");

            return;

        }

        // Process the Incoming Request
        
        var mySqlDeleteBidsQuery = 'delete from bids where AssetId = ' + inputQueryRecord.AssetId;

        let mySqlDeleteBidsResult = await mySqlConnection.execute( mySqlDeleteBidsQuery );

        LoggerUtilModule.logInformation("Successfully Deleted the Bids from Bids table...No Of affected Rows = " + 
            mySqlDeleteBidsResult[0].affectedRows);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
        httpResponse.end(JSON.stringify(mySqlDeleteBidsResult[0]));
    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while deleting the Bids = " + exception.message);
    }
}


module.exports = {retrieveBid, deleteBidRecords};


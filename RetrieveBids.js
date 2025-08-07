
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


async function deleteBidRecord(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            ( !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.closeBidRequiredValues) ))
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Bid Record Input values");

            return;

        }

        // Process the Incoming Request
        
        var mySqlDeleteBidQuery = 'Delete from Bids where BidId = "' + inputQueryRecord.BidId + '"';
        
        let mySqlDeleteBidResult = await mySqlConnection.execute( mySqlDeleteBidQuery );

        LoggerUtilModule.logInformation("Successfully deleted the Bid Record from Bids table...No Of affected Rows = " + 
            mySqlDeleteBidResult[0].affectedRows);

        if( mySqlDeleteBidResult[0].affectedRows == 1 )
        {

            HandleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully removed the Bid record from the DB ");
        }
        else
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Couldn't remove Bids Record from the required table");
        }

    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while removing the Bid Record = " + exception.message);
    }
    
}


module.exports = {retrieveBid, deleteBidRecord};


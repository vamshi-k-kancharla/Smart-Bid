
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const HandleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function retrieveAuctions(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveAuctionsRequiredValues) )
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Retrieve Auctions Record Input values");

            return;

        }

        // Process the Incoming Request
        
        var mySqlRetrieveAuctionsQuery = 'Select * from assets where Status = "' + inputQueryRecord.Status + '"';

        if( inputQueryRecord.SellerCustomerId != undefined )
        {
            mySqlRetrieveAuctionsQuery += ' and SellerCustomerId = ' + inputQueryRecord.SellerCustomerId;
        }

        let mySqlRetrieveAuctionsResult = await mySqlConnection.execute( mySqlRetrieveAuctionsQuery );

        LoggerUtilModule.logInformation("Successfully retrieved the auctions from assets table...No Of Records = " + 
            mySqlRetrieveAuctionsResult[0].length);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
        httpResponse.end(JSON.stringify(mySqlRetrieveAuctionsResult[0]));
    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while retrieving the auctions = " + exception.message);
    }
}

module.exports = {retrieveAuctions};


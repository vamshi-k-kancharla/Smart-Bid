
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const HandleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function deleteAssetRecord(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            ( !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.closeAuctionRequiredValues) ))
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Asset Record Input values");

            mySqlConnection.end();                

            return;

        }

        // Process the Incoming Request
        
        var mySqlDeleteAssetQuery = 'Delete from assets where AssetId = "' + inputQueryRecord.AssetId + '"';
        
        let mySqlDeleteAssetResult = await mySqlConnection.execute( mySqlDeleteAssetQuery );

        LoggerUtilModule.logInformation("Successfully deleted the Asset Record from Assets table...No Of affected Rows = " + 
            mySqlDeleteAssetResult[0].affectedRows);

        if( mySqlDeleteAssetResult[0].affectedRows == 1 )
        {

            HandleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully removed the Asset record from the DB ");

            mySqlConnection.end();                

        }
        else
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Couldn't remove Assets Record from the required table");
            mySqlConnection.end();                

        }

    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while removing the Asset Record = " + exception.message);

        mySqlConnection.end();                

    }
    
}


async function retrieveAuctions(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        LoggerUtilModule.logInformation("retrieveAuctions.inputQueryRecord = " + JSON.stringify(inputQueryRecord));

        // Validate the Incoming Request

        if( inputQueryRecord == null || inputQueryRecord == undefined || Object.keys(inputQueryRecord).length == 0 )
        {

            LoggerUtilModule.logInformation("retrieveAuctions.inputQueryRecord is empty");
        }

        else if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObjectKeysPresence(inputQueryRecord, 
                GlobalsForServerModule.assetRecordRequiredValues) )
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Retrieve Auctions Record Input values");

            mySqlConnection.end();                

            return;

        }

        // Process the Incoming Request

        var mySqlRetrieveAuctionsQuery = ( inputQueryRecord == null || inputQueryRecord == undefined  || 
            Object.keys(inputQueryRecord).length == 0 ) ? 'Select * from assets' :
            'Select * from assets where ';

        for( let currentInputKey of Object.keys(inputQueryRecord) )
        {
            
            mySqlRetrieveAuctionsQuery += currentInputKey + ' ="' + inputQueryRecord[currentInputKey] + '"';

            if( Object.keys(inputQueryRecord).indexOf(currentInputKey) != Object.keys(inputQueryRecord).length - 1 )
            {

                mySqlRetrieveAuctionsQuery += ' and '
            }
        }

        LoggerUtilModule.logInformation("retrieveAuctions.mySqlRetrieveAuctionsQuery = " + mySqlRetrieveAuctionsQuery);

        let mySqlRetrieveAuctionsResult = await mySqlConnection.execute( mySqlRetrieveAuctionsQuery );

        LoggerUtilModule.logInformation("Successfully retrieved the auctions from assets table...No Of Records = " + 
            mySqlRetrieveAuctionsResult[0].length);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
        httpResponse.end(JSON.stringify(mySqlRetrieveAuctionsResult[0]));

        mySqlConnection.end();

    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while retrieving the auctions = " + exception.message);

        mySqlConnection.end();                

    }
}


module.exports = {retrieveAuctions, deleteAssetRecord};


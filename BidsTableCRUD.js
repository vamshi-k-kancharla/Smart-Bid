
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function createBidsDBRecord(mySqlConnection, inputBidRecord, httpResponse)
{

    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputBidRecord) ||
            !InputValidatorModule.validateUserInputObject(inputBidRecord, GlobalsForServerModule.bidRecordRequiredValues) )
        {
            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Bid Record Input values");

            return;
        }

        await checkForExistenceAndAddBidRecord(mySqlConnection, inputBidRecord, httpResponse);

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding bid record to the Table = " + exception.message);
    }
}

async function checkForExistenceAndAddBidRecord(mySqlConnection, inputBidRecord, httpResponse)
{

    try
    {
        // Check for existence of Bid Record
        
        var mySqlCheckBidRecordExistence = 'select * from bids where ' +
            'AssetId = ' + inputBidRecord.AssetId + ' and ' +
            'CustomerId = ' + inputBidRecord.CustomerId + ' and ' +
            'BidPrice = "' + inputBidRecord.BidPrice + '"';

        LoggerUtilModule.logInformation("Bid DB Record Existence Query = " + mySqlCheckBidRecordExistence);

        let mySqlCheckBidRecordResult = await mySqlConnection.execute( mySqlCheckBidRecordExistence );

        LoggerUtilModule.logInformation("Successfully retrieved the Record from Bids table...No Of Records = " + 
            mySqlCheckBidRecordResult[0].length);

        if( mySqlCheckBidRecordResult[0].length == 0 )
        {
            await addBidsDBRecord(mySqlConnection, inputBidRecord, httpResponse);
        }
        else
        {
            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bid Record with the given values already exists");

        }
    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while checking for existence of bid record = " + exception.message);
    }
}


async function addBidsDBRecord(mySqlConnection, inputBidRecord, httpResponse)
{

    try
    {

        // Process the Incoming Request
        
        var bidRecordValues = '(' + inputBidRecord.AssetId + ',' +
        '' + inputBidRecord.CustomerId + ',' +
        '"' + inputBidRecord.BidPrice + '")';

        LoggerUtilModule.logInformation("bid DB Record Values = " + bidRecordValues);

        var mySqlBidDBRecordAdd = 'INSERT INTO bids ( AssetId, CustomerId, BidPrice ) Values ' + bidRecordValues;

        var mySqlAssetsRecordUpdate = 'Update assets set CurrentBidPrice = '+ inputBidRecord.BidPrice + 
            ', BidderCustomerId = ' + inputBidRecord.CustomerId + ' where Status = "open" and assetId = ' + inputBidRecord.AssetId +
            ' and CAST(MinAuctionPrice as SIGNED) < ' + inputBidRecord.BidPrice +
            ' and CAST(CurrentBidPrice as SIGNED) < ' + inputBidRecord.BidPrice;

        LoggerUtilModule.logInformation("Bid DB Record Query = " + mySqlBidDBRecordAdd);
        LoggerUtilModule.logInformation("Asset DB Record Update Query = " + mySqlAssetsRecordUpdate);

        // await mySqlConnection.beginTransaction();

        let mySqlBidDBRecordAddResult = await mySqlConnection.execute( mySqlBidDBRecordAdd );

        if( mySqlBidDBRecordAddResult[0].affectedRows == 0 )
        {

            LoggerUtilModule.logInformation("Error occured while adding bids table record ");

            throw new Error("Error occured while adding bids Table Record ");
        }

        LoggerUtilModule.logInformation("Successfully added the bid records to the Bids Table " + 
            mySqlBidDBRecordAddResult[0].affectedRows);

        LoggerUtilModule.logInformation("Now updating the assets table with input values ");

        let mySqlAssetDBUpdateRecordResult = await mySqlConnection.execute( mySqlAssetsRecordUpdate );

        if( mySqlAssetDBUpdateRecordResult[0].affectedRows == 0 && inputBidRecord.BiddingType == 'open' )
        {

            LoggerUtilModule.logInformation("Error occured while updating assets Table Record ");

            throw new Error("Error occured while updating assets Table Record ");
        }

        else if ( mySqlAssetDBUpdateRecordResult[0].affectedRows == 0 && inputBidRecord.BiddingType == 'secretive' )
        {

            LoggerUtilModule.logInformation("Assets record isn't updated with the latest bid as the secretive bid price is lesser than current highest bid price ");
        }

        else
        {

            LoggerUtilModule.logInformation("Successfully upated the asset record => " + mySqlAssetDBUpdateRecordResult[0].affectedRows);
        }

        // await mySqlConnection.commit();

        handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
            "Successfully placed the bid for current asset");
    }

    catch(exception)
    {
        // mySqlConnection.rollback().catch( innerException => {
        //    "Error occured while rolling back transaction for bids placement => " + innerException.message});

        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding bid record to the Table = " + exception.message);
    }
}

module.exports = {createBidsDBRecord};



const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const HandleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function createAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse)
{

    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputAssetRecord) ||
            !InputValidatorModule.validateUserInputObject(inputAssetRecord, GlobalsForServerModule.assetRecordRequiredValues) )
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse( httpResponse, 
                "Bad request from client...One or more missing Asset Record Input values" );

            return;
        }

        // Process the Incoming Request

        await checkForExistenceAndAddAssetRecord(mySqlConnection, inputAssetRecord, httpResponse);
    }

    catch(exception)
    {

        HandleHttpResponseModule.returnServerFailureHttpResponse( httpResponse, 
            "Error occured while adding asset record to the DB = " + exception.message );
    }
}


async function checkForExistenceAndAddAssetRecord(mySqlConnection, inputAssetRecord, httpResponse)
{

    try
    {
        // Check for existence of Asset Record
        
        var mySqlCheckAssetRecordExistence = 'select * from assets where ' +
            'AssetType = "' + inputAssetRecord.AssetType + '" and ' +
            'MinAuctionPrice = "' + inputAssetRecord.MinAuctionPrice + '" and ' +
            'Address = "' + inputAssetRecord.Address + '" and ' +
            'Colony = "' + inputAssetRecord.Colony + '" and ' +
            'City = "' + inputAssetRecord.City + '" and ' +
            'State = "' + inputAssetRecord.State + '" and ' +
            'Country = "' + inputAssetRecord.Country + '" and ' +
            'SellerCustomerId = ' + inputAssetRecord.SellerCustomerId + ' and ' +
            'ApprovalType = "' + inputAssetRecord.ApprovalType + '" and ' +
            'AssetSize = "' + inputAssetRecord.AssetSize + '" and ' +
            'BuiltUpArea = "' + inputAssetRecord.BuiltUpArea + '" and ' +
            'Status = "' + inputAssetRecord.Status + '"';

        LoggerUtilModule.logInformation("Asset DB Record Existence Query = " + mySqlCheckAssetRecordExistence);

        let assetRecordCheckResult = await mySqlConnection.execute( mySqlCheckAssetRecordExistence ); 

        LoggerUtilModule.logInformation("Successfully retrieved the Record from Assets table...No Of Records = " + 
            assetRecordCheckResult[0].length);

        if( assetRecordCheckResult[0].length == 0 )
        {
            await addAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse);
        }
        else
        {
            HandleHttpResponseModule.returnBadRequestHttpResponse( httpResponse, 
                "Asset Record with the given values already exists" );
        }

    }

    catch(exception)
    {

        HandleHttpResponseModule.returnServerFailureHttpResponse( httpResponse, 
            "Error occured while checking for existence of asset record = " + exception.message );
    }
}


async function addAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse)
{

    try
    {
        // Add the Asset DB Record
        
        var assetRecordValues = '("' + inputAssetRecord.AssetType + '",' +
        '"' + inputAssetRecord.MinAuctionPrice + '",' +
        '"' + inputAssetRecord.Address + '",' +
        '"' + inputAssetRecord.Colony + '",' +
        '"' + inputAssetRecord.City + '",' +
        '"' + inputAssetRecord.State + '",' +
        '"' + inputAssetRecord.Country + '",' +
        '' + inputAssetRecord.MinAuctionPrice + ',' +
        '' + inputAssetRecord.SellerCustomerId + ',' +
        '"' + inputAssetRecord.ApprovalType + '",' +
        '"' + inputAssetRecord.AssetSize + '",' +
        '"' + inputAssetRecord.BuiltUpArea + '",' +
        '"' + inputAssetRecord.Status + '")';

        LoggerUtilModule.logInformation("asset DB Record Values = " + assetRecordValues);

        var mySqlAssetDBRecordAdd = 'INSERT INTO assets ( AssetType, MinAuctionPrice, Address, Colony, City, State, Country,' +
        'CurrentBidPrice, SellerCustomerId, ApprovalType, AssetSize, BuiltUpArea, Status ) Values ' + assetRecordValues;

        LoggerUtilModule.logInformation("Asset DB Record Query = " + mySqlAssetDBRecordAdd);

        let mySqlAddAssetRecordResult = await mySqlConnection.execute( mySqlAssetDBRecordAdd ); 

        if( mySqlAddAssetRecordResult[0].affectedRows == 1 )
        {

            HandleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully added the asset record to the DB ");
        }
        else
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Couldn't add asset DB Record to the required table");
        }

    }

    catch(exception)
    {

        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding asset record to the DB = " + exception.message);
    }
}

module.exports = {createAssetsDBRecord};


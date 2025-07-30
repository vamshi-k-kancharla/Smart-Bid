
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");


async function createAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse)
{

    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputAssetRecord) ||
            !InputValidatorModule.validateUserInputObject(inputAssetRecord, GlobalsForServerModule.assetRecordRequiredValues) )
        {

            return [0, "Bad request from client...One or more missing Asset Record Input values"];
        }

        // Process the Incoming Request

        return await checkForExistenceAndAddAssetRecord(mySqlConnection, inputAssetRecord, httpResponse);
    }

    catch(exception)
    {

        return [0, "Error occured while adding asset record to the DB = " + exception.message];
    }
}

function retrieveQueryForAssetRecord(inputAssetRecord)
{

    let mySqlCheckAssetRecordExistence = 'select * from assets where ' +
            'AssetType = "' + inputAssetRecord.AssetType + '" and ' +
            'BiddingType = "' + inputAssetRecord.BiddingType + '" and ' +
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
            'AssetBedrooms = "' + inputAssetRecord.AssetBedrooms + '" and ' +
            'AssetBathrooms = "' + inputAssetRecord.AssetBathrooms + '" and ' +
            'Status = "' + inputAssetRecord.Status + '"';

    return mySqlCheckAssetRecordExistence;
}


async function checkForExistenceAndAddAssetRecord(mySqlConnection, inputAssetRecord, httpResponse)
{

    try
    {
        // Check for existence of Asset Record

        let mySqlCheckAssetRecordExistence = retrieveQueryForAssetRecord(inputAssetRecord);

        LoggerUtilModule.logInformation("Asset DB Record Existence Query = " + mySqlCheckAssetRecordExistence);

        let assetRecordCheckResult = await mySqlConnection.execute( mySqlCheckAssetRecordExistence ); 

        LoggerUtilModule.logInformation("Successfully retrieved the Record from Assets table...No Of Records = " + 
            assetRecordCheckResult[0].length);

        if( assetRecordCheckResult[0].length == 0 )
        {
            return await addAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse);
        }
        else
        {
            return [0, "Asset Record with the given values already exists"];
        }

    }

    catch(exception)
    {

        return [0, "Error occured while checking for existence of asset record = " + exception.message];
    }
}


async function addAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse)
{

    try
    {
        // Add the Asset DB Record
        
        var assetRecordValues = '("' + inputAssetRecord.AssetType + '",' +
        '"' + inputAssetRecord.BiddingType + '",' +
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
        '"' + inputAssetRecord.Status + '",' +
        '"' + inputAssetRecord.AssetBedrooms + '",' +
        '"' + inputAssetRecord.AssetBathrooms + '")';

        LoggerUtilModule.logInformation("asset DB Record Values = " + assetRecordValues);

        var mySqlAssetDBRecordAdd = 'INSERT INTO assets ( AssetType, BiddingType, MinAuctionPrice, Address, Colony, City, State, Country,' +
        'CurrentBidPrice, SellerCustomerId, ApprovalType, AssetSize, BuiltUpArea, Status, AssetBedrooms, AssetBathrooms ) Values ' + assetRecordValues;

        LoggerUtilModule.logInformation("Asset DB Record Query = " + mySqlAssetDBRecordAdd);

        let mySqlAddAssetRecordResult = await mySqlConnection.execute( mySqlAssetDBRecordAdd );

        return [ mySqlAddAssetRecordResult[0].affectedRows, "Added Asset Record to the DB Table" ];

    }

    catch(exception)
    {

        return [0, "Error occured while adding asset record to the DB = " + exception.message];
    }

}


async function returnIdOfCurrentAssetRecord(mySqlConnection, inputAssetRecord)
{

    try
    {
        // Retrieve Id of Current Asset Record

        let mySqlAssetRecord = retrieveQueryForAssetRecord(inputAssetRecord);

        LoggerUtilModule.logInformation("Asset DB Record Existence Query = " + mySqlAssetRecord);

        let assetRecordCheckResult = await mySqlConnection.execute( mySqlAssetRecord ); 

        LoggerUtilModule.logInformation("Successfully retrieved the Record from Assets table...No Of Records = " + 
            assetRecordCheckResult[0].length);

        if( assetRecordCheckResult[0].length == 1 )
        {
            return [assetRecordCheckResult[0][0].AssetId, "Success"];
        }
        else
        {
            return [0, "Asset Record with the given values doesn't exist"];
        }

    }

    catch(exception)
    {

        return [0, "Error occured while retrieving the asset record = " + exception.message];
    }
}


module.exports = {createAssetsDBRecord, returnIdOfCurrentAssetRecord};


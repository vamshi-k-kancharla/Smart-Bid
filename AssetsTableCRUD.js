
let GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
let InputValidatorModule = require("./HelperUtils/InputValidator.js");
let LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");


function createAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse)
{

    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputAssetRecord) ||
            !InputValidatorModule.validateUserInputObject(inputAssetRecord, GlobalsForServerModule.assetRecordRequiredValues) )
        {

            httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
            httpResponse.end("Bad request from client...One or more missing Asset Record Input values");

            return;
        }

        // Process the Incoming Request

        checkForExistenceAndAddAssetRecord(mySqlConnection, inputAssetRecord, httpResponse);
    }

    catch(exception)
    {
        console.error("Error occured while adding asset record to the DB = " + exception.message);

        httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
        httpResponse.end("Error occured while adding asset record to the DB = " + exception.message);
    }
}


function checkForExistenceAndAddAssetRecord(mySqlConnection, inputAssetRecord, httpResponse)
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

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlCheckAssetRecordExistence, (error, result) => {

                if(error)
                {
                    console.error("Error occured while Querying Assets Record Table => " + error.message);
                    throw error;
                }

                LoggerUtilModule.logInformation("Successfully retrieved the Record from Assets table...No Of Records = " + result.length);

                if( result.length == 0 )
                {
                    addAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse);
                }
                else
                {
                    httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
                    httpResponse.end("Asset Record with the given values already exists");

                    return;
                }

            });

        });

    }

    catch(exception)
    {
        console.error("Error occured while checking for existence of asset record = " + exception.message);

        httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
        httpResponse.end("Error occured while checking for existence of asset record = " + exception.message);
    }
}


function addAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse)
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

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlAssetDBRecordAdd, (error, result) => {

                if(error)
                {
                    console.error("Error occured while adding assets DB Record => " + error.message);
                }

                LoggerUtilModule.logInformation("Successfully added the records to the DB " + result.affectedRows);

                httpResponse.writeHead( 200, {"content-type" : "text/plain"} );
                httpResponse.end("Successfully added the asset records to the DB " + result.affectedRows);
            });

        });

    }

    catch(exception)
    {
        console.error("Error occured while adding asset record to the DB = " + exception.message);

        httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
        httpResponse.end("Error occured while adding asset record to the DB = " + exception.message);
    }
}

module.exports = {createAssetsDBRecord};


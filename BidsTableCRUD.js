const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


function createBidsDBRecord(mySqlConnection, inputBidRecord, httpResponse)
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

        checkForExistenceAndAddBidRecord(mySqlConnection, inputBidRecord, httpResponse);

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding bid record to the Table = " + exception.message);
    }
}

function checkForExistenceAndAddBidRecord(mySqlConnection, inputBidRecord, httpResponse)
{

    try
    {
        // Check for existence of Bid Record
        
        var mySqlCheckBidRecordExistence = 'select * from bids where ' +
            'AssetId = ' + inputBidRecord.AssetId + ' and ' +
            'CustomerId = ' + inputBidRecord.CustomerId + ' and ' +
            'BidPrice = "' + inputBidRecord.BidPrice + '"';

        LoggerUtilModule.logInformation("Bid DB Record Existence Query = " + mySqlCheckBidRecordExistence);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                    "Error occured while connecting to mySql Server => " + error.message);

                return;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlCheckBidRecordExistence, (error, result) => {

                if(error)
                {
                    handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                        "Error occured while Querying Bids Record Table => " + error.message);

                    return;
                }

                LoggerUtilModule.logInformation("Successfully retrieved the Record from Bids table...No Of Records = " + result.length);

                if( result.length == 0 )
                {
                    addBidsDBRecord(mySqlConnection, inputBidRecord, httpResponse);
                }
                else
                {
                    handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                        "Bid Record with the given values already exists");

                    return;
                }

            });

        });

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while checking for existence of bid record = " + exception.message);

        return;
    }
}


function addBidsDBRecord(mySqlConnection, inputBidRecord, httpResponse)
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
            ', BidderCustomerId = ' + inputBidRecord.CustomerId + ' where assetId = ' + inputBidRecord.AssetId;

        LoggerUtilModule.logInformation("Bid DB Record Query = " + mySqlBidDBRecordAdd);
        LoggerUtilModule.logInformation("Asset DB Record Update Query = " + mySqlAssetsRecordUpdate);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                    "Error occured while connecting to mySql server = " + error.message);

                return;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.beginTransaction( (error) => {

                if(error)
                {
                    handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                        "Error occured while starting transaction for Bids placement => " + error.message);

                    return;
                }

                console.error("DB Transaction has been successfully started");

                mySqlConnection.query( mySqlBidDBRecordAdd, (error, result) => {

                    if(error)
                    {
                        handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                            "Error occured while adding bids Table Record => " + error.message);

                        return;
                    }

                    LoggerUtilModule.logInformation("Successfully added the bid records to the Bids Table " + result.affectedRows);
                    LoggerUtilModule.logInformation("Now updating the assets table with input values ");

                    mySqlConnection.query( mySqlAssetsRecordUpdate, (error, result) => {

                        if(error)
                        {
                            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                                "Error occured while updating Assets table Record => " + error.message);

                            return;
                        }

                        LoggerUtilModule.logInformation("Successfully upated the asset record => " + result.affectedRows);

                        mySqlConnection.commit( (error) => {

                            if(error)
                            {
                                handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                                    "Error occured while commiting transaction for bids placement => " + error.message);

                                return;
                            }

                            handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                                "Successfully placed the bid for current asset");

                            return;
                        });
                    
                    });

                });

            });

        });

    }

    catch(exception)
    {
        console.error("Error occured while adding bid record to the Table = " + exception.message);
        
        mySqlConnection.rollback( (error) => {

            if(error)
            {
                console.error("Error occured while rolling back transaction for bids placement => " + error.message);
            }
        });

        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding bid record to the Table = " + exception.message);

        return;
    }
}

module.exports = {createBidsDBRecord};


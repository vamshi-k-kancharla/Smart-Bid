let GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
let InputValidatorModule = require("./HelperUtils/InputValidator.js");


function createBidsDBRecord(mySqlConnection, inputBidRecord, httpResponse)
{

    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputBidRecord) ||
            !InputValidatorModule.validateUserInputObject(inputBidRecord, GlobalsForServerModule.bidRecordRequiredValues) )
        {

            httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
            httpResponse.end("Bad request from client...One or more missing Bid Record Input values");

            return;
        }

        checkForExistenceAndAddBidRecord(mySqlConnection, inputBidRecord, httpResponse);

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

        httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
        httpResponse.end("Error occured while adding bid record to the Table = " + exception.message);
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

        console.log("Bid DB Record Existence Query = " + mySqlCheckBidRecordExistence);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            console.log("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlCheckBidRecordExistence, (error, result) => {

                if(error)
                {
                    console.error("Error occured while Querying Bids Record Table => " + error.message);
                    throw error;
                }

                console.log("Successfully retrieved the Record from Bids table...No Of Records = " + result.length);

                if( result.length == 0 )
                {
                    addBidsDBRecord(mySqlConnection, inputBidRecord, httpResponse);
                }
                else
                {
                    httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
                    httpResponse.end("Bid Record with the given values already exists");

                    return;
                }

            });

        });

    }

    catch(exception)
    {
        console.error("Error occured while checking for existence of bid record = " + exception.message);

        httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
        httpResponse.end("Error occured while checking for existence of bid record = " + exception.message);
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

        console.log("bid DB Record Values = " + bidRecordValues);

        var mySqlBidDBRecordAdd = 'INSERT INTO bids ( AssetId, CustomerId, BidPrice ) Values ' + bidRecordValues;

        var mySqlAssetsRecordUpdate = 'Update assets set CurrentBidPrice = '+ inputBidRecord.BidPrice + 
            ', BidderCustomerId = ' + inputBidRecord.CustomerId + ' where assetId = ' + inputBidRecord.AssetId;

        console.log("Bid DB Record Query = " + mySqlBidDBRecordAdd);
        console.log("Asset DB Record Update Query = " + mySqlAssetsRecordUpdate);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            console.log("Successfully connected to MySql Server");

            mySqlConnection.beginTransaction( (error) => {

                if(error)
                {
                    console.error("Error occured while starting transaction for Bids placement => " + error.message);
                    throw error;
                }

                console.error("DB Transaction has been successfully started");

                mySqlConnection.query( mySqlBidDBRecordAdd, (error, result) => {

                    if(error)
                    {
                        console.error("Error occured while adding bids Table Record => " + error.message);
                        throw error;
                    }

                    console.log("Successfully added the bid records to the Bids Table " + result.affectedRows);
                    console.log("Now updating the assets table with input values ");

                    mySqlConnection.query( mySqlAssetsRecordUpdate, (error, result) => {

                        if(error)
                        {
                            console.error("Error occured while updating Assets table Record => " + error.message);
                            throw error;
                        }

                        console.log("Successfully upated the asset record => " + result.affectedRows);

                        mySqlConnection.commit( (error) => {

                            if(error)
                            {
                                console.error("Error occured while commiting transaction for bids placement => " + error.message);
                                throw error;
                            }

                            httpResponse.writeHead( 200, {"content-type" : "text/plain"} );
                            httpResponse.end("Successfully placed the bid for current asset");
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

        httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
        httpResponse.end("Error occured while adding bid record to the Table = " + exception.message);
    }
}

module.exports = {createBidsDBRecord};


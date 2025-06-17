
let GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
let InputValidatorModule = require("./HelperUtils/InputValidator.js");
let LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");


function retrieveAuctions(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveAuctionsRequiredValues) )
        {

            httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
            httpResponse.end("Bad request from client...One or more missing Retrieve Auctions Record Input values");

            return;
        }

        // Process the Incoming Request
        
        var mySqlRetrieveAuctionsQuery = 'Select * from assets where Status = "' + inputQueryRecord.Status + '"';

        if( inputQueryRecord.SellerCustomerId != undefined )
        {
            mySqlRetrieveAuctionsQuery += ' and SellerCustomerId = ' + inputQueryRecord.SellerCustomerId;
        }

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlRetrieveAuctionsQuery, (error, result) => {

                if(error)
                {
                    console.error("Error occured while retrieving auctions from assets table => " + error.message);
                    throw Error;
                }

                LoggerUtilModule.logInformation("Successfully retrieved the auctions from assets table...No Of Records = " + result.length);

                httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
                httpResponse.end(JSON.stringify(result));

            });

        });

    }

    catch(exception)
    {
        console.error("Error occured while retrieving the auctions = " + exception.message);

        httpResponse.writeHead( 500, {'content-type' : 'text/plain'});
        httpResponse.end("No Auctions could be retrieved from auction DB");
    }
}

module.exports = {retrieveAuctions};


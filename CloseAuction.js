let GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
let InputValidatorModule = require("./HelperUtils/InputValidator.js");


function closeAuction(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.closeAuctionRequiredValues) )
        {

            httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
            httpResponse.end("Bad request from client...One or more missing Close Auction Record Input values");

            return;
        }

        // Process the Incoming Request
        
        var mySqlCloseAuctionQuery = 'Update assets set Status = "closed" where assetId = ' + inputQueryRecord.AssetId;

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            console.log("Successfully connected to MySql Server");

        });

        mySqlConnection.query( mySqlCloseAuctionQuery, (error, result) => {

            if(error)
            {
                console.error("Error occured while closing auction in assets table => " + error.message);
                throw Error;
            }

            if( result.affectedRows === 1 )
            {

                console.log("Successfully closed the auction through assets table ");

                httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
                httpResponse.end("Successfully closed the auction through assets table");
            }
            else
            {

                console.log("Bad Request...No Auction has gotten closed");

                httpResponse.writeHead( 400, {'content-type' : 'text/plain'});    
                httpResponse.end("Bad Request...No Auction has gotten closed");
            }

        });
    }

    catch(exception)
    {
        console.error("Error occured while closing the auction => " + exception.message);

        httpResponse.writeHead( 500, {'content-type' : 'text/plain'});
        httpResponse.end("Auction closure failed. Please retry");
    }
}

module.exports = {closeAuction};


let GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
let InputValidatorModule = require("./HelperUtils/InputValidator.js");
let LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


function closeAuction(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.closeAuctionRequiredValues) )
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Close Auction Record Input values");

            return;
        }

        // Process the Incoming Request
        
        var mySqlCloseAuctionQuery = 'Update assets set Status = "closed" where assetId = ' + inputQueryRecord.AssetId;

        mySqlConnection.connect( (error) => {

            if(error)
            {
                handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                    "Error occured while connecting to mySql server = " + error.message);

                return;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlCloseAuctionQuery, (error, result) => {

                if(error)
                {
                    handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                        "Bad Request : Error occured while adding membership record to the DB => " + error.message);

                    return;
                }

                if( result.affectedRows === 1 )
                {

                    handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                        "Successfully closed the auction through assets table ");

                    return;
                }
                else
                {

                    handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                        "Bad Request...No Auction has gotten closed ");
                }

            });

        });

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while closing the auction => " + exception.message);
    }
}

module.exports = {closeAuction};



const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const HandleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function retrieveCustomerAuctionsAndBids(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.customerAuctionsAndBidsRequiredValues) )
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Customer Auctions and Bids Record Input values");

            return;

        }

        // Process the Incoming Request for Customer Auctions
        
        var mySqlRetrieveAuctionsQuery = 'Select * from assets where SellerCustomerId = ' + inputQueryRecord.SellerCustomerId;

        let mySqlRetrieveAuctionsResult = await mySqlConnection.execute( mySqlRetrieveAuctionsQuery );

        LoggerUtilModule.logInformation("Successfully retrieved the auctions from assets table for current Customer...No Of Records = " + 
            mySqlRetrieveAuctionsResult[0].length);

        let myAuctionsAndBidsResult = {};

        if( mySqlRetrieveAuctionsResult[0].length == 0 )
        {
            myAuctionsAndBidsResult["CustomerAuctions"] = [];
        }
        else
        {
            myAuctionsAndBidsResult["CustomerAuctions"] = mySqlRetrieveAuctionsResult[0];
        }

        // Process the Incoming Request to retrieve Asset IDS for current customer bids
        
        var mySqlRetrieveAssetsQuery = 'select AssetId from bids where CustomerId = ' + inputQueryRecord.SellerCustomerId;

        let mySqlRetrieveAssetsResult = await mySqlConnection.execute( mySqlRetrieveAssetsQuery );

        LoggerUtilModule.logInformation("Successfully retrieved the Asset Ids from bids table for current Customer...No Of Records = " + 
            mySqlRetrieveAssetsResult[0].length);

        if( mySqlRetrieveAssetsResult[0].length == 0 )
        {
            myAuctionsAndBidsResult["CustomerBids"] = [];
        }
        else
        {

            // Process the Incoming Request for current bids
            
            var mySqlRetrieveBidsQuery = 'select * from assets where AssetId in ( ';

            for( let i = 0 ; i < mySqlRetrieveAssetsResult[0].length; i++ )
            {
                mySqlRetrieveBidsQuery += mySqlRetrieveAssetsResult[0][i].AssetId;

                if( i != mySqlRetrieveAssetsResult[0].length - 1 )
                {
                    
                    mySqlRetrieveBidsQuery += ' , ';
                }
            }

            mySqlRetrieveBidsQuery += ')';

            console.log( "retrieveCustomerAuctionsAndBids : mySqlRetrieveBidsQuery => " + mySqlRetrieveBidsQuery );

            let mySqlRetrieveBidsResult = await mySqlConnection.execute( mySqlRetrieveBidsQuery );

            LoggerUtilModule.logInformation("Successfully retrieved the bids from assets table for current Customer...No Of Records = " + 
                mySqlRetrieveBidsResult[0].length);

            myAuctionsAndBidsResult["CustomerBids"] = mySqlRetrieveBidsResult[0];
        }

        // Send back the success response

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});
        httpResponse.end(JSON.stringify(myAuctionsAndBidsResult));

    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while retrieving the customer auctions and bids = " + exception.message);
    }
}

module.exports = {retrieveCustomerAuctionsAndBids};


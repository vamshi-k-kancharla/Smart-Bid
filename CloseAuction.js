
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");

const EmailNotificationModule = require("./EmailNotification.js");


async function closeAuction(mySqlConnection, inputQueryRecord, httpResponse)
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

        let mySqlCloseAuctionQueryResult = await mySqlConnection.execute( mySqlCloseAuctionQuery );
        
        if( mySqlCloseAuctionQueryResult[0].affectedRows === 1 )
        {

            // Retrieve email addresses of Seller & Buyer

            let [emailAddress1, emailAddress2] = await retrieveSellerBuyerEmailAddresses(mySqlConnection, inputQueryRecord);

            if( emailAddress1 == "" && emailAddress2 == "" )
            {

                handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                    "Error occured retrieving the email addresses of the closed auction");

                return;
            }

            LoggerUtilModule.logInformation("email address1 = " + emailAddress1 + " ,email address2 = " + emailAddress2);

            let emailNotificationsSent = await EmailNotificationModule.sendEmailNotificationToStakeHolders(
                
                emailAddress1,
                emailAddress2,
                "Your Auction has gotten closed 3",
                "Auction of House @GodrejRoyalWoods has been closed at a price of 87.5 lakhs"

            );

            if( !emailNotificationsSent )
            {

                handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                    "Error occured while sending the notification to seller and buyer");

                return;
            }

            handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully closed the auction through assets table ");

        }
        else
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad Request...No Auction has gotten closed ");
        }

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while closing the auction => " + exception.message);
    }
}

async function retrieveSellerBuyerEmailAddresses(mySqlConnection, inputQueryRecord)
{
    try
    {

        // Retrieve Asset Record
        
        let mySqlRetrieveAssetQuery = 'select * from assets where assetId = ' + inputQueryRecord.AssetId;

        let mySqlRetrieveAssetQueryResult = await mySqlConnection.execute( mySqlRetrieveAssetQuery );
        
        if( mySqlRetrieveAssetQueryResult[0].length === 0 )
        {

            console.error("No Assets found with assetId = " + inputQueryRecord.AssetId);
            return ["", ""];
        }

        // Retrieve Seller/Buyer Customer Records
        
        let mySqlRetrieveCustomersQuery = 'select * from customers where customerId = ' + 
            mySqlRetrieveAssetQueryResult[0][0].BidderCustomerId + ' or customerId = ' +
            mySqlRetrieveAssetQueryResult[0][0].SellerCustomerId;

        let mySqlRetrieveCustomersQueryResult = await mySqlConnection.execute( mySqlRetrieveCustomersQuery );
        
        if( mySqlRetrieveCustomersQueryResult[0].length != 2 )
        {

            console.error("Required customers are not found for Customer Id's = " + 
                mySqlRetrieveAssetQueryResult[0][0].BidderCustomerId + " , " +
                mySqlRetrieveAssetQueryResult[0][0].SellerCustomerId);
            return ["", ""];
        }

        return [mySqlRetrieveCustomersQueryResult[0][0].EmailAddress, mySqlRetrieveCustomersQueryResult[0][1].EmailAddress];
    }

    catch(exception)
    {
        console.error( "Error occured while retrieving the email addresses of seller & buyer => " + exception.message);
        return ["", ""];
    }
}

module.exports = {closeAuction};


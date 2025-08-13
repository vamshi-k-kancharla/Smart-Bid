
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

            mySqlConnection.end();                

            return;
        }

        // Process the Incoming Request
        
        var mySqlCloseAuctionQuery = 'Update assets set Status = "closed" where assetId = ' + inputQueryRecord.AssetId;

        let mySqlCloseAuctionQueryResult = await mySqlConnection.execute( mySqlCloseAuctionQuery );
        
        if( mySqlCloseAuctionQueryResult[0].affectedRows === 1 )
        {

            // Retrieve email addresses of Seller & Buyer

            let notificationEmailObject = await retrieveSellerBuyerEmailAddressesAndContent(mySqlConnection, inputQueryRecord);

            if( notificationEmailObject == null || notificationEmailObject == undefined )
            {

                handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                    "Error occured retrieving the email addresses & subject / message of the closed auction");

                mySqlConnection.end();                

                return;
            }

            LoggerUtilModule.logInformation("email address1 = " + notificationEmailObject.BidderEmailAddress + " ,email address2 = " + 
                notificationEmailObject.SellerEmailAddress );

            let emailNotificationsSent = await EmailNotificationModule.sendEmailNotificationToStakeHolders(
                
                notificationEmailObject.BidderEmailAddress,
                notificationEmailObject.SellerEmailAddress,
                notificationEmailObject.Subject,
                notificationEmailObject.Message

            );

            if( !emailNotificationsSent )
            {

                handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                    "Error occured while sending the notification to seller and buyer");

                mySqlConnection.end();                

                return;
            }

            handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully closed the auction through assets table & notification sent");

            mySqlConnection.end();                

        }
        else
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad Request...No Auction has gotten closed ");

            mySqlConnection.end();                

        }

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while closing the auction => " + exception.message);

        mySqlConnection.end();                
    }
}

async function retrieveSellerBuyerEmailAddressesAndContent(mySqlConnection, inputQueryRecord)
{
    try
    {

        // Retrieve Asset Record
        
        let mySqlRetrieveAssetQuery = 'select * from assets where assetId = ' + inputQueryRecord.AssetId;

        let mySqlRetrieveAssetQueryResult = await mySqlConnection.execute( mySqlRetrieveAssetQuery );
        
        if( mySqlRetrieveAssetQueryResult[0].length === 0 )
        {

            console.error("No Assets found with assetId = " + inputQueryRecord.AssetId);
            return null;
        }

        // Formulate Email Content ( Subject & Message )

        let notificationEmailObject = {};

        notificationEmailObject["Subject"] = "Closure of Auction for the " + mySqlRetrieveAssetQueryResult[0][0].AssetType +
            " in " + mySqlRetrieveAssetQueryResult[0][0].Colony;

        notificationEmailObject["Message"] = "Auction for the " + mySqlRetrieveAssetQueryResult[0][0].AssetType +
            " in " + mySqlRetrieveAssetQueryResult[0][0].Colony + " , " + mySqlRetrieveAssetQueryResult[0][0].City + " has been closed. " +
            " Seller & Buyer have agreed for the price of ( highest bid ) Rs. " + mySqlRetrieveAssetQueryResult[0][0].CurrentBidPrice + 
            " . Please communicate further for deal closure and registration process. \n \n Regards,\n SmartBid Team.";

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

            return null;
        }

        notificationEmailObject["BidderEmailAddress"] = mySqlRetrieveCustomersQueryResult[0][0].EmailAddress;
        notificationEmailObject["SellerEmailAddress"] = mySqlRetrieveCustomersQueryResult[0][1].EmailAddress;

        return notificationEmailObject;
    }

    catch(exception)
    {
        console.error( "Error occured while retrieving the email addresses of seller & buyer and email message => " + exception.message);
        return null;
    }
}

module.exports = {closeAuction};


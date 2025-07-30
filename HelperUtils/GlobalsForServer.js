

const mySqlConnectionDBDetails = {
                host : "localhost",
                user : "root",
                password : "Abcde_12345",
                database: "smartauctiondb"
            };


// Globals

const hashGenerationSalt = 5;
const bDebugInformation = true; 

const imagesDirectory = ".\\AssetImages\\";
const videosDirectory = ".\\AssetVideos\\";

// Required values of Various Tables / client - server operations

const customerRecordRequiredValues = [ "Name", "EmailAddress", "Address", "UserType", "City", "State", "Country", "Password", "PhoneNumber"];

const assetRecordRequiredValues = [ "AssetType", "BiddingType", "MinAuctionPrice", "Address", "Colony", "City", "State", "Country", "SellerCustomerId", 
    "ApprovalType", "AssetSize", "BuiltUpArea", "Status"];

const bidRecordRequiredValues = [ "AssetId", "CustomerId", "BidPrice" ];

const retrieveAuctionsRequiredValues = [ "Status" ];

const closeAuctionRequiredValues = [ "AssetId" ];

const userAuthRecordRequiredValues = [ "EmailAddress", "PasswordCode" ];

const membershipRecordRequiredValues = [ "CustomerId", "MembershipType", "PaymentGateway", "PaymentType", "FeeAmount" ];

const customerAuctionsAndBidsRequiredValues = [ "SellerCustomerId" ];

const retrieveCustomerRequiredValues = [ "CustomerId" ];


// Notification Related Global Objects

const emailTransportObject = {  
    
    service : 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,

    auth: {

        user : 'smartbid.notification@gmail.com',
        pass : 'imjnuarwazkhfgtw'
    },

};

const emailNotificationSender = 'smartbid.notification@gmail.com';


// Module exports

module.exports = {mySqlConnectionDBDetails, hashGenerationSalt, bDebugInformation, 
    
    customerRecordRequiredValues, assetRecordRequiredValues,
    bidRecordRequiredValues, retrieveAuctionsRequiredValues, closeAuctionRequiredValues, userAuthRecordRequiredValues, 
    membershipRecordRequiredValues, 
    
    customerAuctionsAndBidsRequiredValues, retrieveCustomerRequiredValues,
    
    imagesDirectory, videosDirectory,

    emailNotificationSender, emailTransportObject,
};


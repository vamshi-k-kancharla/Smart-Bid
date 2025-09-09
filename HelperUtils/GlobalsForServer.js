

const mySqlConnectionDBDetails = {
                host : "localhost",
                user : "root",
                password : "Abcde_12345",
                database: "smartauctiondb"
            };


// Globals

const hashGenerationSalt = 5;
const bDebugInformation = false;

const imagesDirectory = ".\\AssetImages\\";
const videosDirectory = ".\\AssetVideos\\";

// Required values of Various Tables / client - server operations

const customerRecordRequiredValues = [ "Name", "EmailAddress", "Address", "UserType", "City", "State", "Country", "Password", "PhoneNumber"];

const assetRecordRequiredValues = [ "AssetType", "BiddingType", "MinAuctionPrice", "Address", "Colony", "City", "State", "Country", "SellerCustomerId", 
    "ApprovalType", "AssetSize", "BuiltUpArea", "Status"];

const bidRecordRequiredValues = [ "AssetId", "CustomerId", "BidPrice", "BiddingType" ];

const retrieveAuctionsRequiredValues = [ "Status" ];

const closeAuctionRequiredValues = [ "AssetId" ];

const userAuthRecordRequiredValues = [ "EmailAddress", "PasswordCode" ];

const membershipRecordRequiredValues = [ "CustomerId", "MembershipType", "PaymentGateway", "PaymentType", "FeeAmount" ];

const customerAuctionsAndBidsRequiredValues = [ "SellerCustomerId" ];

const retrieveCustomerRequiredValues = [ "CustomerId" ];

const retrieveCustomerRequiredValues2 = [ "EmailAddress" ];

const retrieveBidRequiredValues = [ "AssetId" ];

const retrieveFeedbackRequiredValues = [ "CustomerName" ];

const feedbackRecordRequiredValues = ["CustomerName", "EmailAddress", "Subject", "Message"];

const customerRecordForOTPRequiredValues = ["EmailAddress"];

const validateCustomerOTPRequiredValues = ["EmailAddress", "currentOTP"];


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

const emailNotificationSendOTPSubject = "OTP to reset the password";

const emailNotificationSendOTPMessage = "Please do find the required 6-digit OTP to reset the password => ";


// Module exports

module.exports = {mySqlConnectionDBDetails, hashGenerationSalt, bDebugInformation, 
    
    customerRecordRequiredValues, assetRecordRequiredValues,
    bidRecordRequiredValues, retrieveAuctionsRequiredValues, closeAuctionRequiredValues, userAuthRecordRequiredValues, 
    membershipRecordRequiredValues, 
    
    customerAuctionsAndBidsRequiredValues, retrieveCustomerRequiredValues, retrieveCustomerRequiredValues2,
    customerRecordForOTPRequiredValues, validateCustomerOTPRequiredValues,

    retrieveBidRequiredValues,
    
    imagesDirectory, videosDirectory,

    emailNotificationSender, emailTransportObject,
    emailNotificationSendOTPSubject, emailNotificationSendOTPMessage,

    feedbackRecordRequiredValues, retrieveFeedbackRequiredValues,
};


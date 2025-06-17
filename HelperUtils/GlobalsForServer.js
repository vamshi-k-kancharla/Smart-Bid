
// Globals

const hashGenerationSalt = 5;
const bDebugInformation = true; 


// Required values of Various Tables / client - server operations

const customerRecordRequiredValues = [ "Name", "EmailAddress", "Address", "UserType", "City", "State", "Country", "Password", "PhoneNumber"];

const assetRecordRequiredValues = [ "AssetType", "MinAuctionPrice", "Address", "Colony", "City", "State", "Country", "SellerCustomerId", 
    "ApprovalType", "AssetSize", "BuiltUpArea", "Status"];

const bidRecordRequiredValues = [ "AssetId", "CustomerId", "BidPrice" ];

const retrieveAuctionsRequiredValues = [ "Status" ];

const closeAuctionRequiredValues = [ "AssetId" ];

const userAuthRecordRequiredValues = [ "EmailAddress", "PasswordCode" ];

const membershipRecordRequiredValues = [ "CustomerId", "MembershipType", "PaymentGateway", "PaymentType", "FeeAmount" ];


// Module exports

module.exports = {hashGenerationSalt, bDebugInformation, customerRecordRequiredValues, assetRecordRequiredValues, bidRecordRequiredValues,
    retrieveAuctionsRequiredValues, closeAuctionRequiredValues, userAuthRecordRequiredValues, membershipRecordRequiredValues,
};


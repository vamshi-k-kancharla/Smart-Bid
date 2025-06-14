
let hashGenerationSalt = 5;

let customerRecordRequiredValues = [ "Name", "EmailAddress", "Address", "UserType", "City", "State", "Country", "Password", "PhoneNumber"];

let assetRecordRequiredValues = [ "AssetType", "MinAuctionPrice", "Address", "Colony", "City", "State", "Country", "SellerCustomerId", 
    "ApprovalType", "AssetSize", "BuiltUpArea", "Status"];

let bidRecordRequiredValues = [ "AssetId", "CustomerId", "BidPrice" ];

let retrieveAuctionsRequiredValues = [ "Status" ];

let closeAuctionRequiredValues = [ "AssetId" ];

let userAuthRecordRequiredValues = [ "EmailAddress", "PasswordCode" ];

module.exports = {hashGenerationSalt, customerRecordRequiredValues, assetRecordRequiredValues, bidRecordRequiredValues,
    retrieveAuctionsRequiredValues, closeAuctionRequiredValues, userAuthRecordRequiredValues, 
};


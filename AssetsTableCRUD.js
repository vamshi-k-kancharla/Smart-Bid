
function createAssetsDBRecord(mySqlConnection, inputAssetRecord, httpResponse)
{

    try
    {

        var assetRecordValues = '("' + inputAssetRecord.AssetType + '",' +
        '"' + inputAssetRecord.MinAuctionPrice + '",' +
        '"' + inputAssetRecord.Address + '",' +
        '"' + inputAssetRecord.Colony + '",' +
        '"' + inputAssetRecord.City + '",' +
        '"' + inputAssetRecord.State + '",' +
        '"' + inputAssetRecord.Country + '",' +
        '' + inputAssetRecord.SellerCustomerId + ',' +
        '"' + inputAssetRecord.ApprovalType + '",' +
        '"' + inputAssetRecord.AssetSize + '",' +
        '"' + inputAssetRecord.BuiltUpArea + '",' +
        '"' + inputAssetRecord.Status + '")';

        console.log("asset DB Record Values = " + assetRecordValues);

        var mySqlAssetDBRecordAdd = 'INSERT INTO assets ( AssetType, MinAuctionPrice, Address, Colony, City, State, Country,' +
        'SellerCustomerId, ApprovalType, AssetSize, BuiltUpArea, Status ) Values ' + assetRecordValues;

        console.log("Asset DB Record Query = " + mySqlAssetDBRecordAdd);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            console.log("Successfully connected to MySql Server");

        });

        mySqlConnection.query( mySqlAssetDBRecordAdd, (error, result) => {

            if(error)
            {
                console.error("Error occured while adding assets DB Record => " + error.message);
            }

            console.log("Successfully added the records to the DB " + result.affectedRows);

            httpResponse.end("Successfully added the asset records to the DB " + result.affectedRows);
        });
    }

    catch(exception)
    {
        console.error("Error occured while adding asset record to the DB = " + exception.message);
        httpResponse.end("Error occured while adding asset record to the DB = " + exception.message);
    }
}

module.exports = {createAssetsDBRecord};


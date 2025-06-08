
function closeAuction(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {
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

            console.log("Successfully closed the auction through assets table ");

            httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
            httpResponse.end("Successfully closed the auction through assets table");

        });
    }

    catch(exception)
    {
        console.error("Error occured while closing the auction => " + exception.message);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});
        httpResponse.end("Auction closure failed. Please retry");
    }
}

module.exports = {closeAuction};


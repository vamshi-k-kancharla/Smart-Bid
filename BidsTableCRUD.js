
function createBidsDBRecord(mySqlConnection, inputBidRecord, httpResponse)
{

    try
    {

        var bidRecordValues = '(' + inputBidRecord.AssetId + ',' +
        '' + inputBidRecord.CustomerId + ',' +
        '"' + inputBidRecord.BidPrice + '")';

        console.log("bid DB Record Values = " + bidRecordValues);

        var mySqlBidDBRecordAdd = 'INSERT INTO bids ( AssetId, CustomerId, BidPrice ) Values ' + bidRecordValues;

        console.log("Bid DB Record Query = " + mySqlBidDBRecordAdd);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            console.log("Successfully connected to MySql Server");

        });

        mySqlConnection.query( mySqlBidDBRecordAdd, (error, result) => {

            if(error)
            {
                console.error("Error occured while adding bids DB Record => " + error.message);
                throw error;
            }

            console.log("Successfully added the bid records to the DB " + result.affectedRows);

            httpResponse.end("Successfully added the bid records to the DB " + result.affectedRows);
        });
    }

    catch(exception)
    {
        console.error("Error occured while adding bid record to the DB = " + exception.message);
        httpResponse.end("Error occured while adding bid record to the DB = " + exception.message);
    }
}

module.exports = {createBidsDBRecord};


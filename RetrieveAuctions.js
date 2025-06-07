
function retrieveAuctions(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {
        var mySqlRetrieveAuctionsQuery = 'Select * from assets';

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            console.log("Successfully connected to MySql Server");

        });

        mySqlConnection.query( mySqlRetrieveAuctionsQuery, (error, result) => {

            if(error)
            {
                console.error("Error occured while retrieving auctions from assets table => " + error.message);
                throw Error;
            }

            console.log("Successfully retrieved the auctions from assets table...No Of Records = " + result.length);

            httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
            httpResponse.end(JSON.stringify(result));

        });
    }

    catch(exception)
    {
        console.error("Error occured while retrieving the auctions = " + exception.message);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});
        httpResponse.end("No Auctions could be retrieved from auction DB");
    }
}

module.exports = {retrieveAuctions};


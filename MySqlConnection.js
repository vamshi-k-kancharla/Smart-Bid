
let mySqlModule = require('mysql2');

function connectToMySqlDB()
{
    let mySqlConnection;

    try
    {
        mySqlConnection = mySqlModule.createConnection(
            {
                host : "localhost",
                user : "root",
                password : "Abcde_12345",
                database: "smartauctiondb"
            }

        );

        console.log("connecting to MySql Server");

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            console.log("Successfully connected to MySql Server");
        });

    }
    catch(exception)
    {
        console.log("Error while connecting to mySql DB => " + exception.message);
        throw exception;
    }

    return mySqlConnection;
}

module.exports = {connectToMySqlDB};


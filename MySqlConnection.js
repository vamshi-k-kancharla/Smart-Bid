
let mySqlModule = require('mysql2');
let LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");


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

        LoggerUtilModule.logInformation("connecting to MySql Server");

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");
        });

    }
    catch(exception)
    {
        LoggerUtilModule.logInformation("Error while connecting to mySql DB => " + exception.message);
        throw exception;
    }

    return mySqlConnection;
}

module.exports = {connectToMySqlDB};


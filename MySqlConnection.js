
const mySqlModule = require('mysql2/promise');

const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const GlobalsForServiceModule = require("./HelperUtils/GlobalsForServer.js");


async function connectToMySqlDB()
{
    let mySqlConnection;

    try
    {
        LoggerUtilModule.logInformation("connecting to MySql Server");

        mySqlConnection = await mySqlModule.createConnection(GlobalsForServiceModule.mySqlConnectionDBDetails);
        LoggerUtilModule.logInformation("Successfully connected to MySql Server");

    }
    catch(exception)
    {
        LoggerUtilModule.logInformation("Error while connecting to mySql DB => " + exception.message);
    }

    return mySqlConnection;
}

module.exports = {connectToMySqlDB};


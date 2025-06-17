let bCryptHashModule = require('bcryptjs');

let GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
let InputValidatorModule = require("./HelperUtils/InputValidator.js");
let LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");



function authenticateUserCredentials(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputCustomerRecord) ||
            !InputValidatorModule.validateUserInputObject(inputCustomerRecord, GlobalsForServerModule.userAuthRecordRequiredValues) )
        {

            httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
            httpResponse.end("Bad request from client...One or more missing User Authentication Record Input values");

            return;
        }

        // Process the Incoming Request
        
        let mySqlUserPasswordHashResult = 'Select Password from customers where EmailAddress = "' + inputCustomerRecord.EmailAddress + '"';
        let mySqlUserAuthReturnResults = 'Select CustomerId, Name, EmailAddress, PhoneNumber from customers where EmailAddress = "' + 
            inputCustomerRecord.EmailAddress + '"';

        LoggerUtilModule.logInformation("mySqlUserPasswordHashResult = " + mySqlUserPasswordHashResult);
        LoggerUtilModule.logInformation("mySqlUserAuthReturnResults = " + mySqlUserAuthReturnResults);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlUserPasswordHashResult, (error, result) => {

                if(error)
                {
                    console.error("Error occured while retrieving password Hash from customers Table => " + error.message);
                    throw Error;
                }

                LoggerUtilModule.logInformation("Successfully retrieved the password hash from Customer Table " + result[0].Password);

                let passwordCompare = bCryptHashModule.compareSync(atob(inputCustomerRecord.PasswordCode), result[0].Password);

                if (passwordCompare)
                {

                    mySqlConnection.query( mySqlUserAuthReturnResults, (error, result) => {

                        if(error)
                        {
                            console.error("Error occured while retrieving User Auth details from customers table => " + error.message);
                            throw Error;
                        }

                        LoggerUtilModule.logInformation("Successfully retrieved the User auth details from customers table...No Of Records = " + result.length);

                        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
                        httpResponse.end(JSON.stringify(result));
                    });

                }
                else
                {
                    console.error("passwords didn't match....bailing out with unauthorized error");

                    httpResponse.writeHead( 401, {'content-type' : 'text/plain'});
                    httpResponse.end("User Authentication failed ");
                }

            });

        });

    }

    catch(exception)
    {
        console.error("Error occured while Authenticating user = " + exception.message);

        httpResponse.writeHead( 401, {'content-type' : 'text/plain'});
        httpResponse.end("Error occured while Authenticating user = " + exception.message);
    }
}

module.exports = {authenticateUserCredentials};


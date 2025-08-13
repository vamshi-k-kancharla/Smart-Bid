const bCryptHashModule = require('bcryptjs');

const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const HandleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function authenticateUserCredentials(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputCustomerRecord) ||
            !InputValidatorModule.validateUserInputObject(inputCustomerRecord, GlobalsForServerModule.userAuthRecordRequiredValues) )
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing User Authentication Record Input values");

            mySqlConnection.end();                

            return;

        }

        // Process the Incoming Request
        
        let mySqlUserPasswordHashResult = 'Select Password from customers where EmailAddress = "' + inputCustomerRecord.EmailAddress + '"';
        let mySqlUserAuthReturnResults = 'Select CustomerId, Name, EmailAddress, PhoneNumber from customers where EmailAddress = "' + 
            inputCustomerRecord.EmailAddress + '"';

        LoggerUtilModule.logInformation("mySqlUserPasswordHashResult = " + mySqlUserPasswordHashResult);
        LoggerUtilModule.logInformation("mySqlUserAuthReturnResults = " + mySqlUserAuthReturnResults);

        let mySqlPasswordRetrieveResult = await mySqlConnection.execute( mySqlUserPasswordHashResult );

        LoggerUtilModule.logInformation("Successfully retrieved the password hash from Customer Table " + 
            mySqlPasswordRetrieveResult[0][0].Password);

        let passwordCompare = bCryptHashModule.compareSync(atob(inputCustomerRecord.PasswordCode), 
            mySqlPasswordRetrieveResult[0][0].Password);

        if (passwordCompare)
        {

            LoggerUtilModule.logInformation( "Returned password matched with that of entered password" );

            let myPasswordRetrieveQueryResults = await mySqlConnection.execute( mySqlUserAuthReturnResults );

            if( myPasswordRetrieveQueryResults[0].length == 1 )
            {

                LoggerUtilModule.logInformation("Successfully retrieved the User auth details from customers table...No Of Records = " + 
                    myPasswordRetrieveQueryResults[0].length);

                httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
                httpResponse.end(JSON.stringify(myPasswordRetrieveQueryResults[0]));

                mySqlConnection.end();                

            }
            else
            {

                HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                    "Couldn't retrieve auth details for the given email address");

                mySqlConnection.end();                

            }
        }

        else
        {

            HandleHttpResponseModule.returnUnauthorizedHttpResponse(httpResponse, 
                "passwords didn't match....bailing out with unauthorized error");
            mySqlConnection.end();                

        }

    }

    catch(exception)
    {

        HandleHttpResponseModule.returnUnauthorizedHttpResponse(httpResponse, 
            "Error occured while Authenticating user = " + exception.message);

        mySqlConnection.end();                

    }
}

module.exports = {authenticateUserCredentials};


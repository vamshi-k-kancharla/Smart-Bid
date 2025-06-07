let bCryptHashModule = require('bcryptjs');

function authenticateUserCredentials(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {
        var mySqlUserPasswordHashResult = 'Select Password from customers where EmailAddress = "' + inputCustomerRecord.EmailAddress + '"';

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            console.log("Successfully connected to MySql Server");

        });

        mySqlConnection.query( mySqlUserPasswordHashResult, (error, result) => {

            if(error)
            {
                console.error("Error occured while retrieving password Hash from customers Table => " + error.message);
                throw Error;
            }

            console.log("Successfully retrieved the password hash from Customer Table " + result[0].Password);

            let passwordCompare = bCryptHashModule.compareSync(atob(inputCustomerRecord.PasswordCode), result[0].Password);

            if (passwordCompare)
            {
                httpResponse.writeHead( 200, {'content-type' : 'text/plain'});
                httpResponse.end("User is successfully authenticated ");
            }
            else
            {
                httpResponse.writeHead( 401, {'content-type' : 'text/plain'});
                httpResponse.end("User Authentication failed ");
            }

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


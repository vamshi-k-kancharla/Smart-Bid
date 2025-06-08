let bCryptHashModule = require('bcryptjs');

function authenticateUserCredentials(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {
        let mySqlUserPasswordHashResult = 'Select Password from customers where EmailAddress = "' + inputCustomerRecord.EmailAddress + '"';
        let mySqlUserAuthReturnResults = 'Select CustomerId, Name, EmailAddress, PhoneNumber from customers where EmailAddress = "' + 
            inputCustomerRecord.EmailAddress + '"';

        console.log("mySqlUserPasswordHashResult = " + mySqlUserPasswordHashResult);
        console.log("mySqlUserAuthReturnResults = " + mySqlUserAuthReturnResults);

        if( inputCustomerRecord.EmailAddress == null || inputCustomerRecord.EmailAddress == undefined ||
            inputCustomerRecord.PasswordCode == null || inputCustomerRecord.PasswordCode == undefined ||
            inputCustomerRecord.EmailAddress == "" || inputCustomerRecord.PasswordCode == ""
        )
        {
            console.error("Error occured while Authenticating user, Empty credentials ");

            httpResponse.writeHead( 401, {'content-type' : 'text/plain'});
            httpResponse.end("Error occured while Authenticating user, Empty credentials ");

            return;
        }

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

                mySqlConnection.query( mySqlUserAuthReturnResults, (error, result) => {

                    if(error)
                    {
                        console.error("Error occured while retrieving User Auth details from customers table => " + error.message);
                        throw Error;
                    }

                    console.log("Successfully retrieved the User auth details from customers table...No Of Records = " + result.length);

                    httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
                    httpResponse.end(JSON.stringify(result));
                });

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


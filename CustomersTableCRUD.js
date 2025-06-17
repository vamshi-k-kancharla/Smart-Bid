let bCryptHashModule = require('bcryptjs');

let GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
let InputValidatorModule = require("./HelperUtils/InputValidator.js");
let LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");


function createCustomersDBRecord(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {
        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputCustomerRecord) ||
            !InputValidatorModule.validateUserInputObject(inputCustomerRecord, GlobalsForServerModule.customerRecordRequiredValues) )
        {

            httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
            httpResponse.end("Bad request from client...One or more missing User Record Input values");

            return;
        }

        // Validate the uniqueness of EmailAddress & Phone Number

        checkTheUniquenessOfCustomerRecord(mySqlConnection, inputCustomerRecord, httpResponse );
    }

    catch(exception)
    {
        console.error("Error occured while adding customer record to the DB = " + exception.message);

        httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
        httpResponse.end("Error occured while adding customer record to the DB = " + exception.message);
    }
}

function checkTheUniquenessOfCustomerRecord(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {
        // Process the Customer Record Request for uniqueness
        
        var mySqlCustomerDBRecordCheckUniqueness = 'select * from customers where EmailAddress = "' + inputCustomerRecord.EmailAddress + 
        '" or PhoneNumber = "' + inputCustomerRecord.PhoneNumber + '"';

        LoggerUtilModule.logInformation("Customer DB Record Uniqueness check Query = " + mySqlCustomerDBRecordCheckUniqueness);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlCustomerDBRecordCheckUniqueness, (error, result) => {

                if(error)
                {
                    console.error("Error occured while Querying customers Record Table => " + error.message);
                    throw error;
                }

                LoggerUtilModule.logInformation("Successfully retrieved the Customers Record from customers table...No Of Records = " + result.length);

                if( result.length == 0 )
                {
                    addCustomersDBRecord(mySqlConnection, inputCustomerRecord, httpResponse);
                }
                else
                {
                    httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
                    httpResponse.end("Customer Record with the given email address/phone number already exists");

                    return;
                }

            });

        });

    }

    catch(exception)
    {
        console.error("Error occured while Querying for customer record = " + exception.message);

        httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
        httpResponse.end("Error occured while checking the uniqueness of Customer Record");
    }
}

function addCustomersDBRecord(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {

        // Process the Incoming Request
            
        LoggerUtilModule.logInformation("Hash Generation salt = " + bCryptHashModule.genSaltSync(GlobalsForServerModule.hashGenerationSalt));

        var customerRecordValues = '("' + inputCustomerRecord.Name + '",' +
        '"' + inputCustomerRecord.EmailAddress + '",' +
        '"' + inputCustomerRecord.Address + '",' +
        '"' + inputCustomerRecord.UserType + '",' +
        '"' + inputCustomerRecord.City + '",' +
        '"' + inputCustomerRecord.State + '",' +
        '"' + inputCustomerRecord.Country + '",' +
        '"' + bCryptHashModule.hashSync(atob(inputCustomerRecord.Password), 
        bCryptHashModule.genSaltSync(GlobalsForServerModule.hashGenerationSalt)) + '",' +
        '' + inputCustomerRecord.PhoneNumber + ')';

        LoggerUtilModule.logInformation("customer DB Record Values = " + customerRecordValues);

        var mySqlCustomerDBRecordAdd = 'INSERT INTO customers (Name , EmailAddress , Address , UserType , City , State , Country , ' +
        'Password , PhoneNumber ) Values ' + customerRecordValues;

        LoggerUtilModule.logInformation("Customer DB Record Query = " + mySqlCustomerDBRecordAdd);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlCustomerDBRecordAdd, (error, result) => {

                if(error)
                {
                    console.error("Error occured while adding customers DB Record => " + error.message);
                }

                LoggerUtilModule.logInformation("Successfully added the customer records to the DB " + result.affectedRows);

                httpResponse.writeHead( 200, {"content-type" : "text/plain"} );
                httpResponse.end("Successfully added the customer records to the DB " + result.affectedRows);
            });

        });

    }

    catch(exception)
    {
        console.error("Error occured while adding customer record to the DB = " + exception.message);

        httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
        httpResponse.end("Error occured while adding customer record to the DB = " + exception.message);
    }
}


module.exports = {createCustomersDBRecord};


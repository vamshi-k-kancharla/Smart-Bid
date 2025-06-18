const bCryptHashModule = require('bcryptjs');

const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function createCustomersDBRecord(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {
        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputCustomerRecord) ||
            !InputValidatorModule.validateUserInputObject(inputCustomerRecord, GlobalsForServerModule.customerRecordRequiredValues) )
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing User Record Input values");

            return;
        }

        // Validate the uniqueness of EmailAddress & Phone Number

        await checkTheUniquenessOfCustomerRecord(mySqlConnection, inputCustomerRecord, httpResponse );
    }

    catch(exception)
    {

        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding customer record to the DB = " + exception.message);
    }
}

async function checkTheUniquenessOfCustomerRecord(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {
        // Process the Customer Record Request for uniqueness
        
        var mySqlCustomerDBRecordCheckUniqueness = 'select * from customers where EmailAddress = "' + inputCustomerRecord.EmailAddress + 
        '" or PhoneNumber = "' + inputCustomerRecord.PhoneNumber + '"';

        LoggerUtilModule.logInformation("Customer DB Record Uniqueness check Query = " + mySqlCustomerDBRecordCheckUniqueness);

        let customersUniqueCheckResult = await mySqlConnection.execute( mySqlCustomerDBRecordCheckUniqueness );

        LoggerUtilModule.logInformation("Successfully retrieved the Customers Record from customers table...No Of Records = " + 
            customersUniqueCheckResult[0].length);

        if( customersUniqueCheckResult[0].length == 0 )
        {
            await addCustomersDBRecord(mySqlConnection, inputCustomerRecord, httpResponse);
        }
        else
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Customer Record with the given email address/phone number already exists");
        }

    }

    catch(exception)
    {

        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while Querying for customer record = " + exception.message);
    }
}

async function addCustomersDBRecord(mySqlConnection, inputCustomerRecord, httpResponse)
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

        let mySqlCustomersAddRecord = await mySqlConnection.execute( mySqlCustomerDBRecordAdd );

        if( mySqlCustomersAddRecord[0].affectedRows == 1 )
        {

            handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully added the customer records to the DB ");
        }
        else
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Couldn't add Customers DB Record to the required table");
        }

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding customer record to the DB = " + exception.message);
    }
}


module.exports = {createCustomersDBRecord};


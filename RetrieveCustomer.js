
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const HandleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");

const bCryptHashModule = require('bcryptjs');


async function retrieveCustomer(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            ( !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveCustomerRequiredValues) && 
              !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveCustomerRequiredValues2) ))
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Retrieve Customers Record Input values");

            mySqlConnection.end();                

            return;

        }

        // Process the Incoming Request
        
        var mySqlRetrieveCustomersQuery = (inputQueryRecord.CustomerId != null && inputQueryRecord.CustomerId != undefined) ?
        ('Select * from customers where CustomerId = "' + inputQueryRecord.CustomerId + '"') :
        ('Select * from customers where EmailAddress = "' + inputQueryRecord.EmailAddress + '"');

        let mySqlRetrieveCustomersResult = await mySqlConnection.execute( mySqlRetrieveCustomersQuery );

        LoggerUtilModule.logInformation("Successfully retrieved the Customers from Customers table...No Of Records = " + 
            mySqlRetrieveCustomersResult[0].length);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
        httpResponse.end(JSON.stringify(mySqlRetrieveCustomersResult[0]));

        mySqlConnection.end();                

    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while retrieving the Customer Record = " + exception.message);

        mySqlConnection.end();                

    }
}

async function deleteCustomerRecord(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            ( !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveCustomerRequiredValues) && 
              !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveCustomerRequiredValues2) ))
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Customer Record Input values");

            mySqlConnection.end();                

            return;

        }

        // Process the Incoming Request
        
        var mySqlDeleteCustomerQuery = (inputQueryRecord.CustomerId != null && inputQueryRecord.CustomerId != undefined) ?
        ('Delete from customers where CustomerId = "' + inputQueryRecord.CustomerId + '"') :
        ('Delete from customers where EmailAddress = "' + inputQueryRecord.EmailAddress + '"');

        let mySqlDeleteCustomerResult = await mySqlConnection.execute( mySqlDeleteCustomerQuery );

        LoggerUtilModule.logInformation("Successfully deleted the Customer Record from Customers table...No Of affected Rows = " + 
            mySqlDeleteCustomerResult[0].affectedRows);

        if( mySqlDeleteCustomerResult[0].affectedRows == 1 )
        {

            HandleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully removed the customer record from the DB ");
            mySqlConnection.end();                

        }
        else
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Couldn't remove Customers DB Record from the required table");
            mySqlConnection.end();                

        }

    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while removing the Customer Record = " + exception.message);

        mySqlConnection.end();                

    }
    
}

// Update Customer Record 

async function updateCustomersDBRecord(mySqlConnection, inputCustomerRecord, httpResponse, inputRecordKeys)
{
    try
    {

        // Process the Incoming Request
            
        var customerRecordUpdateValues = "";

        for( let i = 0 ; i < inputRecordKeys.length; i++ )
        {

            if(inputRecordKeys[i] == "Password")
            {

                customerRecordUpdateValues += inputRecordKeys[i] + " = '" + 
                    bCryptHashModule.hashSync(atob(inputCustomerRecord.Password), 
                        bCryptHashModule.genSaltSync(GlobalsForServerModule.hashGenerationSalt)) + "'";

            }

            else
            {
    
                customerRecordUpdateValues += inputRecordKeys[i] + " = " + inputCustomerRecord[inputRecordKeys[i]];

            }

            if( i != inputRecordKeys.length - 1 )
            {
                customerRecordUpdateValues += " , ";
            }
        }

        LoggerUtilModule.logInformation("customer DB Update Record Values = " + customerRecordUpdateValues);

        var mySqlCustomerDBRecordUpdate = "Update customers set " + customerRecordUpdateValues + " where EmailAddress = '" +
                                        inputCustomerRecord.EmailAddress + "'";

        LoggerUtilModule.logInformation("Customer DB Update Record Query = " + mySqlCustomerDBRecordUpdate);

        let mySqlCustomersUpdateRecord = await mySqlConnection.execute( mySqlCustomerDBRecordUpdate );

        if( mySqlCustomersUpdateRecord[0].affectedRows == 1 )
        {

            HandleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully updated the customer record to the DB ");

            mySqlConnection.end();                

        }
        else
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Couldn't Update Customers DB Record to the required table");

            mySqlConnection.end();                

        }

    }

    catch(exception)
    {
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while updating customer record to the DB = " + exception.message);

        mySqlConnection.end();                

    }
}

// Validate Current OTP of customer

async function validateCustomerOTPForPasswordReset(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.validateCustomerOTPRequiredValues) )
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Customers Record Input values for OTP Validation");

            mySqlConnection.end();                

            return;

        }

        // Process the Incoming Request
        
        var mySqlRetrieveCustomersQuery = 'Select * from customers where EmailAddress = "' + inputQueryRecord.EmailAddress + '"';

        let mySqlRetrieveCustomersResult = await mySqlConnection.execute( mySqlRetrieveCustomersQuery );

        LoggerUtilModule.logInformation("Successfully retrieved the Customer Record from Customers table...No Of Records = " + 
            mySqlRetrieveCustomersResult[0].length);

        if( mySqlRetrieveCustomersResult[0].length == 1 && mySqlRetrieveCustomersResult[0][0].currentOTP == inputQueryRecord.currentOTP )
        {

            LoggerUtilModule.logInformation( "Current OTP of the customer record successfully matched with the existing OTP = " + 
                inputQueryRecord.currentOTP );

            HandleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully validated the current OTP of the customer");

            mySqlConnection.end();                

        }
        else
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Couldn't validate the current OTP of the customer..please retry");

            mySqlConnection.end();                

        }
    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while retrieving the Customer Record for OTP validation = " + exception.message);

        mySqlConnection.end();                

    }

}


module.exports = {retrieveCustomer, deleteCustomerRecord, updateCustomersDBRecord, validateCustomerOTPForPasswordReset};


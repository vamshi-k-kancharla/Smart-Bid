
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const HandleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


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

module.exports = {retrieveCustomer, deleteCustomerRecord};


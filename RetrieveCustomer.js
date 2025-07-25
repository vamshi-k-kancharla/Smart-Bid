
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
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveCustomerRequiredValues) )
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Retrieve Customers Record Input values");

            return;

        }

        // Process the Incoming Request
        
        var mySqlRetrieveCustomersQuery = 'Select * from customers where customerId = "' + inputQueryRecord.CustomerId + '"';

        let mySqlRetrieveCustomersResult = await mySqlConnection.execute( mySqlRetrieveCustomersQuery );

        LoggerUtilModule.logInformation("Successfully retrieved the Customers from Customers table...No Of Records = " + 
            mySqlRetrieveCustomersResult[0].length);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
        httpResponse.end(JSON.stringify(mySqlRetrieveCustomersResult[0]));
    }

    catch(exception)
    {
        
        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while retrieving the Customer Record = " + exception.message);
    }
}

module.exports = {retrieveCustomer};


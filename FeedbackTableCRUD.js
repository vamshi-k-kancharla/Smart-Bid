
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function createFeedbackDBRecord(mySqlConnection, inputFeedbackRecord, httpResponse)
{
    try
    {
        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputFeedbackRecord) ||
            !InputValidatorModule.validateUserInputObject(inputFeedbackRecord, GlobalsForServerModule.feedbackRecordRequiredValues) )
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Feedback Record Input values");

            mySqlConnection.end();                

            return;
        }

        // Add the Feedback record to the table

        await addFeedbackDBRecord(mySqlConnection, inputFeedbackRecord, httpResponse );
    }

    catch(exception)
    {

        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding feedback record to the DB = " + exception.message);

        mySqlConnection.end();                

    }
}

async function addFeedbackDBRecord(mySqlConnection, inputFeedbackRecord, httpResponse)
{
    try
    {

        // Process the Incoming Request
            
        var feedbackRecordValues = '("' + inputFeedbackRecord.CustomerName + '",' +
        '"' + inputFeedbackRecord.EmailAddress + '",' +
        '"' + inputFeedbackRecord.Subject + '",' +
        '"' + inputFeedbackRecord.Message + '")';

        LoggerUtilModule.logInformation("feedback DB Record Values = " + feedbackRecordValues);

        var mySqlFeedbackDBRecordAdd = 'INSERT INTO feedback (CustomerName, EmailAddress, Subject, Message) Values ' + 
            feedbackRecordValues;

        LoggerUtilModule.logInformation("Feedback DB Record Query = " + mySqlFeedbackDBRecordAdd);

        let mySqlFeedbackAddRecord = await mySqlConnection.execute( mySqlFeedbackDBRecordAdd );

        if( mySqlFeedbackAddRecord[0].affectedRows == 1 )
        {

            handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully added the feedback record to the DB ");

            mySqlConnection.end();                

        }
        else
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Couldn't add Feedback DB Record to the required table");

            mySqlConnection.end();                

        }

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding feedback record to the DB = " + exception.message);

        mySqlConnection.end();                

    }
}


async function retrieveFeedbackRecord(mySqlConnection, inputQueryRecord, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveFeedbackRequiredValues) )
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Retrieve Feedback Record Input values");

            mySqlConnection.end();                

            return;

        }

        // Process the Incoming Request
        
        var mySqlRetrieveFeedbackQuery = 'Select * from feedback where CustomerName = "' + inputQueryRecord.CustomerName + '"';

        let mySqlRetrieveFeedbackResult = await mySqlConnection.execute( mySqlRetrieveFeedbackQuery );

        LoggerUtilModule.logInformation("Successfully retrieved the Feedback record from feedback table...No Of Records = " + 
            mySqlRetrieveFeedbackResult[0].length);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
        httpResponse.end(JSON.stringify(mySqlRetrieveFeedbackResult[0]));

        mySqlConnection.end();                

    }

    catch(exception)
    {
        
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while retrieving the feedback = " + exception.message);

        mySqlConnection.end();                

    }
}


async function deleteFeedbackRecord(mySqlConnection, inputQueryRecord, httpResponse)
{

    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputQueryRecord) ||
            !InputValidatorModule.validateUserInputObject(inputQueryRecord, GlobalsForServerModule.retrieveFeedbackRequiredValues) )
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Delete Feedback Record Input values");

            mySqlConnection.end();                

            return;

        }

        // Process the Incoming Request
        
        var mySqlDeleteFeedbackQuery = 'delete from feedback where CustomerName = "' + inputQueryRecord.CustomerName + '"';

        let mySqlDeleteFeedbackResult = await mySqlConnection.execute( mySqlDeleteFeedbackQuery );

        LoggerUtilModule.logInformation("Successfully Deleted the Feedback Record from feedback table...No Of affected Rows = " + 
            mySqlDeleteFeedbackResult[0].affectedRows);

        httpResponse.writeHead( 200, {'content-type' : 'text/plain'});    
        httpResponse.end(JSON.stringify(mySqlDeleteFeedbackResult[0]));

        mySqlConnection.end();                

    }

    catch(exception)
    {
        
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while deleting the Feedback Records = " + exception.message);

        mySqlConnection.end();                

    }
}

module.exports = {createFeedbackDBRecord, retrieveFeedbackRecord, deleteFeedbackRecord};


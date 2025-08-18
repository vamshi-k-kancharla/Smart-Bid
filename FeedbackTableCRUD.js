
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


module.exports = {createFeedbackDBRecord};



const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


async function createMembershipsDBRecord(mySqlConnection, inputMembershipRecord, httpResponse)
{

    try
    {

        // Validate the Incoming Request

        if( !InputValidatorModule.validateUserInputObjectValue(inputMembershipRecord) ||
            !InputValidatorModule.validateUserInputObject(inputMembershipRecord, GlobalsForServerModule.membershipRecordRequiredValues) )
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad request from client...One or more missing Membership Record Input values");

            return;
        }

        // Process the Incoming Request

        await addMembershipsDBRecord(mySqlConnection, inputMembershipRecord, httpResponse);
    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding membership record to the DB = " + exception.message);
    }
}


async function addMembershipsDBRecord(mySqlConnection, inputMembershipRecord, httpResponse)
{

    try
    {
        // Add the Membership DB Record
        
        var membershipRecordValues = '(' + inputMembershipRecord.CustomerId + ',' +
        '"' + inputMembershipRecord.MembershipType + '",' +
        '"' + inputMembershipRecord.PaymentGateway + '",' +
        '"' + inputMembershipRecord.PaymentType + '",' +
        '"' + inputMembershipRecord.FeeAmount + '")';

        LoggerUtilModule.logInformation("membership DB Record Values = " + membershipRecordValues);

        var mySqlMembershipDBRecordAdd = 'INSERT INTO memberships ( CustomerId, MembershipType, PaymentGateway, PaymentType, FeeAmount ) ' +
        ' Values ' + membershipRecordValues;

        LoggerUtilModule.logInformation("Membership DB Record Query = " + mySqlMembershipDBRecordAdd);

        let mySqlMembershipDBRecordAddResult = await mySqlConnection.execute( mySqlMembershipDBRecordAdd );

        if( mySqlMembershipDBRecordAddResult[0].affectedRows === 1 )
        {

            handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully added membership table record");
        }
        else
        {

            handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad Request...wrong membership input add request ");
        }

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding membership record to the DB...Caught exception => " + exception.message);
    }
}

module.exports = {createMembershipsDBRecord};


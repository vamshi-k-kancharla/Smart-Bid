
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");


function createMembershipsDBRecord(mySqlConnection, inputMembershipRecord, httpResponse)
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

        addMembershipsDBRecord(mySqlConnection, inputMembershipRecord, httpResponse);
    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding membership record to the DB = " + exception.message);
    }
}


function addMembershipsDBRecord(mySqlConnection, inputMembershipRecord, httpResponse)
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

        mySqlConnection.connect( (error) => {

            if(error)
            {
                handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                    "Error occured while connecting to mySql server = " + error.message);

                return;
            }

            LoggerUtilModule.logInformation("Successfully connected to MySql Server");

            mySqlConnection.query( mySqlMembershipDBRecordAdd, (error, result) => {

                if(error)
                {
                    handleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                        "Bad Request : Error occured while adding membership record to the DB => " + error.message);

                    return;
                }

                handleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                    "Successfully added the membership records to the DB " + result.affectedRows);

                return;
            });

        });

    }

    catch(exception)
    {
        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding membership record to the DB...Caught exception => " + exception.message);

        return;
    }
}

module.exports = {createMembershipsDBRecord};


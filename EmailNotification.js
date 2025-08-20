
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const NodeMailerModule = require("nodemailer");
const CustomersTableCRUDModule = require("./CustomersTableCRUD.js");
const handleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");
const retrieveCustomerModule = require("./RetrieveCustomer.js");


async function sendEmailNotificationToStakeHolders(sellerEmailAddress, buyerEmailAddress, emailSubject, emailTextValue)
{
    try
    {
        let emailTransporter = NodeMailerModule.createTransport(GlobalsForServerModule.emailTransportObject);

        let receiversEmailAddress = sellerEmailAddress + ',' + buyerEmailAddress;
        console.log("Receivers Email Address = " + receiversEmailAddress);

        let notificationEmailObject = {

            from: GlobalsForServerModule.emailNotificationSender,
            to: receiversEmailAddress,
            subject: emailSubject,
            text: emailTextValue
        }

        let messageSendInfo = await emailTransporter.sendMail(notificationEmailObject);

        console.log(" accepted = " + messageSendInfo.accepted.length + 
            ", rejected = " + messageSendInfo.rejected.length
        );

        if( messageSendInfo.accepted.length != 2 || messageSendInfo.rejected.length != 0 )
        {
            console.error("Sending notification through nodemailer failed => Rejected Email address = " + 
                messageSendInfo.rejected[0]);
            
            return false;
        }

        console.log("Email notification has been sent to stake holders => " + messageSendInfo.response);
        return true;
    }

    catch(exception)
    {
        console.error("Exception occured while Sending notification through nodemailer => " + exception.message);
        return false;
    }

}

async function sendOTPNotificationToInputCustomer(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {
        let emailTransporter = NodeMailerModule.createTransport(GlobalsForServerModule.emailTransportObject);

        let receiversEmailAddress = inputCustomerRecord.EmailAddress;
        console.log("Receivers Email Address = " + receiversEmailAddress);

        let currentRandomOTP = generateRandomOTP(6);

        let notificationEmailObject = {

            from: GlobalsForServerModule.emailNotificationSender,
            to: receiversEmailAddress,
            subject: GlobalsForServerModule.emailNotificationSendOTPSubject,
            text: GlobalsForServerModule.emailNotificationSendOTPMessage + currentRandomOTP
        }

        let messageSendInfo = await emailTransporter.sendMail(notificationEmailObject);

        console.log(" accepted = " + messageSendInfo.accepted.length + 
            ", rejected = " + messageSendInfo.rejected.length
        );

        if( messageSendInfo.accepted.length != 1 || messageSendInfo.rejected.length != 0 )
        {
            console.error("Sending OTP Notification through nodemailer failed => Rejected Email address = " + 
                messageSendInfo.rejected[0]);
            
            handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                "Sending OTP Notification through nodemailer failed => Rejected Email address = " + 
                messageSendInfo.rejected[0]);

            mySqlConnection.end();
            
            return;

        }

        console.log("OTP Email notification has been sent to stake holders => " + messageSendInfo.response);

        // Add Current OTP Field to Customer's table

        let customerDetailsObject = {};
        
        customerDetailsObject["EmailAddress"] = inputCustomerRecord.EmailAddress;
        customerDetailsObject["currentOTP"] = currentRandomOTP;

        await retrieveCustomerModule.updateCustomersDBRecord(mySqlConnection, customerDetailsObject, httpResponse, ["currentOTP"]);

    }

    catch(exception)
    {

        handleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
                "Sending OTP Notification through nodemailer failed => Email address = " + 
                inputCustomerRecord.EmailAddress + " , exception = " + exception.message);

        mySqlConnection.end();
            
    }

}

function generateRandomOTP( numberOfDigits )
{

    let currentInteger = Math.floor(Math.random() * Math.pow(10, numberOfDigits ));

    let currentRandString = String(currentInteger);

    let numOfZerosToBeAppended = numberOfDigits - currentRandString.length;

    for( let i = 0 ; i < numOfZerosToBeAppended; i++ )
    {
        currentRandString += "0";
    }

    return Number(currentRandString);

}

module.exports = {sendEmailNotificationToStakeHolders, sendOTPNotificationToInputCustomer};


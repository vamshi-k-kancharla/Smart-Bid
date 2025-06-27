
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const NodeMailerModule = require("nodemailer");


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

module.exports = {sendEmailNotificationToStakeHolders};


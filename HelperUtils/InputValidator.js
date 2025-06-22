
const LoggerUtilModule = require("./LoggerUtil.js");


function validateUserInputValue(userInputValue)
{
    if( userInputValue == null || userInputValue == undefined || userInputValue === "" )
    {
        return false;
    }

    return true;
}

function validateUserInputObject(userInputObject, userInputKeys)
{
    for( currentInputKey of userInputKeys )
    {
        if( !validateUserInputValue(userInputObject[currentInputKey]) )
        {

            LoggerUtilModule.logInformation("validateUserInputObject..value not found for Key = " + currentInputKey);
            return false;
        }
    }

    return true;
}

function validateUserInputObjectValue(userInputObject)
{

    if( userInputObject == null || userInputObject == undefined || Object.keys(userInputObject).length === 0 
        || Object.values(userInputObject).length === 0 )
    {
        return false;
    }

    return true;
}

module.exports = {validateUserInputValue, validateUserInputObject, validateUserInputObjectValue};


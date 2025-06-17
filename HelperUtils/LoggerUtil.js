
const GlobalsForServerModule = require("./GlobalsForServer.js");


function logInformation(inputLogStr)
{

    if( GlobalsForServerModule.bDebugInformation )
    {
        console.log(inputLogStr);
    }
}


module.exports = {logInformation};

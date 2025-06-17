
let LoggerUtilModule = require("./LoggerUtil.js");


function returnSuccessHttpResponse(httpResponse, inputLogStr)
{

    LoggerUtilModule.logInformation(inputLogStr);

    httpResponse.writeHead( 200, {"content-type" : "text/plain"} );
    httpResponse.end(inputLogStr);

}

function returnBadRequestHttpResponse(httpResponse, inputLogStr)
{

    console.error(inputLogStr);

    httpResponse.writeHead( 400, {"content-type" : "text/plain"} );
    httpResponse.end(inputLogStr);

}

function returnServerFailureHttpResponse(httpResponse, inputLogStr)
{

    console.error(inputLogStr);

    httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
    httpResponse.end(inputLogStr);

}


module.exports = { returnSuccessHttpResponse, returnBadRequestHttpResponse, returnServerFailureHttpResponse };

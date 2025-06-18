
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

function returnNotFoundHttpResponse(httpResponse, inputLogStr)
{

    console.error(inputLogStr);

    httpResponse.writeHead( 404, {"content-type" : "text/plain"} );
    httpResponse.end(inputLogStr);

}

function returnServerFailureHttpResponse(httpResponse, inputLogStr)
{

    console.error(inputLogStr);

    httpResponse.writeHead( 500, {"content-type" : "text/plain"} );
    httpResponse.end(inputLogStr);

}

function returnUnauthorizedHttpResponse(httpResponse, inputLogStr)
{

    console.error(inputLogStr);

    httpResponse.writeHead( 401, {"content-type" : "text/plain"} );
    httpResponse.end(inputLogStr);

}

module.exports = { returnSuccessHttpResponse, returnBadRequestHttpResponse, returnNotFoundHttpResponse, 
    returnServerFailureHttpResponse, returnUnauthorizedHttpResponse };

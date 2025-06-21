
const GlobalsForServerModule = require("./HelperUtils/GlobalsForServer.js");
const InputValidatorModule = require("./HelperUtils/InputValidator.js");
const LoggerUtilModule = require("./HelperUtils/LoggerUtil.js");
const HandleHttpResponseModule = require("./HelperUtils/HandleHttpResponse.js");

const fileSystem = require('fs/promises');

const formidableModule = require('formidable');


async function processAssetAdditions(mySqlConnection, httpRequest, httpResponse)
{
    try
    {

        // Validate the Incoming Request

        
        // Add Asset and retrieve AssetId


        // Process the Asset Files

        let parsedFields, parsedFiles;
        let formidableParser = formidableModule.formidable({});

        [parsedFields, parsedFiles] = await formidableParser.parse(httpRequest);

        let inputAssetObject = parsedFields;
        let assetId = 5;

        let currentIndex = 0;

        for( let currentFileKey of Object.keys(parsedFiles) )
        {
            let currentFileObjectValue = parsedFiles[currentFileKey];

            let currentFileParts = currentFileObjectValue.toString().split(',');

            let currentFilePath, currentFileExtension;

            for( let eachFilePart of currentFileParts )
            {

                console.log("current File Part => " + eachFilePart);

                if( eachFilePart.indexOf("Original:") != -1 )
                {
                    let currentFileName = eachFilePart.replace("Original:", "");
                    currentFileExtension = currentFileName.split('.')[1];
                    console.log("currentFileExtension => " + currentFileExtension);
                }

                if( eachFilePart.indexOf("Path:") != -1 )
                {
                    currentFilePath = eachFilePart.replace("Path:", "");
                    console.log("Path => " + currentFilePath);
                }

            }

            currentFilePath = currentFilePath.trim();

            let currentImageFileName = GlobalsForServerModule.imagesDirectory + "asset_" + assetId + "_file_" + currentIndex + "." + 
                currentFileExtension;

            await fileSystem.copyFile(currentFilePath, currentImageFileName);
            
            currentIndex++;
        }

        let noOfFiles = currentIndex;

        // Add Asset Details record to the DB
        // Update Asset Details if the record already exists ( in case of new file uploads & file deletions )

        let assetDetailsRecordValues = '(' + assetId + ',' +
        '' + noOfFiles + ',' +
        '" ")';

        let mySqlAssetDetailsDBRecordAdd = 'INSERT INTO assetdetails (assetId, NoOfFiles, assetDescription) ' +
        ' Values ' + assetDetailsRecordValues;

        LoggerUtilModule.logInformation("Asset Details DB Record Query = " + mySqlAssetDetailsDBRecordAdd);

        let mySqlAssetDetailsDBRecordAddResult = await mySqlConnection.execute( mySqlAssetDetailsDBRecordAdd );

        if( mySqlAssetDetailsDBRecordAddResult[0].affectedRows === 1 )
        {

            HandleHttpResponseModule.returnSuccessHttpResponse(httpResponse, 
                "Successfully added asset details table record");
        }
        else
        {

            HandleHttpResponseModule.returnBadRequestHttpResponse(httpResponse, 
                "Bad Request...wrong asset details input add request");
        }

    }

    catch(exception)
    {

        HandleHttpResponseModule.returnServerFailureHttpResponse(httpResponse, 
            "Error occured while adding Assets & asset files to the DB = " + exception.message);

    }
}

module.exports = {processAssetAdditions};


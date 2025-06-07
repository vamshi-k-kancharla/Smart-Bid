let bCryptHashModule = require('bcryptjs');

let GlobalsForServerModule = require("./GlobalsForServer.js");


function createCustomersDBRecord(mySqlConnection, inputCustomerRecord, httpResponse)
{
    try
    {
        console.log("Hash Generation salt = " + bCryptHashModule.genSaltSync(GlobalsForServerModule.hashGenerationSalt));


        var customerRecordValues = '("' + inputCustomerRecord.Name + '",' +
        '"' + inputCustomerRecord.EmailAddress + '",' +
        '"' + inputCustomerRecord.Address + '",' +
        '"' + inputCustomerRecord.UserType + '",' +
        '"' + inputCustomerRecord.City + '",' +
        '"' + inputCustomerRecord.State + '",' +
        '"' + inputCustomerRecord.Country + '",' +
        '"' + bCryptHashModule.hashSync(atob(inputCustomerRecord.Password), 
        bCryptHashModule.genSaltSync(GlobalsForServerModule.hashGenerationSalt)) + '",' +
        '' + inputCustomerRecord.PhoneNumber + ')';

        console.log("customer DB Record Values = " + customerRecordValues);

        var mySqlCustomerDBRecordAdd = 'INSERT INTO customers (Name , EmailAddress , Address , UserType , City , State , Country , ' +
        'Password , PhoneNumber ) Values ' + customerRecordValues;

        console.log("Customer DB Record Query = " + mySqlCustomerDBRecordAdd);

        mySqlConnection.connect( (error) => {

            if(error)
            {
                console.error("Error occured while connecting to mySql Server => " + error.message);
                throw error;
            }

            console.log("Successfully connected to MySql Server");

        });

        mySqlConnection.query( mySqlCustomerDBRecordAdd, (error, result) => {

            if(error)
            {
                console.error("Error occured while adding customers DB Record => " + error.message);
            }

            console.log("Successfully added the customer records to the DB " + result.affectedRows);

            httpResponse.end("Successfully added the customer records to the DB " + result.affectedRows);
        });
    }

    catch(exception)
    {
        console.error("Error occured while adding customer record to the DB = " + exception.message);
        httpResponse.end("Error occured while adding customer record to the DB = " + exception.message);
    }
}

module.exports = {createCustomersDBRecord};


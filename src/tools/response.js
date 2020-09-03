/*
    This function help us to send good JSON format in the API
    It handle errors out of the box

    ---------------------------------------------------------
    
    The structure of response is like that:
    data can be an array of elements or just 1 element.
    {
        status: {
            code: "auth/invalid-credential",
            isError: true,
            message: "Try again!"
        },
        data:[
            {...}
        ]
    }
*/

import {
    StatusTypes
} from "./status";

// To send the data in unique format
/**
 * This method send a Http JSON Format 👌
 * @param {object} res - Server Response >> the 'res' argument 👈.
 * @param {object} data - The data to be sent 🥑.
 * @param {boolean} isError -[false] Is there an error? true or false 🙄.
 * @param {String} errorCode -[""] error code, You have to put it from firebase catch "error.code", You can put a custom one from StatusTypes.{}.code 🤠!
 * @param {String} message - [""] optional argument = empty by default, cause the Messages are generated from StatusTypes.{}.message, You can put a custom text if you want 🤠!
 */
function easyResponse(
    res,
    data,
    isError = false, // no error by default
    errorCode = '', // no error by default
    message = '' // empty by default >> in case you want a custom message or in success case for example!
) {

    // no error by default
    let statusNumber = 200;
    // The status format
    let status = {
        // no error by default
        code: StatusTypes.SUCCESS.code,
        isError,
        message
    }

    // Check is this an error status or not
    let i = 0; // just local
    if (isError) {
        // Get the error Type & Message 🔥
        for (const el in StatusTypes) {
            if (StatusTypes[el].code == errorCode) {
                statusNumber = StatusTypes[el].number;
                status.code = StatusTypes[el].code;
                // check the message is empty >> is this a cutom message or not? 😉
                if (message == '')
                    status.message = StatusTypes[el].message;

                // do not waste your time! just exit 🤣
                i++;
                break;
            }
        }
        // In this case, We have an error, But the "errorCode" is not on our list 🦊!
        // So we have to send something to the user 🤷!
        // Cause the default values is always the "sucess" status 👈, We won't send a sucess message in an error 👍!
        if (i == 0) {
            status.code = "ERROR";
            statusNumber = 400;
            status.message = "It doesn't look okay, something is wrong, try again!";
        }

    }

    // IF no error 🐶
    else {
        // In success case: is this a cutom message or not? 😉
        if (message == '')
            status.message = StatusTypes.SUCCESS.message;
    }

    const format = {
        status,
        data
    };

    res.status(statusNumber).send(format);
}

// Export! 
export {
    easyResponse
}
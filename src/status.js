/*
 * This types and Messages is to simpilify the sending of status and message 👌
 */

import send from "@polka/send-type";

// Status Numbers
const StatusNumbers = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
}

// Status Types: Code + Messages 😉
const StatusTypes = {
    // for success case 👍
    SUCCESS: {
        code: 'SUCCESS',
        number: StatusNumbers.SUCCESS,
        message: "All is done!"
    },
    Already_Exist_Email: {
        code: 'auth/email-already-exists',
        number: StatusNumbers.BAD_REQUEST,
        message: "Your email is already in use by an existing user, Each user must have a unique email!"
    },
    Already_Exist_Phone_Number: {
        code: 'auth/phone-number-already-exists',
        number: StatusNumbers.BAD_REQUEST,
        message: "Your phone number is already in use by an existing user, Each user must have a unique one!"
    },
    Invalid_Email: {
        code: 'auth/invalid-email',
        number: StatusNumbers.BAD_REQUEST,
        message: 'Your email is invalid, Try to use another one!'
    },
    Invalid_Name: {
        code: 'auth/invalid-display-name',
        number: StatusNumbers.BAD_REQUEST,
        message: 'Seriously! You cannot set an empty name! Are you invisible?'
    },
    Invalid_Phone_Number: {
        code: 'auth/invalid-phone-number',
        number: StatusNumbers.BAD_REQUEST,
        message: 'Your phone number is invalid. It must be a non-empty E.164 standard compliant identifier string'
    },
    Invalid_Password: {
        code: 'auth/invalid-password',
        number: StatusNumbers.BAD_REQUEST,
        message: 'Sorry! Invalid password, It must be a string with at least six characters.'
    },
    Invalid_User: {
        code: 'auth/user-not-found',
        number: StatusNumbers.NOT_FOUND,
        message: "Your email or password is incorrect. please try again!"
    },
    Invalid_Token_ID: {
        code: 'auth/invalid-id-token',
        number: StatusNumbers.UNAUTHORIZED,
        message: "Try to login again!"
    },
    // not an anonymous user 👌
    Login_Is_Required: {
        code: 'Login_Is_Required',
        number: StatusNumbers.UNAUTHORIZED,
        message: "Please Login to continue the game!"
    },
    Authentication_Failed: {
        code: 'auth/invalid-credential',
        number: StatusNumbers.UNAUTHORIZED,
        message: "Authentication Failed, Try again!"
    },
    Token_ID_Revoked: {
        code: 'auth/id-token-revoked',
        number: StatusNumbers.UNAUTHORIZED,
        message: "Try to login again!"
    },
    Token_ID_Expired: {
        code: 'auth/user-token-expired',
        number: StatusNumbers.UNAUTHORIZED,
        message: "The credential of this account is expired or the account is deleted! Try to sign in again!"
    },
    Network_Error: {
        code: 'auth/network-request-failed',
        number: StatusNumbers.BAD_REQUEST,
        message: "This is a network error! Try later!"
    },
    User_Disabled: {
        code: 'auth/user-disabled',
        number: StatusNumbers.UNAUTHORIZED,
        message: "Your account is disabled by the administrator, Try to contact us!"
    },
    Internal_Error: {
        code: 'auth/internal-error',
        number: StatusNumbers.INTERNAL_ERROR,
        message: "Sorry! This is an internal error"
    },
    Invalid_Argument: {
        code: 'auth/argument-error',
        number: StatusNumbers.BAD_REQUEST,
        message: "Incorrect arguments!"
    }
}

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
        type: StatusTypes.SUCCESS.code,
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
                status.type = el;
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
            status.type = "ERROR";
            statusNumber = 400;
            status.message = "It doesn't look okay, something is wrong, try again!";
        }
    }

    // ---------------------------------------------
    /*
    The structure of response is like that:
    data can be an array of elements or just 1 element.
    {
        status: {
            type: "Authentication_Failed",
            isError: true,
            message: "Try again!"
        },
        data:[
            {...}
        ]
    }
    */
    // ---------------------------------------------
    const format = JSON.stringify({
        status,
        data
    });

    // Send an HTTP JSON!
    send(res, statusNumber, format, {
        'Content-Type': 'application/json'
    });
}

// Export All!
export default {
    StatusNumbers,
    StatusTypes,
    easyResponse
}
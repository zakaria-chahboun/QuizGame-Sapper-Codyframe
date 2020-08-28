/*
 * This types and Messages is to simpilify the sending of status and message 👌
 */

import send from "@polka/send-type";

// Status Types
const Types = {
    SUCCESS: "SUCCESS", // 200
    BAD_REQUEST: "BAD_REQUEST", // 400
    ANONYMOUS: "ANONYMOUS", // 400
    UNAUTHORIZED: "UNAUTHORIZED", // 401
    NOT_FOUND: "NOT_FOUND", // 404
    INTERNAL_ERROR: "INTERNAL_ERROR", // 500
}

// Error code + Status Messages 😉
const ErrorStatus = {
    Already_Exist_Email: {
        code: 'auth/email-already-exists',
        type: Types.BAD_REQUEST,
        message: "Your email is already in use by an existing user, Each user must have a unique email!"
    },
    Already_Exist_Phone_Number: {
        code: 'auth/phone-number-already-exists',
        type: Types.BAD_REQUEST,
        message: "Your phone number is already in use by an existing user, Each user must have a unique one!"
    },
    Invalid_Email: {
        code: 'auth/invalid-email',
        type: Types.BAD_REQUEST,
        message: 'Your email is invalid, Try to use another one!'
    },
    Invalid_Name: {
        code: 'auth/invalid-display-name',
        type: Types.BAD_REQUEST,
        message: 'Seriously! You cannot set an empty name! Are you invisible?'
    },
    Invalid_Phone_Number: {
        code: 'auth/invalid-phone-number',
        type: Types.BAD_REQUEST,
        message: 'Your phone number is invalid. It must be a non-empty E.164 standard compliant identifier string'
    },
    Invalid_Password: {
        code: 'auth/invalid-password',
        type: Types.BAD_REQUEST,
        message: 'Sorry! Invalid password, It must be a string with at least six characters.'
    },
    Invalid_User: {
        code: 'auth/user-not-found',
        type: Types.NOT_FOUND,
        message: "Your email or password is incorrect. please try again!"
    },
    Invalid_Token_ID: {
        code: 'auth/invalid-id-token',
        type: Types.UNAUTHORIZED,
        message: "Try to login again!"
    },
    // not an anonymous user 👌
    Login_Is_Required: {
        code: 'Login_Is_Required',
        type: Types.ANONYMOUS,
        message: "Please Login to continue the game!"
    },
    Authentication_Failed: {
        code: 'auth/invalid-credential',
        type: Types.UNAUTHORIZED,
        message: "Authentication Failed, Try again!"
    },
    Revoked_Token_ID: {
        code: 'auth/id-token-revoked',
        type: Types.UNAUTHORIZED,
        message: "Try to login again!"
    },
    Internal_Error: {
        code: 'auth/internal-error',
        type: Types.INTERNAL_ERROR,
        message: "Sorry! This is an internal error"
    }
}

// To send the data in unique format
/**
 * This method send a Http JSON Format 👌
 * @param {object} res - Server Response >> the 'res' argument 👈.
 * @param {object} data - The data to be sent 🥑.
 * @param {boolean} isError -[false] Is there an error? true or false 🙄.
 * @param {String} errorCode -[""] error code, You have to put it from firebase catch "error.code", You can put a custom one from ErrorStatus.{}.code 🤠!
 * @param {String} message - [""] optional argument, the default Messages is generated from ErrorStatus.{}.message, You can put a custom text 🤠!
 */
function easyResponse(
    res,
    data,
    isError = false, // default
    errorCode = '', // default
    message = '' // default
) {

    // No error by default
    let statusCode = 200;
    // The status format
    let status = {
        type: '',
        isError,
        message
    }

    // To get the error Type & Message 🔥
    for (const el in ErrorStatus) {
        if (ErrorStatus[el].code == errorCode) {
            status.type = ErrorStatus[el].type;
            // set the number of error status
            switch (status.type) {
                case Types.ANONYMOUS:
                    statusCode = 400;
                    break;
                case Types.BAD_REQUEST:
                    statusCode = 400;
                    break;
                case Types.INTERNAL_ERROR:
                    statusCode = 500;
                    break;
                case Types.NOT_FOUND:
                    statusCode = 404;
                    break;
                case Types.UNAUTHORIZED:
                    statusCode = 401;
                    break;
            }
            // check the message, is it a cutom one or not? 😉
            if (message != '')
                status.message = ErrorStatus[el].message;

            // do not waste your time! just exit 🤣
            break;
        }
    }

    // The correct json format to send
    /*
    The structure of response is like that:
    data can be array of elements or just 1 element 
    {
        status: {
            type: "SUCCESS",
            isError: false,
            message: ""
        },
        data:[
            {...}
        ]
    }
    */
    const format = JSON.stringify({
        status,
        data
    });

    // Send an HTTP JSON!
    send(res, statusCode, format, {
        'Content-Type': 'application/json'
    });
}

// Export All!
export default {
    Types,
    ErrorStatus,
    easyResponse
}
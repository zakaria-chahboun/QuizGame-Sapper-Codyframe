/*
 * This types and Messages is to simpilify the sending of status and message 👌
 */

import send from "@polka/send-type";

// Status Types
const types = {
    Success: "Success",
    Bad_Request: "Bad_Request",
    Unauthorized: "Unauthorized",
}

// Error code + Status Messages 😉
const ErrorStatus = {
    Already_Exist_Email: {
        code: 'auth/email-already-exists',
        message: "Your email is already in use by an existing user, Each user must have a unique email!"
    },
    Already_Exist_Phone_Number: {
        code: 'auth/phone-number-already-exists',
        message: "Your phone number is already in use by an existing user, Each user must have a unique one!"
    },
    Invalid_Email: {
        code: 'auth/invalid-email',
        message: 'Your email is invalid, Try to use another one!'
    },
    Invalid_Name: {
        code: 'auth/invalid-display-name',
        message: 'Seriously! You cannot set an empty name! Are you invisible?'
    },
    Invalid_Phone_Number: {
        code: 'auth/invalid-phone-number',
        message: 'Your phone number is invalid. It must be a non-empty E.164 standard compliant identifier string'
    },
    Invalid_Password: {
        code: 'auth/invalid-password',
        message: 'Sorry! Invalid password, It must be a string with at least six characters.'
    },
    Invalid_User: {
        code: 'auth/user-not-found',
        message: "Your email or password is incorrect. please try again!"
    },
    // not an anonymous user 👌
    Login_Is_Required: {
        code: 'Login_Is_Required',
        message: "Please Login to continue the game!"
    },
    Authentication_Failed: {
        code: 'auth/invalid-credential',
        message: "Authentication Failed, Try again!"
    },
    Internal_Error: {
        code: 'auth/internal-error',
        message: "Sorry! This is an internal error"
    }
}

// To send the data in unique format
/**
 * This method send a JSON Format 👌
 * @param {object} res - Server Response >> the 'res' argument 👈.
 * @param {object} data - The data to be sent 🥑.
 * @param {boolean} error -[false] Is there an error? true or false 🙄.
 * @param {string} type - ["Success"] Types from status.types 🤦‍♂.
 * @param {string} message - [""] Messages from status.messages 😂.
 */
function simpleResponse(
    res,
    data,
    error = false, // default
    type = types.Success, // default
    message = '' // default
) {
    const format = JSON.stringify({
        status: {
            type,
            error,
            message
        },
        data
    });
    let statusCode = 200; // default

    switch (type) {
        case types.Bad_Request:
            statusCode = 400
            break;
        case types.Unauthorized:
            statusCode = 401
            break;
    }
    send(res, statusCode, format);
}

// This function is checking the error code from 'ErrorStatus'
function checkTheErrors(error_status) {

}

// Export All!
export default {
    types,
    ErrorStatus,
    simpleResponse
}
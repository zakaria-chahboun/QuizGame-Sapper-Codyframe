/*
 * This types and Messages is to simpilify the sending of status and message 👌
 * We can use this file in both client and server!
 */

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
    Already_Exist_UID: {
        code: 'auth/uid-already-exists',
        number: StatusNumbers.BAD_REQUEST,
        message: "The provided uid is already in use by an existing user. Each user must have a unique uid."
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
        message: 'Sorry! Invalid password, It must be a string with at least 6 characters.'
    },
    Wrong_Password: {
        code: 'auth/wrong-password',
        number: StatusNumbers.BAD_REQUEST,
        message: 'Sorry! wrong password! Try again or click on forget link.'
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
    },
    // for all kind of no data of this game
    NO_DATA: {
        code: 'NO_DATA',
        number: StatusNumbers.BAD_REQUEST,
        message: "There is no data for this request."
    },
}


// Export All!
export {
    StatusNumbers,
    StatusTypes,
}
/*
 * This types and Messages is to simpilify the sending of status and message 👌
 */

const types = {
    Success: "Success",
    Bad_Request: "Bad_Request",
    Unauthorized: "Unauthorized",
}

const messages = {
    Invalid_Format: "Input JSON is not valid",
    Invalid_User: "Your email or password is incorrect. please try again!",
    Login_Required: "Please Login to continue the game!",
}


export default {
    types,
    messages
}
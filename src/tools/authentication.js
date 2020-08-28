/*
 This file contain all utils to easy authentication :)
*/

import {
    easyResponse,
} from "./response";

import {
    auth
} from "../firebase.js";

// To extract authentication token from client request: this is a (polka or express) middleware 😉
const getAuthToken = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};

// To decode the token an retrive the user data 🤴
export const checkAuthenticated = async (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const {
                authToken
            } = req;
            if (authToken == null) {
                next();
                return;
            }
            const userInfo = await auth.verifyIdToken(authToken, true);
            req.user = userInfo;
            return next();
        } catch (e) {
            easyResponse(res, null, true, e.code);
        }
    });
};
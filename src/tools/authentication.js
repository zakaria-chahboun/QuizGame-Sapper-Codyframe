/*
 This file contain all utils to easy authentication :)
*/

import {
    easyResponse
} from "./response";

import {
    auth
} from "../firebase-admin.js";

import {
    StatusTypes
} from "./status";
import cookie from "cookie";

// JWT: To extract authentication token from client request: this is a (polka or express) middleware 😉
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

// JWT: To decode the token an retrive the user data 🤴
export const JWTAuthentication = async (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const {
                authToken
            } = req;

            // for a regular visitor
            if (authToken == null) {
                next();
                return;
            }
            const userInfo = await auth.verifyIdToken(authToken, true);
            req.user = userInfo;
            return next();
        } catch (error) {
            easyResponse(res, null, null, true, error.code);
        }
    });
};

// SESSION: To verify the firebase seesion cookie 🤴
export const SessionAuthentication = async (req, res, next) => {
    const sessionCookie = req.cookies.session || '';
    /* Verify the session cookie. 
       In this case an additional check is added to detect if the user's Firebase session was revoked, user deleted/disabled, etc.
    */
    auth.verifySessionCookie(
            sessionCookie, true /** checkRevoked */ )
        .then((decodedClaims) => {
            req.user = {
                uid: decodedClaims.uid,
                email: decodedClaims.email,
                name: decodedClaims.name || "",
                avatar: decodedClaims.picture || "",
                phoneNumber: decodedClaims.phone_number || "",
                loginTime: Unix_timestamp(decodedClaims.auth_time),
                isAnonymous: decodedClaims.isAnonymous || false,
                emailVerified: decodedClaims.email_verified,
            }
            next();
        })
        .catch(error => {
            // Session cookie is unavailable or invalid. Force user to login.
            //easyResponse(res, null, null, true, StatusTypes.Login_Is_Required.code);
            next()
        });
};

// To Convert Unix Seconds to Normal HH:MM:SS time
function Unix_timestamp(t) {
    var dt = new Date(t * 1000);
    var hr = dt.getHours();
    var m = "0" + dt.getMinutes();
    var s = "0" + dt.getSeconds();
    return hr + ':' + m.substr(-2) + ':' + s.substr(-2);
}
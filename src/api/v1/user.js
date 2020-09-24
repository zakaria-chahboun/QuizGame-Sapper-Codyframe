import express from 'express';
const api_v1_user_router = express.Router();

// my tools to get easy work 💜
import {
    easyResponse
} from "../../tools/response";

import {
    StatusTypes
} from '../../tools/status';

import {
    firestore,
    auth
} from "../../firebase-admin";

const {
    PORT,
    NODE_ENV,
} = process.env;
const dev = NODE_ENV === 'development';

api_v1_user_router
    .get('/user/test/:test_id', async (req, res) => {

        // First of all: check the existence of user
        if (!req.user) {
            return easyResponse(res, null, true, StatusTypes.Login_Is_Required.code);
        }
        const {
            test_id
        } = req.params;

        try {
            let testDoc = await firestore
                .collection("tests")
                .doc(test_id)
                .get();

            if (!testDoc.exists) {
                return easyResponse(res, null, true, StatusTypes.NO_DATA.code);
            }

            easyResponse(res, {
                a: 1,
                b: 2
            }, );


        } catch (error) {
            return easyResponse(res, null, true, error.code);
        }
    })

// export the router 
export {
    api_v1_user_router
};
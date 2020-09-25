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

import fetch from 'node-fetch';

/* 
    this is the production host name
    exapmle 1: https://api.myapp.com
    exapmle 2: https://www.myapp.com
*/
import {
    hostname
} from '../hostname.json';

const {
    PORT,
    NODE_ENV,
} = process.env;
const dev = NODE_ENV === 'development';

const coreApi = dev ? `http://localhost:${PORT}/api/v1/core` : `${hostname}/api/v1/core`;

api_v1_user_router
    // -- get all tests data from db --
    .get('/user/tests/:id?', async (req, res) => {
        try {
            // variables
            let testData = {}; // The final clean result (maybe array of objects if tests, maybe one object if one test)
            let apiUrl = '';
            const testID = req.params.id;

            // [option 1] Get core test by ID
            // [option 2] Get all core tests
            testID ? apiUrl = `${coreApi}/tests/${testID}` : apiUrl = `${coreApi}/tests`;

            // ------------------------- Step 1 -------------------------

            // Get test or tests
            const snapshot = await fetch(apiUrl);
            let result = await snapshot.json();
            if (result.status.isError) return easyResponse(res, null, true, result.status.code, result.status.message);
            testData = result.data;

            // ------------------------- Step 2 -------------------------

            // User Variables 🤦‍♂
            let userProgress = [];
            // Check if user logged in >> then get his progress
            if (req.user) {
                let userID = req.user.uid;
                const userDoc = await firestore
                    .collection("users").doc(userID)
                    .get();

                // Check if the User alredy exist and has the 'lastTest' field 🐶 in db
                if (userDoc.exists && userDoc.data().lastTest) {
                    const userData = await firestore
                        .collection("users").doc(userID).collection('userProgress')
                        .get();

                    // array of maps (js objects) 🤠
                    userProgress = userData.docs.map(doc => {
                        let data = doc.data();
                        data.id = doc.id;
                        return data;
                    });

                    // const userLastTest = await userDoc.data().lastTest.get();
                    // console.log(userLastTest.data());
                }
            }

            // ------------------------- Step 3 -------------------------

            // [option 1]: return data of test by id
            if (testID) {
                testData.stepValue = 0; // by default: no step 🙄!
                testData.isCompleted = false; // by default: no user play 🙄!
                testData.lastQuestion = 0; // by default: no user play 🙄!

                // if the user logged and exist >> update the progress 🦊
                for (const e of userProgress) {
                    if (e.id == testID) {
                        testData.stepValue = e.stepValue;
                        testData.isCompleted = e.isCompleted;
                        testData.lastQuestion = e.lastQuestion;
                        break;
                    }
                }

                const snapshot = await fetch(`${coreApi}/questions/test/${testData.id}`);
                const result = await snapshot.json();
                if (result.status.isError) return easyResponse(res, null, true, result.status.code, result.status.message);

                const max = result.data.length;
                testData.maxSteps = max;
                return easyResponse(res, testData);
            }
            // [option 2]: return data of all tests
            else {
                let tests = [];
                for (let doc of testData) {
                    doc.stepValue = 0; // by default: no step 🙄!
                    doc.isCompleted = false; // by default: no user play 🙄!
                    doc.lastQuestion = 0; // by default: no user play 🙄!

                    // if the user logged and exist >> update the progress 🦊
                    for (const e of userProgress) {
                        if (e.id == doc.id) {
                            doc.stepValue = e.stepValue;
                            doc.isCompleted = e.isCompleted;
                            doc.lastQuestion = e.lastQuestion;
                            break;
                        }
                    }

                    // finally add 'max steps' for the current test 😉
                    // this is useful to not increase question index more than it have (out of range) 👌
                    const snapshot = await fetch(`${coreApi}/questions/test/${doc.id}`);
                    const result = await snapshot.json();
                    if (result.status.isError) return easyResponse(res, null, true, result.status.code, result.status.message);

                    doc.maxSteps = result.data.length;
                    tests.push(doc);
                }

                // Promise.all is useful if you have a "async/await" inside the "map" function of your array
                //const tests = await Promise.all(_tests_);
                return easyResponse(res, tests);
            }
        } catch (error) {
            console.log(error);

            easyResponse(res, null, true, error.code);
        }
    })

// export the router 
export {
    api_v1_user_router
};
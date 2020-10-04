import express from "express";
const api_v1_user_router = express.Router();

// my tools to get easy work 💜
import { easyResponse } from "../../tools/response";
import { StatusTypes } from "../../tools/status";
import { firestore } from "../../firebase-admin";
import { ChoiceTypes, StepCircleTypes } from "../../components/types";
import fetch from "node-fetch";

/* 
    this is the production host name
    exapmle 1: https://api.myapp.com
    exapmle 2: https://www.myapp.com
*/
import { hostname } from "../hostname.json";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const coreApi = dev
  ? `http://localhost:${PORT}/api/v1/core`
  : `${hostname}/api/v1/core`;
const userApi = dev
  ? `http://localhost:${PORT}/api/v1/user`
  : `${hostname}/api/v1/user`;

api_v1_user_router
  // -- get all tests + progress data from db --
  .get("/user/tests/:id?", async (req, res) => {
    try {
      // variables
      let testData = {}; // The final clean result (maybe array of objects if tests, maybe one object if one test)
      let apiUrl = "";
      const testID = req.params.id;

      // [option 1] Get core test by ID
      // [option 2] Get all core tests
      testID
        ? (apiUrl = `${coreApi}/tests/${testID}`)
        : (apiUrl = `${coreApi}/tests`);

      // ------------------------- Step 1 -------------------------

      // Get test or tests
      const snapshot = await fetch(apiUrl);
      let result = await snapshot.json();
      if (result.status.isError)
        return easyResponse(
          res,
          null,
          true,
          result.status.code,
          result.status.message
        );
      testData = result.data;

      // ------------------------- Step 2 -------------------------

      // User Variables 🤦‍♂
      let userProgress = [];
      // Check if user logged in >> then get his progress
      if (req.user) {
        let userID = req.user.uid;
        const userDoc = await firestore.collection("users").doc(userID).get();

        // Check if the User alredy exist and has the 'lastTest' field 🐶 in db
        if (userDoc.exists && userDoc.data().lastTest) {
          const userData = await firestore
            .collection("users")
            .doc(userID)
            .collection("userProgress")
            .get();

          // array of maps (js objects) 🤠
          userProgress = userData.docs.map((doc) => {
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

        const snapshot = await fetch(
          `${coreApi}/questions/test/${testData.id}`
        );
        const result = await snapshot.json();
        if (result.status.isError)
          return easyResponse(
            res,
            null,
            true,
            result.status.code,
            result.status.message
          );

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
          if (result.status.isError)
            return easyResponse(
              res,
              null,
              true,
              result.status.code,
              result.status.message
            );

          doc.maxSteps = result.data.length;
          tests.push(doc);
        }

        // Promise.all is useful if you have a "async/await" inside the "map" function of your array
        //const tests = await Promise.all(_tests_);
        return easyResponse(res, tests);
      }
    } catch (error) {
      easyResponse(res, null, true, error.code);
    }
  })
  // -- get all question + progress data from db --
  .get(
    "/user/game/test/:test_id/question/:question_index",
    async (req, res) => {
      try {
        // Variables
        const testID = req.params.test_id;
        const questionIndex = req.params.question_index;
        const user = req.user;

        // No access for: no user
        if (!user)
          return easyResponse(
            res,
            null,
            true,
            StatusTypes.Login_Is_Required.code
          );

        // Get the test data
        const snapshot1 = await fetch(`${userApi}/tests/${testID}`, {
          method: "GET",
          headers: {
            cookie: req.headers.cookie,
          },
        });
        let result1 = await snapshot1.json();
        if (result1.status.isError)
          return easyResponse(
            res,
            null,
            true,
            result1.status.code,
            result1.status.message
          );
        const testData = result1.data;

        // No access for: Anonymous 'User' in private 'Test'
        if (testData.isAuth && user.isAnonymous)
          return easyResponse(
            res,
            null,
            true,
            StatusTypes.Login_Is_Required.code
          );

        // Get the question reference
        const snapshot2 = await fetch(
          `${coreApi}/questions/test/${testID}/${questionIndex}`
        );
        let result2 = await snapshot2.json();
        if (result2.status.isError)
          return easyResponse(
            res,
            null,
            true,
            result2.status.code,
            result2.status.message
          );
        const questionReference = result2.data.reference;

        // Get the question data
        const snapshot3 = await fetch(
          `${coreApi}/questions/${questionReference}`
        );
        let result3 = await snapshot3.json();
        if (result3.status.isError)
          return easyResponse(
            res,
            null,
            true,
            result3.status.code,
            result3.status.message
          );
        const questionData = result3.data;

        // ----- User Progres  -----------------------------
        let StepCirclesProgress;
        let CurrentChoiceProgress;
        const userDoc = await firestore.collection("users").doc(user.uid).get();
        // Check if the User alredy exist and has the 'lastTest' field 🐶 in db
        if (userDoc.exists && userDoc.data().lastTest) {
          const userProgressColl = firestore
            .collection("users")
            .doc(user.uid)
            .collection("userProgress")
            .doc(testID)
            .collection("questions");

          const userAllData = await userProgressColl.get();
          const userQuestion = await userProgressColl
            .doc(`${questionIndex}`)
            .get();
          StepCirclesProgress = {};
          userAllData.docs.forEach((e) => {
            StepCirclesProgress[`${e.id}`] = e.data().isWrong;
          });
          if (userQuestion.exists) CurrentChoiceProgress = userQuestion.data();
        }

        // ----- Generate Data -----------------------------
        let gameData = {};
        gameData.parent = questionData.parent;
        gameData.questionID = questionData.id;
        gameData.question = questionData.question;
        gameData.description = questionData.description;
        gameData.isAuth = testData.isAuth;
        gameData.stepValue = testData.stepValue;
        gameData.lastQuestion = testData.lastQuestion;
        gameData.isCompleted = testData.isCompleted;
        gameData.choices = [];
        gameData.correctAnswers = [];
        gameData.stepCircles = [];

        let counter = 0;

        // Set 'choices' data for 'Choices' component
        for (let [i, e] of questionData.answers.entries()) {
          let type = ChoiceTypes.current; // default
          let disabled = false; // default
          if (CurrentChoiceProgress) {
            disabled = true;
            if (CurrentChoiceProgress.chosenAnswers[`${i}`] != undefined) {
              if (CurrentChoiceProgress.chosenAnswers[`${i}`] === true) {
                type = ChoiceTypes.correct;
              } else if (
                CurrentChoiceProgress.chosenAnswers[`${i}`] === false
              ) {
                type = ChoiceTypes.uncorrect;
              }
            }
          }
          gameData.choices.push({
            type: type,
            answer: e.answer,
            disabled: disabled,
          });
          // We want 'counter' later to check if the choice is single or multiple!
          if (e.isCorrect) {
            gameData.correctAnswers.push(i); // add the correct answer(s) by index 👍
            counter++;
          }
        }

        gameData.isMultiple = counter > 1 ? true : false;

        // Set the "sep circles" for 'StepCircles' component
        for (let i = 1; i <= testData.maxSteps; i++) {
          let step = {};
          let type = "";
          if (
            StepCirclesProgress &&
            StepCirclesProgress[`${i}`] !== undefined
          ) {
            type =
              StepCirclesProgress[`${i}`] === true
                ? StepCircleTypes.uncorrect
                : StepCircleTypes.correct;
          }
          step.type = type;
          step.url = `/test/${testID}/${i}`;
          step.index = i;
          gameData.stepCircles.push(step);
        }

        // Send Data
        return easyResponse(res, gameData);
      } catch (error) {
        return easyResponse(res, null, true, error.code);
      }
    }
  )
  // -- submit the answers of user --
  .post("/user/game/test", async (req, res) => {
    try {
      const user = req.user;
      const { test, index, max, isWrong, chosenAnswers } = req.body;

      // No handling for: no user
      if (!user)
        return easyResponse(
          res,
          null,
          true,
          StatusTypes.Login_Is_Required.code
        );

      // -----   Firebase User Data   ----------------------

      // User DataBase Point
      const userDB = await firestore.collection("users").doc(user.uid);
      // User Progress Point : Test
      const userProgressTest = userDB.collection("userProgress").doc(test);
      // User Progress Point : Question
      const userProgressQuestion = userProgressTest.collection("questions");

      // -----   Firebase Transaction   --------------------

      await firestore.runTransaction(async (t) => {
        await t.set(userDB, {
          lastTest: `/tests/${test}`,
        });
        await t.set(userProgressQuestion.doc(`${index}`), {
          chosenAnswers,
          isWrong,
        });
      });

      await firestore.runTransaction(async (t) => {
        let UPQ_Length = (await t.get(userProgressQuestion)).docs.length;
        const isCompleted = UPQ_Length == max;
        await t.set(userProgressTest, {
          isCompleted,
          lastQuestion: index,
          stepValue: UPQ_Length == 0 ? 1 : UPQ_Length,
        });
      });

      // All is good
      easyResponse(res, null);
    } catch (error) {
      easyResponse(res, null, true, error.code);
    }
  })
  // -- reset a test of user --
  .post("/user/game/test/reset", async (req, res) => {
    try {
      const user = req.user;
      const { test } = req.body;

      // No handling for: no user
      if (!user)
        return easyResponse(
          res,
          null,
          true,
          StatusTypes.Login_Is_Required.code
        );

      const TestUser = await firestore
        .collection("users")
        .doc(user.uid)
        .collection("userProgress")
        .doc(test);
      const QuestionsUser = await TestUser.collection("questions").get();

      // User progress: delete question collection + test document
      // in transaction
      await firestore.runTransaction(async (t) => {
        QuestionsUser.forEach(async (e) => {
          await t.delete(e.ref);
        });
        await t.delete(TestUser);
      });

      return easyResponse(res, null);
    } catch (error) {
      return easyResponse(res, null, true, error.code);
    }
  });

// export the router
export { api_v1_user_router };

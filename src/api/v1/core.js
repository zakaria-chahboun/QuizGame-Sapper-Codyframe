import express from "express";
const api_v1_core_router = express.Router();

// my tools to get easy work 💜
import { easyResponse } from "../../tools/response";
import { StatusTypes } from "../../tools/status";
import { randomNumbers } from "../../tools/cool";
import { firestore, firebase } from "../../firebase-admin";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

api_v1_core_router
  // -- get tests data from db --
  // -- example: api/v1/core/tests
  // -- example: api/v1/core/tests/[id]
  .get("/core/tests/:id?", async (req, res) => {
    try {
      // [option 1] GET test data from 'tests collection' by id
      if (req.params.id) {
        const testDoc = await firestore
          .collection("tests")
          .doc(req.params.id)
          .get();
        // - check the existence of this test
        if (!testDoc.exists) {
          return easyResponse(
            res,
            null,
            true,
            StatusTypes.NO_DATA.code,
            `There is no test with this id ${req.params.id} !`
          );
        }
        // finally add 'max steps' for the current test 😉
        // this is useful to not increase question index more than it have (out of range) 👌I
        const snapshot = await firestore
          .collection("tests")
          .doc(`${req.params.id}`)
          .collection("questionsID")
          .get();
        const maxteps = snapshot.docs.length;

        // - generate data
        let data = testDoc.data();
        data.id = testDoc.id;
        data.maxSteps = maxteps;
        // send data
        return easyResponse(res, data);
      }
      // [option 2] GET all tests data from 'tests collection'
      else {
        const testCollection = await firestore
          .collection("tests")
          .orderBy("createdAt")
          .get();
        // - check the existence of tests
        if (testCollection.empty) {
          return easyResponse(
            res,
            null,
            true,
            StatusTypes.NO_DATA.code,
            "We have no tests in our database!"
          );
        }
        // - generate data
        let _tests_ = testCollection.docs.map(async (e) => {
          let t = e.data();
          t.id = e.id;
          // finally add 'max steps' for the current test 😉
          // this is useful to not increase question index more than it have (out of range) 👌
          const snapshot = await firestore
            .collection("tests")
            .doc(`${t.id}`)
            .collection("questionsID")
            .get();
          const maxteps = snapshot.docs.length;
          t.maxSteps = maxteps;
          return t;
        });

        // Promise.all is useful if you have a "async/await" inside the "map" function of your array
        const data = await Promise.all(_tests_);
        // send data
        return easyResponse(res, data);
      }
    } catch (error) {
      easyResponse(res, null, true, error.code);
    }
  })
  // -- get questions data by id from db
  // -- example: api/v1/core/questions
  // -- example: api/v1/core/questions/[id]
  .get("/core/questions/:id?", async (req, res) => {
    const { id } = req.params;
    const { rand } = req.query;

    try {
      // point on questions colelction
      const questionColl = await firestore.collection("questions");

      // if specific question 🤠
      if (id) {
        const snapshot = await questionColl.doc(id).get();
        if (!snapshot.exists)
          return easyResponse(
            res,
            null,
            true,
            StatusTypes.NO_DATA.code,
            `There is no question with this id ${id} !`
          );

        let question = snapshot.data();
        question.id = snapshot.id;
        easyResponse(res, question);
      }
      // or all questions
      else {
        // rand query: range of random data 🤗
        if (rand) {
          let numberLimit = parseInt(rand.toString().trim());
          let length = (await questionColl.get()).docs.length;
          if (length == 0) {
            return easyResponse(
              res,
              null,
              true,
              StatusTypes.NO_DATA.code,
              "There no questions in database!"
            );
          } else if (!numberLimit || numberLimit <= 0) {
            return easyResponse(
              res,
              null,
              true,
              StatusTypes.Invalid_Argument.code,
              "Enter a valid limit number."
            );
          } else if (length < numberLimit) {
            return easyResponse(
              res,
              null,
              true,
              StatusTypes.Invalid_Argument.code,
              `We don't have this range of data, We just have ${length} questions.`
            );
          }
          let data = [];
          let random = await randomNumbers(0, length - 1, numberLimit);
          for (let i = 0; i < numberLimit; i++) {
            const x = random[i];
            data[i] = (
              await questionColl.where("random", ">=", x).limit(1).get()
            ).docs[0].data();
          }
          return easyResponse(res, data);
        }
        // all the data 🤗
        const snapshot = await questionColl.get();
        if (snapshot.empty) {
          return easyResponse(
            res,
            null,
            true,
            StatusTypes.NO_DATA.code,
            "There no questions in database!"
          );
        }
        let questions = snapshot.docs.map((doc) => {
          let data = doc.data();
          data.id = doc.id;
          return data;
        });
        easyResponse(res, questions);
      }
    } catch (error) {
      easyResponse(res, null, true, error.code);
    }
  })
  // -- Get question(s) reference(s) of a specific test
  // -- example: api/v1/core/questions/test/[id]
  // -- example: api/v1/core/questions/test/[id]/[index]
  .get("/core/questions/test/:testID/:questionIndex?", async (req, res) => {
    try {
      const { testID, questionIndex } = req.params;

      // [opetion 1] Get all question references in a test
      if (!questionIndex) {
        const snapshot = await firestore
          .collection("tests")
          .doc(`${testID}`)
          .collection("questionsID")
          .get();
        if (snapshot.empty) {
          return easyResponse(
            res,
            null,
            true,
            StatusTypes.NO_DATA.code,
            `There is no test '${testID}' in database, Or this test doesn't have this question index '${questionIndex}'`
          );
        }
        const references = snapshot.docs.map((doc) => doc.data());
        easyResponse(res, references);
      }
      // [opetion 2] Get a specific question reference in a test, by the index of this question
      else {
        const snapshot = await firestore
          .collection("tests")
          .doc(`${testID}`)
          .collection("questionsID")
          .doc(`${questionIndex}`)
          .get();
        if (!snapshot.exists) {
          return easyResponse(
            res,
            null,
            true,
            StatusTypes.NO_DATA.code,
            `There is no test '${testID}' in database, Or this test doesn't have this question index '${questionIndex}'`
          );
        }
        const reference = snapshot.data();
        easyResponse(res, reference);
      }
    } catch (error) {
      easyResponse(res, null, true, error.code);
    }
  })
  .get("/core/update", async (req, res) => {
    let tests = await firestore.collection("tests").get();
    let q = await firestore.collection("questions").get();
    // replace isAuth with isPrivate
    tests.forEach((e) => {
      e.ref.set(
        {
          createdAt: e.createTime,
          isPrivate: false,
          isAuth: firebase.firestore.FieldValue.delete(),
          needToPass: 40,
        },
        { merge: true }
      );
    });
    // replace index with random
    let i = 0;
    q.forEach((e) => {
      e.ref.set(
        {
          random: i,
          index: firebase.firestore.FieldValue.delete(),
        },
        { merge: true }
      );
      i++;
    });

    easyResponse(res, null);
  });

// export the router
export { api_v1_core_router };

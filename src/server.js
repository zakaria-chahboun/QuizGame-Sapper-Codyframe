import sirv from 'sirv';
import polka from 'polka';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

import {
	json
} from 'body-parser';

import csurfMiddleware from "csurf";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import redirect from "@polka/redirect";

// my tools to get easy work 💜
import {
	easyResponse
} from "./tools/response";

import {
	SessionAuthentication
} from "./tools/authentication";

import {
	StatusTypes
} from './tools/status';

import {
	firestore,
	auth
} from "./firebase-admin.js";

const {
	PORT,
	NODE_ENV,
} = process.env;
const dev = NODE_ENV === 'development';

// You can also use Express
polka()
	// - body parser
	.use(json())
	// - cookies parser
	.use(cookieParser())
	.use(SessionAuthentication)
	// - csurf cookie
	// .use(csurfMiddleware({
	// 	cookie: true
	// }))
	// // - to avoid csurf attacks
	// .all("*", (req, res, next) => {
	// 	///res.cookie("XSRF-TOKEN", req.csrfToken());
	// 	res.setHeader('Set-Cookie', cookie.serialize("XSRF-TOKEN", req.csrfToken()));
	// 	next();
	// })
	// -- get all tests data from db --
	.get('/api/v1/tests', async (req, res) => {
		try {
			// get all native tests from 'tests' collection in db
			const testsCollection = await firestore
				.collection("tests")
				.get();

			// ------------------------- Step 1 -------------------------

			// User Variables 🤦‍♂
			let userProgress = [];

			// Check if user logged in
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

			// ------------------------- Step 2 -------------------------

			// Return the data of 'tests'
			const tests_ = testsCollection.docs.map(async (doc) => {
				let data = doc.data();
				data.id = doc.id;
				data.stepValue = 0; // by default: no step 🙄!
				data.isCompleted = false; // by default: no user play 🙄!
				data.lastQuestion = 0; // by default: no user play 🙄!

				// if the user logged and exist >> update the progress 🦊
				userProgress.forEach((e, i) => {
					if (e.id == data.id) {
						data.stepValue = e.stepValue;
						data.isCompleted = e.isCompleted;
						data.lastQuestion = e.lastQuestion;
					}
				})

				// finally add 'max steps' for the current test 😉
				// this is useful to not increase question index more than it have (out of range) 👌
				const max = await firestore
					.collection("tests")
					.doc(doc.id)
					.collection('questionsID').get();

				data.maxSteps = max.docs.length;

				return data;
			});

			// Promise.all is useful if you have a "async/await" inside the "map" function of your array
			const tests = await Promise.all(tests_);

			// ------------------------- Step 3 -------------------------
			easyResponse(res, tests, req.user ? req.user : null);

		} catch (error) {
			easyResponse(res, null, null, true, error.code);
		}
	})
	// -- get questions data by id from db
	.get('api/question/:id', async (req, res) => {
		const {
			id
		} = req.params;
		try {

			const snapshot = await firestore
				.collection("questions").doc(`${id}`).get();
			if (!snapshot.exists)
				throw Error(`no data with this ID: ${id}`);

			let question = snapshot.data();
			question.id = snapshot.id;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(question));

		} catch (error) {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({
				message: error.message
			}));
		}
	})
	// -- get all questions references of test
	.get('api/questions/test/:testID', async (req, res) => {

		const {
			testID
		} = req.params;

		const snapshot = await firestore
			.collection("tests").doc(`${testID}`).collection('questionsID').get();

		let questionsOfTest = snapshot.docs.map(doc => doc.data());

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(questionsOfTest));
	})
	// -- get one (question reference (by index)) of test
	.get('api/question_of_test/:testID/:questionIndex', async (req, res) => {

		const {
			testID,
			questionIndex
		} = req.params;

		const snapshot = await firestore
			.collection("tests").doc(`${testID}`).collection('questionsID').doc(`${questionIndex}`).get();

		let questionReference = snapshot.data();

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(questionReference));
	}).get('/dd', async (req, res) => {

		try {
			const user = await auth.createUser({
				uid: "cUJjO5EJly1Rf2z0uUlb",
				email: "exapmle@user.com",
				displayName: "sarah",
				password: "123456"
			});
			easyResponse(res, null, user.toJSON());
		} catch (error) {
			console.log(error.code);

			easyResponse(res, null, null, true, error.code);
		}
	})
	.post('/api/v1/login', async (req, res) => {
		// Get the token ID passed.
		const tokenID = req.body.tokenID.toString();

		// Set session expiration to 5 days.
		const expiresIn = 60 * 60 * 24 * 5 * 1000;
		// Create the session cookie. This will also verify the ID token in the process.
		// The session cookie will have the same claims as the ID token.
		auth.createSessionCookie(tokenID, {
				expiresIn
			})
			.then((sessionCookie) => {
				// Set cookie policy for session cookie.
				const options = {
					maxAge: expiresIn,
					//httpOnly: true,
					//secure: true
				};
				res.setHeader('Set-Cookie', cookie.serialize("session", sessionCookie, options));
				easyResponse(res, null);
			}, error => {
				easyResponse(res, null, null, true, StatusTypes.Authentication_Failed.code);
			});
	})
	.get('/api/v1/logout', async (req, res) => {
		res.setHeader('Set-Cookie', cookie.serialize('session', "", {
			maxAge: 0
		}));
		redirect(res, 302, '/login');
	})
	.use(
		compression({
			threshold: 0
		}),
		sirv('static', {
			dev
		}),
		sapper.middleware({
			session: (req, res) => ({
				user: req.user
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
<script>
  /*
    UserLogin is a js componant for easy login handling 💪🏼
  */
  import { onMount } from "svelte";
  import { StatusTypes } from "../tools/status.js";
  import { firebaseConfig } from "../firebase-web-config.js";

  // ------ Props ------

  // To show it to the user in case samething happen
  export let message;

  // User Inputs
  export let firstName;
  export let lastName;
  export let email;
  export let password;
  export let provider;

  // UI / UX
  export let isLoading = false;
  export let isError = false;

  // event of UserLogin Component 🔥
  export let clicked = false;
  // we can chose between singup or login 🤠
  export let isSingUp = false;
  // Loading Ui: Check the existence of user: Then the login/signin Method is ready!
  export let isReady = false;

  // enum: Social Media Providers
  const Providers = {
    Email: 1,
    Google: 2,
    Facebook: 3,
    Twitter: 4
  };

  let firebaseCore;
  let firebaseApp;
  let authentication;
  let csrfCookie;

  // this is for (email & password) signup
  let emailVerification = false;

  // This is important, becuase we can get the anonymous user with the firebase (client side) only!
  // The session or (jwt token) of this user is stored in firebase host, So we can't get it with our server-side!
  // So beacuse of that! We have to wait until firebase base return this anonymouse to us, By the 'onAuthStateChanged' function 😉
  let AnonymousCurrentUser = "not-yet";

  let GoogleAuthProvider;
  let FacebookAuthProvider;
  let TwitterAuthProvider;

  // ------ Session Login: by default email & password ------
  // ------ Or Providers: Google, Facebook, Twitter    ------
  async function session_login(provider = Providers.Email, isSingUp = false) {
    if (AnonymousCurrentUser === "not-yet") return alert("Please Wait ..");
    // UX
    isLoading = true;
    try {
      /* As httpOnly cookies are to be used, do not persist any state client side 👍
        For the Seesion authentication not the JWT */
      //if (!isAnonymous) authentication.setPersistence("none");
      let UserResult;

      // Authenticate 🔥!
      switch (provider) {
        // 👉 Way: [Email + Password]
        case Providers.Email:
          // case 1: Singup! there is no anonymous user, so create a real user!
          if (AnonymousCurrentUser == null && isSingUp) {
            UserResult = await authentication.createUserWithEmailAndPassword(
              email,
              password
            );
            // rename it 😉!
            await authentication.currentUser.updateProfile({
              displayName: `${firstName} ${lastName}`
            });
            // send email verification
            await authentication.currentUser.sendEmailVerification();
            emailVerification = true;
          }
          // case 2: Singup! there is an anonymous user, so convert it into a real user!
          else if (AnonymousCurrentUser && isSingUp) {
            let credential = firebaseCore.auth.EmailAuthProvider.credential(
              email,
              password
            );
            UserResult = await authentication.currentUser.linkWithCredential(
              credential
            );
            // rename it 😉!
            await authentication.currentUser.updateProfile({
              displayName: `${firstName} ${lastName}`
            });
            // send email verification
            await authentication.currentUser.sendEmailVerification();
            emailVerification = true;
          }
          // case 3: Login!
          else {
            UserResult = await authentication.signInWithEmailAndPassword(
              email,
              password
            );
          }
          break;
        // 👉 Way: [Google account]
        case Providers.Google:
          // case 1: Singup! there is an anonymous user, so convert it into real user!
          if (AnonymousCurrentUser && isSingUp) {
            UserResult = await AnonymousCurrentUser.linkWithPopup(
              GoogleAuthProvider
            );
          }
          // case 2: Login!
          else {
            UserResult = await authentication.signInWithPopup(
              GoogleAuthProvider
            );
          }
          break;
        // 👉 Way:[Facebook account]
        case Providers.Facebook:
          // case 1: Singup! there is an anonymous user, so convert it into real user!
          if (AnonymousCurrentUser && isSingUp) {
            UserResult = await AnonymousCurrentUser.linkWithPopup(
              FacebookAuthProvider
            );
          }
          // case 2: Login!
          else {
            UserResult = await authentication.signInWithPopup(
              FacebookAuthProvider
            );
          }
          break;
        // 👉 Way [Twitter account]
        case Providers.Twitter:
          // case 1: Singup! there is an anonymous user, so convert it into real user!
          if (AnonymousCurrentUser && isSingUp) {
            UserResult = await AnonymousCurrentUser.linkWithPopup(
              TwitterAuthProvider
            );
          }
          // case 2: Login!
          else {
            UserResult = await authentication.signInWithPopup(
              TwitterAuthProvider
            );
          }
          break;
      }

      // if the user signup with (email & password) he must verifiy his email and re-login, so redirct to (login) page
      if (emailVerification == true) {
        return window.location.assign("login?email_verification=true");
      }

      // Get the Firebase TokenID 👈
      let tokenID = await authentication.currentUser.getIdToken(true);

      // Send the CSRF Cookie with the TokenID to the server 👌
      let toServer = await fetch("/api/v1/user/session_login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "CSRF-Token": csrfCookie
        },
        credentials: "include",
        body: JSON.stringify({ tokenID })
      });

      // Get the result from server (success or failure) 👈
      const serverResult = await toServer.json();
      // Ux
      isLoading = false;
      // Check the result: Success Case 👍
      if (serverResult.status.code == StatusTypes.SUCCESS.code) {
        isError = false;
        message = `Success Login! Hello " ${UserResult.user.displayName} "!`;
        // logout from firebase, WHY? because the backend (and session) is taken the place now 😉
        authentication.signOut();
        // redirect to the home!
        return window.location.assign("/");
      }

      // Failure Case 👎
      isError = true;
      message = serverResult.status.message;
    } catch (error) {
      console.log(error);
      // UX
      isLoading = false;
      isError = true;
      // Empty fields case: 😉
      if (error.code == StatusTypes.Invalid_Argument.code) {
        message = "Empty fields! Login with a valid email and password!";
        return;
      }
      // Other cases: 😉
      for (const el in StatusTypes) {
        if (StatusTypes[el].code == error.code) {
          message = StatusTypes[el].message;
          break;
        }
      }
    }
  }

  // Listen to 'clicked' event 🔥
  $: if (clicked) {
    session_login(provider, isSingUp);
    clicked = false;
  }

  // ------ client side only ------------------
  onMount(async () => {
    // ---- Firbase Init : For Authentication -
    // Dynamic Import for SSR compatible 🤗
    // look at 🥰: https://stackoverflow.com/questions/56315901/how-to-import-firebase-only-on-client-in-sapper/63672503#63672503
    const module = await import("firebase/app");
    await import("firebase/auth");
    firebaseCore = module.default;

    // set the social media providers
    GoogleAuthProvider = new firebaseCore.auth.GoogleAuthProvider();
    FacebookAuthProvider = new firebaseCore.auth.FacebookAuthProvider();
    TwitterAuthProvider = new firebaseCore.auth.TwitterAuthProvider();

    // init the firebase app
    firebaseApp = !firebaseCore.apps.length
      ? firebaseCore.initializeApp(firebaseConfig)
      : firebaseCore.app();

    authentication = firebaseApp.auth();

    // ---- get crsf cookie ----
    let jsc = await import("js-cookie");
    let Cookies = jsc.default;
    csrfCookie = Cookies.get("XSRF-TOKEN");

    authentication.onAuthStateChanged(function(userx) {
      isReady = true;
      if (userx) {
        AnonymousCurrentUser = authentication.currentUser;
      } else {
        AnonymousCurrentUser = null;
      }
    });
  });
</script>

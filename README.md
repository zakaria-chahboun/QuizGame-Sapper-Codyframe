# QuizGame-Sapper-Codyframe

Docs

### First of all
install the dependencies:
```bash
npm install
``` 

in `/src/private` folder add your firebase *json* configurations. and name it as **firebase-config.json**
Also you need to add your `databaseUrl` in the **firebase.js** file like that:

```js
firebase.initializeApp({
    credential: firebase.credential.cert(config),
    databaseURL: "https://my-firebase-test.firebaseio.com"
});
```

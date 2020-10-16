<script context="module">
  import { StatusTypes } from "../../tools/status.js";
  export async function preload(page, session) {
    const { id } = page.params;
    const { user } = session;
    /*
      Array of paramaters:
      '0' for test id,
      '1' for question index in test
    */
    const testID = id[0];
    const questionIndex = id[1];

    // If No user >> No game bro 🙄!
    if (!user)
      return this.redirect(
        302,
        `anonymous?redirect=test/${testID}/${questionIndex}`
      );

    // Get Data from API 🌱
    const snapshot = await this.fetch(
      `api/v1/user/game/test/${testID}/question/${questionIndex}`
    );
    const result = await snapshot.json();

    // If Login is required >> no game >> redirect 🦊
    if (result.status.isError) {
      if (result.status.code == StatusTypes.Login_Is_Required.code) {
        return this.redirect(302, `signup?message=${result.status.message}`);
      } else {
        return this.error(snapshot.status, result.status.message);
      }
    }

    return {
      ...result.data,
      currentQuestionIndex: parseInt(questionIndex), // for incrementation 👈
      currentTestID: testID,
      /*
       * for the initialisation: because the browser store the css behaviour + the chosen radio/checkboxs,
       * so when you switch to another route you get the same css behaviour as the last route,
       * we can avoid that with the pre-initialisation
       */
      singleChoiceAnswer: null,
      multiChoiceAnswers: [],
      descriptionShow: false,
      descriptionStriped: false
    };
  }
</script>

<script>
  import Choices from "../../components/Choices.svelte";
  import Sidebar from "../../components/Sidebar.svelte";
  import StepBar from "../../components/StepBar.svelte";
  import StepCircles from "../../components/StepCircles.svelte";
  import NextButton from "../../components/NextButton.svelte";
  import RestartButton from "../../components/RestartButton.svelte";
  import MyLayout from "./_test.svelte";
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { StepCircleTypes, ChoiceTypes } from "../../components/types.js";

  // step circles data
  export let stepCircles;
  // question title data
  export let question;
  // quetion description data
  export let description;
  // choices data
  export let choices;
  // if multiple answers or a single one
  export let isMultiple;
  // currect question index
  export let currentQuestionIndex;
  // current test id;
  export let currentTestID;
  // Array of index of correct answers
  export let correctAnswers;
  // is the test completed or not
  export let isCompleted;

  // to get the chosen radio "answer" (in single choice case) by binding from child to parent ;)
  export let singleChoiceAnswer;
  // to get the chosen checks "answers" (in multi-choices case) by binding from child to parent ;)
  export let multiChoiceAnswers = [];

  // to show description after user chose the answers
  export let descriptionShow;
  // to make description background striped animation when description is shown
  export let descriptionStriped;

  // for csrf attacks
  let csrfCookie;

  // ______________________ client logic __________________________

  // Reactive Statement > Case 1: if a single choice
  $: if (singleChoiceAnswer != undefined) {
    handleSingleChoice({ answer: singleChoiceAnswer });
  }

  // Reactive Statement > Case 2: if mutiple choices
  $: if (isMultiple && multiChoiceAnswers.length >= 2) {
    handleMultiChoices({ answers: multiChoiceAnswers });
  }

  // Reactive Statement: select the current step circle
  $: if (currentQuestionIndex != undefined && !isCompleted) {
    stepCircles[currentQuestionIndex - 1].type = StepCircleTypes.current;
  }

  // for handling single choice: ux and db
  async function handleSingleChoice({ answer, after = 200 }) {
    // loading description: start striped backgound style 👌
    descriptionShow = true;
    descriptionStriped = true;
    const correctIndex = correctAnswers[0];

    // prevent events by disabling all radio buttons
    for (const i in choices) {
      choices[i].disabled = true;
    }
    // check if true answer or not
    let isWrong = answer != correctIndex;
    let chosenAnswers = {};
    chosenAnswers[answer] = !isWrong;

    // send data to database by api
    const snapshot = await fetch("api/v1/user/game/test", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": csrfCookie
      },
      credentials: "include",
      body: JSON.stringify({
        chosenAnswers,
        isWrong,
        test: currentTestID,
        index: currentQuestionIndex,
        max: stepCircles.length
      })
    });
    const result = await snapshot.json();

    // check the return data of api >> no sync game for no user
    if (result.status.isError) {
      if (result.status.code == StatusTypes.Login_Is_Required.code) {
        await goto("login");
        return;
      } else {
        return alert(`${snapshot.status}: ${result.status.message}`);
      }
    }

    // --------- Css Behaviour ---------
    // After an 'after' time do this:
    setTimeout(() => {
      // if the chosen answer is correct so highlight it with the green color
      if (!isWrong) {
        choices[answer].type = ChoiceTypes.correct;
      }
      // of if uncorrect: highlight it with the red color + highlight also the correct answer with the green color
      else {
        choices[correctIndex].type = ChoiceTypes.correct;
        choices[answer].type = ChoiceTypes.uncorrect;
      }
      // loading desccription: stop striped backgound style 👌
      descriptionStriped = false;
      // if the test is completed >> redirect to result page
      if (result.data.isCompleted) {
        return window.location.assign(`result/${currentTestID}`);
      }
    }, after);
  }

  // for handling multi-choices: ux and db
  async function handleMultiChoices({ answers, after = 200 }) {
    // loading description: start striped backgound style 👌
    descriptionShow = true;
    descriptionStriped = true;

    // prevent events by disabling all checkboxs
    for (const i in choices) {
      choices[i].disabled = true;
    }

    // check if true answer or not
    let chosenAnswers = {};
    let isWrong = !answers
      .map((e, i) => {
        chosenAnswers[e] = correctAnswers.includes(e);
        return e;
      })
      .every((e, i) => e === correctAnswers[i]);

    // send data to database by api
    const snapshot = await fetch("api/v1/user/game/test", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": csrfCookie
      },
      credentials: "include",
      body: JSON.stringify({
        chosenAnswers,
        isWrong,
        test: currentTestID,
        index: currentQuestionIndex,
        max: stepCircles.length
      })
    });
    const result = await snapshot.json();

    // check the return data of api
    if (result.status.isError) {
      return alert(`${snapshot.status}: ${result.status.message}`);
    }

    // After an 'after' time do this:
    setTimeout(() => {
      // loading desccription: stop striped backgound style 👌
      descriptionStriped = false;
      // if the chosen answers is correct so highlight it with the green color
      if (!isWrong) {
        for (let i of answers) {
          choices[i].type = ChoiceTypes.correct;
        }
      }
      // of if uncorrect: highlight it with the red color + highlight also the correct answer with the green color
      else {
        for (let i of answers) {
          choices[i].type = ChoiceTypes.uncorrect;
        }
        for (let i of correctAnswers) {
          choices[i].type = ChoiceTypes.correct;
        }
      }
      // if the test is completed >> redirect to result page
      if (result.data.isCompleted) {
        return window.location.assign(`result/${currentTestID}`);
      }
    }, after);
  }

  onMount(async () => {
    // ---- get crsf cookie ----
    let jsc = await import("js-cookie");
    let Cookies = jsc.default;
    csrfCookie = Cookies.get("XSRF-TOKEN");
  });
</script>

<MyLayout bind:descriptionStriped bind:descriptionShow>

  <!-- Question Data -->
  <h4 slot="question">{question}</h4>

  <!-- Choices Data -->
  <Choices
    {isMultiple}
    bind:singleChoiceAnswer
    bind:multiChoiceAnswers
    data={choices} />

  <!-- Side Bar -->
  <span slot="sidebar">
    <Sidebar>
      <!-- Circle Steps Data -->
      <span slot="step-circles">
        <StepCircles data={stepCircles} />
      </span>
      <span slot="restart-button">
        <RestartButton {currentTestID} />
      </span>
    </Sidebar>
  </span>

  <!-- Stepbar Data -->
  <div slot="step-bar">
    <StepBar index={currentQuestionIndex} />
  </div>

  <!-- Description Data -->
  <div slot="description" class="color-white">
    {descriptionStriped ? '' : description}
  </div>

  <!-- Next Button Data -->
  <span slot="nextButton">
    <NextButton
      {currentTestID}
      {currentQuestionIndex}
      maxQuestions={stepCircles.length} />
  </span>

</MyLayout>

<script context="module">
  import { StatusTypes } from "../../tools/status.js";
  export async function preload(page, session) {
    const { id } = page.params;
    /*
      Array of paramaters:
      '0' for test id,
      '1' for question index in test
    */
    const testID = id[0];
    const questionIndex = id[1];

    // If No user >> No game bro 🙄!
    if (!session.user) {
      return this.redirect(302, "login");
    }

    // Get Data from API 🌱
    const snapshot = await this.fetch(
      `api/v1/user/game/test/${testID}/question/${questionIndex}`
    );
    const result = await snapshot.json();

    // If Login is required >> no game >> redirect 🦊
    if (result.status.isError) {
      if (result.status.code == StatusTypes.Login_Is_Required.code) {
        return this.redirect(302, "login");
      } else {
        return this.error(snapshot.status, result.status.message);
      }
    }

    return {
      ...result.data,
      currentQuestionIndex: parseInt(questionIndex), // for incrementation 👈
      currentTestID: testID,
      /*
       * for the initialisation: because the browserstore the css behaviour + the chosen radio/checkboxs,
       * so when you switch to another route you get the same css as the last route,
       * and we can avoid that with the pre initialisation
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
  import MyLayout from "./_test.svelte";
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

  // to get the chosen radio "answer" (in single choice case) by binding from child to parent ;)
  export let singleChoiceAnswer;
  // to get the chosen checks "answers" (in multi-choices case) by binding from child to parent ;)
  export let multiChoiceAnswers = [];

  // to show description after user chose the answers
  export let descriptionShow;
  // to make description background striped animation when description is shown
  export let descriptionStriped;

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
  $: if (currentQuestionIndex != undefined) {
    stepCircles[currentQuestionIndex - 1].type = StepCircleTypes.current;
  }

  // for handling single choice: ux and db
  function handleSingleChoice({ answer, after = 2000 }) {
    // loading description: start striped backgound style 👌
    descriptionShow = true;
    descriptionStriped = true;
    const correctIndex = correctAnswers[0];

    // prevent events by disabling all radio buttons
    for (const i in choices) {
      choices[i].disabled = true;
    }
    // After an 'after' time do this:
    setTimeout(() => {
      // loading desccription: stop striped backgound style 👌
      descriptionStriped = false;
      // if the chosen answer is correct so highlight it with the green color
      if (answer == correctIndex) {
        choices[answer].type = ChoiceTypes.correct;
      }
      // of if uncorrect: highlight it with the red color + highlight also the correct answer with the green color
      else {
        choices[correctIndex].type = ChoiceTypes.correct;
        choices[answer].type = ChoiceTypes.uncorrect;
      }
    }, after);
  }

  // for handling multi-choices: ux and db
  function handleMultiChoices({ answers, after = 2000 }) {
    // loading description: start striped backgound style 👌
    descriptionShow = true;
    descriptionStriped = true;

    // prevent events by disabling all checkboxs
    for (const i in choices) {
      choices[i].disabled = true;
    }
    // After an 'after' time do this:
    setTimeout(() => {
      // loading desccription: stop striped backgound style 👌
      descriptionStriped = false;
      // if the chosen answers is correct so highlight it with the green color
      if (answers.every((e, i) => e === correctAnswers[i])) {
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
    }, after);
  }
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
      <StepCircles data={stepCircles} />
    </Sidebar>
  </span>

  <!-- Stepbar Data -->
  <div slot="stap-bar">
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

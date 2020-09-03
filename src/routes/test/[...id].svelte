<script context="module">
  export async function preload(page, session) {
    // array of paramaters: '0' for test id, '1' for question index in test
    const { id } = page.params;

    const testID = id[0];
    const questionIndex = id[1];

    // -- get a question reference from (index) of current test --
    let res1 = await this.fetch(
      `api/v1/question_of_test/${testID}/${questionIndex}`
    );
    let questionReference = await res1.json();

    // -- get the question data by the question reference --
    let res2 = await this.fetch(`api/v1/question/${questionReference.reference}`);
    let questionData = await res2.json();

    let question = questionData.question;
    let description = questionData.description;
    let counter = 0; // local
    let choices = [];
    let correctAnswersIndex = [];

    // set choices data with the right format
    for (let [i, e] of questionData.answers.entries()) {
      choices.push({
        type: ChoiceTypes.current,
        answer: e.answer,
        disabled: false
      });
      // the 'counter' is to check if multiple or single choice!
      if (e.isCorrect) {
        correctAnswersIndex.push(i); // add the correct answer(s) by index 👍
        counter++;
      }
    }

    let isMultiple = counter > 1 ? true : false;

    // -- get all question references of test --
    let res3 = await this.fetch(`api/v1/questions/test/${testID}`);
    let stepCircles = await res3.json();
    let i = 1; // local: must start at 1 >> index for question references in tests >> for easy indexing by url

    // set the "sep circles" table with correct format + add referece to it if someone need :p
    stepCircles.map(el => {
      let step = el;
      step.type = "current";
      step.url = `/test/${testID}/${i}`;
      step.index = i;
      i++;
      return step;
    });

    return {
      question,
      description,
      isMultiple,
      choices,
      stepCircles,
      correctAnswersIndex,
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
  import MyLayout from "./_test.svelte";
  import { StepCircleTypes, ChoiceTypes } from "../../components/types.js";
  import { goto } from "@sapper/app";

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
  export let correctAnswersIndex;

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
    const correctIndex = correctAnswersIndex[0];

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
      if (answers.every((e, i) => e === correctAnswersIndex[i])) {
        for (let i of answers) {
          choices[i].type = ChoiceTypes.correct;
        }
      }
      // of if uncorrect: highlight it with the red color + highlight also the correct answer with the green color
      else {
        for (let i of answers) {
          choices[i].type = ChoiceTypes.uncorrect;
        }
        for (let i of correctAnswersIndex) {
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
  <button
    slot="nextButton"
    class="btn btn--default text-component"
    on:click={() => goto(`/test/${currentTestID}/${currentQuestionIndex + 1}`)}
    disabled={currentQuestionIndex == stepCircles.length}
    class:btn--disabled={currentQuestionIndex == stepCircles.length}>
    Next Question
  </button>

</MyLayout>

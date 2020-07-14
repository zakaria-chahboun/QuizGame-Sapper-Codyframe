<script context="module">
  //import { admin } from "../../firebase.js";

  export async function preload(page, session) {
    // array of paramaters: '0' for test id, '1' for question index in test
    const { id } = page.params;

    const testID = id[0];
    const questionIndex = id[1];

    // -- get a question reference from (index) of current test --
    let res1 = await this.fetch(`api/question_of_test/${testID}/${questionIndex}`);
    let questionReference = await res1.json();
    
    // -- get the question data from the 1st step --
    let res2 = await this.fetch(`api/question/${questionReference.reference}`);
    let questionData = await res2.json();

    let question = questionData.question;
    let description = questionData.description;
    let counter = 0; // local
    let choices = [];

    // set choices data with the right format
    for (let e of questionData.answers) {
      choices.push({
        type: types.current,
        answer: e.answer,
        disabled: false
      });
      // for check if multiple or single choice
      if (e.isCorrect) {
        counter++;
      }
    }

    let isMultiple = counter > 1 ? true : false;

    // -- get the question data from the 1st step --
    let res3= await this.fetch(`api/questions/test/${testID}`);
    let table = await res3.json();
    let i = 0;

    table.map(el => {
      let step = el;
      step.type = "current";
      step.url = `/test/${testID}/${i}`;
      i++;
      return step;
    });

    return { question, description, isMultiple, choices, table };
  }
</script>

<script>
  import Step from "../../components/test/Step.svelte";
  import Choices from "../../components/test/Choices.svelte";
  import Sidebar from "../../components/sidebar/Sidebar.svelte";
  import Score from "../../components/score/Score.svelte";
  import MyLayout from "./_myLayout.svelte";
  import { types } from "../../components/test/types.js";
  import { mutipleChecks } from "../../components/store/mystore.js";

  //console.log($stepsStates);

  // steps data
  export let table;
  // question title data
  export let question;
  // quetion description data
  export let description;
  // choices data
  export let choices;
  // if multiple answers or a single one
  export let isMultiple;

  let scoopsRadio = 0; // for getting the chosen radio "answer" (in single choice)

  // Choices Data: "format"
  let data = [
    {
      type: types.uncorrect,
      answer: "Hi! How are you? are you fine? really? 01",
      disabled: false
    },
    {
      type: types.correct,
      answer: "Hi! How are you? are you fine? really? 02",
      disabled: false
    },
    {
      type: types.current,
      answer: "Hi! How are you? are you fine? really? 03",
      disabled: !false
    },
    {
      type: types.current,
      answer: "Hi! How are you? are you fine? really? 04",
      disabled: false
    }
  ];

  // ----- Client Logic ---------
  $: if (scoopsRadio > 0) {
    alert(`You chose the ${scoopsRadio} answer!`);
  }

  $: if ($mutipleChecks.length >= 2) {
    alert(`You chose the ${$mutipleChecks} answers!`);
  }
</script>

<MyLayout>

  <!-- Question Data -->
  <span slot="question">{question}</span>

  <!-- Choices Data as: x4 let data=[{type:...,answer:...,disabled:...},{type:...,answer:...,disabled:...}]-->
  <Choices {isMultiple} bind:scoopsRadio data={choices} />

  <!-- Sidebar Data -->
  <span slot="sidebar">
    <Sidebar>
      <!-- Steps Data -->
      <span slot="steps">
        {#each table as t, i}
          <Step type={t.type} index={i + 1} url={t.url} />
        {/each}
      </span>
    </Sidebar>
  </span>

  <!-- Score Data -->
  <div slot="score">
    <Score score="0" />
  </div>

  <!-- Hint Data -->
  <p slot="hint">{description}</p>

  <!-- Next Button Data -->
  <button slot="nextButton" class="btn btn--default text-component ">
    Next Question
  </button>

</MyLayout>

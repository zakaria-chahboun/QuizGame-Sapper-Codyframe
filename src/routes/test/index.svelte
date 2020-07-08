<script>
  import Step from "../../components/test/Step.svelte";
  import Choices from "../../components/test/Choices.svelte";
  import Sidebar from "../../components/sidebar/sidebar.svelte";
  import MyLayout from "./_myLayout.svelte";
  import { types } from "../../components/test/types.js";
  import { mutipleChecks } from "../../components/store/mystore.js";

  // steps data
  let table = [
    { type: types.current, url: "google.com" },
    { type: types.correct, url: "google.com" },
    { type: types.uncorrect, url: "google.com" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" },
    { type: "", url: "#" }
  ];

  let scoopsRadio = 0; // for getting the chosen radio "answer" (in single choice)
  //let scoopCheck = []; // for getting the chosen chekbox "answer" (in multiple choices)

  let isMultiple = false; // if multiple answers or a single one

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
  <span slot="question">
    Question "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam,
    assumenda?"
  </span>

  <!-- Choices Data as: x4 let data=[{type:...,answer:...,disabled:...},{type:...,answer:...,disabled:...}]-->
  <Choices {isMultiple} bind:scoopsRadio {data} />

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

  <!-- Hint Data -->
  <p slot="hint">This is a hint</p>

  <!-- Next Button Data -->
  <button slot="nextButton" class="btn btn--default text-component ">
    Next Question
  </button>

</MyLayout>

<script>
  import Step from "../../components/test/Step.svelte";
  import Choices from "../../components/test/Choices.svelte";
  import MyLayout from "./_myLayout.svelte";
  import { types } from "../../components/test/types.js";

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

  let isMultiple = !false; // if multiple answers or a single one
  $: console.log(scoopsRadio);

  // Choices Data: "format"
  let data = [
    {
      type: types.correct,
      answer: "Hi! How are you? are you fine? really? 01",
      disabled: false
    },
    {
      type: types.correct,
      answer: "Hi! How are you? are you fine? really? 02",
      disabled: !false
    },
    {
      type: types.current,
      answer: "Hi! How are you? are you fine? really? 03",
      disabled: !false
    },
    {
      type: types.correct,
      answer: "Hi! How are you? are you fine? really? 04",
      disabled: false
    }
  ];
</script>

<MyLayout>

  <!-- Choices Data as: x4 let data=[{type:...,answer:...,disabled:...},{type:...,answer:...,disabled:...}]-->
  <Choices {isMultiple} bind:scoopsRadio {data} />

  <!-- Steps Data -->
  <span slot="steps">
    {#each table as t, i}
      <Step type={t.type} index={i + 1} url={t.url} />
    {/each}
  </span>

  <!-- Hint Data -->
  <p slot="hint">This is a hint</p>

  <!-- Prev Button Data -->
  <button slot="prevButton" class=" btn btn--default text-component">
    Prev Question
  </button>

  <!-- Next Button Data -->
  <button slot="nextButton" class="btn btn--default text-component ">
    Next Question
  </button>

</MyLayout>

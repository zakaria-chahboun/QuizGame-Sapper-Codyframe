<script>
  import { types } from "./types.js";

  // export let type = "";
  // export let answer = "Hola!";
  // export let disabled = false;
  export let isMultiple = false;

  export let data = [
    { type: types.correct, answer: "Hola1 !", disabled: false },
    { type: types.uncorrect, answer: "Hola2 !", disabled: false },
    { type: types.current, answer: "Hola3 !", disabled: false },
    { type: types.correct, answer: "Hola4 !", disabled: false }
  ];

  export let scoopsRadio = 0; // for getting the chosen radio "answer" (in single choice)
  export let scoopCheck = []; // for getting the chosen chekbox "answer" (in multiple choices)

  $: console.log(scoopCheck);
</script>

<!-- For Single Answer: Radio Button -->
{#if !isMultiple}
  {#each data as { type, answer, disabled }, i}
    <li>
      <input
        class="radio radio--bg {type}"
        type="radio"
        id="radio{i + 1}"
        name={isMultiple ? '' : 'my-group'}
        {disabled}
        value={i + 1}
        bind:group={scoopsRadio} />
      <label for="radio{i + 1}">{answer}</label>
    </li>
  {/each}
  <!-- For Multiple Answers: CheckBox -->
{:else}
  {#each data as { type, answer, disabled }, i}
    <li>
      <input
        class="checkbox radio--bg {type}"
        type="checkbox"
        id="check{i + 1}"
        {disabled}
        value={i + 1}
        bind:group={scoopCheck} />
      <label for="check{i + 1}">{answer}</label>
    </li>
  {/each}
{/if}

<script>
  import { ChoiceTypes } from "./types.js";
  import { multiChoiceCheck } from "./store.js";
  /*
   - to get the chosen chekbox "answer" (in multiple choices case).
   - The $multiChoiceCheck += '!' assignment is equivalent to multiChoiceCheck.set($name + '!').
  */

  export let isMultiple = false;

  // data format:
  export let data = [
    { type: ChoiceTypes.correct, answer: "Hola1 !", disabled: false },
    { type: ChoiceTypes.uncorrect, answer: "Hola2 !", disabled: false },
    { type: ChoiceTypes.current, answer: "Hola3 !", disabled: false },
    { type: ChoiceTypes.correct, answer: "Hola4 !", disabled: false }
  ];

  // to get the chosen radio "answer" (in single choice)
  export let singleChoiceCheck = 0;
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
        bind:group={singleChoiceCheck} />
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
        bind:group={$multiChoiceCheck} />
      <label for="check{i + 1}">{answer}</label>
    </li>
  {/each}
{/if}

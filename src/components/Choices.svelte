<script>
  import { ChoiceTypes } from "./types.js";

  export let isMultiple = false;

  // data format:
  export let data = [
    { type: ChoiceTypes.correct, answer: "Hola1 !", disabled: false },
    { type: ChoiceTypes.uncorrect, answer: "Hola2 !", disabled: false },
    { type: ChoiceTypes.current, answer: "Hola3 !", disabled: false },
    { type: ChoiceTypes.correct, answer: "Hola4 !", disabled: false }
  ];

  // to get the chosen radio "answer" (in single choice)
  export let singleChoiceAnswer;
  // to get the chosen checks "answers" (in multi-choices)
  export let multiChoiceAnswers = [];
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
        value={i}
        bind:group={singleChoiceAnswer} />
      <label
        for="radio{i + 1}"
        class:bg-success-lighter={type == ChoiceTypes.correct}
        class:bg-error-lighter={type == ChoiceTypes.uncorrect}>
        {answer}
      </label>
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
        value={i}
        bind:group={multiChoiceAnswers} />
      <label for="check{i + 1}">{answer}</label>
    </li>
  {/each}
{/if}

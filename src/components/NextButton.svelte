<script>
  import { goto } from "@sapper/app";

  export let currentTestID = 1;
  export let currentQuestionIndex = 1;
  export let maxQuestions = 1;
  export let done = false;

  // Ux/Ui
  let wait = false;
</script>

<style>
  .is-striped {
    background-image: repeating-linear-gradient(
      -45deg,
      #e0efff,
      #e0efff 0.5rem,
      #1f87ff 0.5rem,
      #1f87ff 1rem
    );
    background-size: 200% 200%;
    animation: progress 7s linear infinite;
  }

  @keyframes progress {
    100% {
      background-position: 100% 100%;
    }
  }
</style>

<button
  class="btn btn--default text-component {wait ? 'is-striped' : ''}"
  on:click={async () => {
    wait = !wait;
    await goto(`/test/${currentTestID}/${currentQuestionIndex + 1}`);
    wait = !wait;
  }}
  disabled={currentQuestionIndex == maxQuestions}
  class:btn--disabled={!done || currentQuestionIndex == maxQuestions}>
  Next Question
</button>

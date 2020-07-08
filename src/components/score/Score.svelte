<script>
  export let score = 0;
  const max = 40; // you have to set it also in the "codyframe/assets/css/components/_1_steps-v2.scss"
</script>

<div class="steps-v2 margin-bottom-md" style="--step-v2-current-step: {score};">
  <p class="text-sm color-contrast-medium margin-bottom-xs">
    Step
    <span class="js-steps-v2__current-step">{score}</span>
    of
    <span class="js-steps-v2__tot-steps">{max}</span>
  </p>

  <div class="steps-v2__indicator" aria-hidden="true" />
</div>

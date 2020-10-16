<div class="padding-component hide@md no-js:is-hidden">
  <button class="btn btn--primary" aria-controls="sidebar">
    Show progress
  </button>
</div>

<div class="flex@md margin-auto max-width-lg">
  <!-- Side Bar Slot -->
  <slot name="sidebar" />

  <!-- Test Area -->
  <main class="flex-grow">
    <!-- start main content -->
    <div class="text-component padding-md max-width-md">
      <!-- StepBat Slot -->
      <slot name="step-bar" />

      <legend class="form-legend text-bold">
        <!-- Question Slot -->
        <slot name="question" />
      </legend>
      <!-- <h4>Question "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, assumenda?"</h4> -->

      <ul class="radio-list flex flex-column gap-xxxs">
        <!-- Choices slot -->
        <slot />
      </ul>

      <!-- Description slot -->
      <slot name="description" />

      <div class="flex flex-wrap justify-between margin-top-sm">
        <div class="text-left">
          <!-- Prev Button Slot -->
          <slot name="prevButton" />
        </div>
        <div class="text-right">
          <!-- Next Button Slot -->
          <slot name="nextButton" />
        </div>
      </div>

    </div>
    <!-- end main content -->
  </main>
</div>

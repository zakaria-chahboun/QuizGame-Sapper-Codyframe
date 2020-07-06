<div class="padding-component hide@md no-js:is-hidden">
  <button class="btn btn--primary" aria-controls="sidebar">
    Show progress
  </button>
</div>

<div class="flex@md margin-auto max-width-lg">
  <aside
    class="sidebar sidebar--static@md js-sidebar"
    data-static-class="border-right"
    id="sidebar"
    aria-labelledby="sidebarTitle">
    <div class="sidebar__panel">
      <header
        class="sidebar__header padding-y-sm padding-x-md border-bottom border-2
        border-contrast-lower">
        <h1 class="text-md text-truncate" id="sidebarTitle">Progess title</h1>

        <button
          class="reset sidebar__close-btn js-sidebar__close-btn js-tab-focus">
          <svg class="icon" viewBox="0 0 16 16">
            <title>Close panel</title>
            <g
              stroke-width="1"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10">
              <line x1="13.5" y1="2.5" x2="2.5" y2="13.5" />
              <line x1="2.5" y1="2.5" x2="13.5" y2="13.5" />
            </g>
          </svg>
        </button>
      </header>

      <div class="sidebar__content padding-md">
        <!-- start sidebar content -->
        <div class="progress__panel">
          <!-- Steps Slot -->
          <slot name="steps" />
          <!-- This will solve a justify-between flex property 5 items in a row -->
          <!-- <i aria-hidden="true"></i> -->
        </div>
        <div class="flex justify-between margin-top-sm">
          <div class="text-left">
            <button class="btn btn--default text-component">
              <!-- icon button -->
              <!-- <svg aria-hidden="true" class="icon" viewBox="0 0 24 24"><g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" stroke="currentColor" fill="none" stroke-miterlimit="10"><polyline points="1.614 3.558 12 13 22.385 3.559" stroke-linecap="butt"></polyline><rect x="1" y="3" width="22" height="18" rx="2" ry="2"></rect></g></svg> -->
              Go Back
            </button>

          </div>
          <div class="text-right">
            <button class="btn btn--default text-component ">
              Restart Test
            </button>
          </div>
        </div>
        <!-- end sidebar content -->
      </div>
    </div>
  </aside>

  <main class="flex-grow">
    <!-- start main content -->
    <div class="text-component padding-md .max-width-md">
      <!-- <p>Main content.</p> -->
      <!-- <h3 class="bg-contrast-low">Life in the UK Test 1</h3> -->
      <form>
        <fieldset>
          <div class="steps-v2 margin-bottom-md" style="--step-v2-current-step: 5;">
            <p class="text-sm color-contrast-medium margin-bottom-xs">Step <span class="js-steps-v2__current-step">5</span> of <span class="js-steps-v2__tot-steps">10</span></p>

            <div class="steps-v2__indicator" aria-hidden="true"></div>
          </div>
        </fieldset>
        <fieldset class="">
          <legend class="form-legend text-bold">
            Question "Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Magnam, assumenda?"
          </legend>
          <!-- <h4>Question "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, assumenda?"</h4> -->
        </fieldset>
        <fieldset>
          <ul class="radio-list flex flex-column gap-xxxs">
            <!-- Choices slot -->
            <slot />
          </ul>
        </fieldset>

        <details class="details js-details">
          <summary class="details__summary js-details__summary" role="button">
            <span class="flex items-center">
              <svg
                class="icon icon--xxs margin-right-xxs"
                aria-hidden="true"
                viewBox="0 0 12 12">
                <path
                  d="M2.783.088A.5.5,0,0,0,2,.5v11a.5.5,0,0,0,.268.442A.49.49,0,0,0,2.5,12a.5.5,0,0,0,.283-.088l8-5.5a.5.5,0,0,0,0-.824Z" />
              </svg>
              <span>Hint</span>
            </span>
          </summary>

          <div
            class="details__content text-component margin-top-xs
            js-details__content">
            <!-- Hint Slot -->
            <slot name="hint">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere
              quia ipsa et voluptatem impedit, recusandae cum quaerat quidem
              dignissimos minus.
            </slot>
          </div>
        </details>

        <fieldset>
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
        </fieldset>
      </form>

    </div>
    <!-- end main content -->
  </main>
</div>

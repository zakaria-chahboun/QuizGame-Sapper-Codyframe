<script>
  import { goto } from "@sapper/app";
</script>

<!-- Sidebar -->
<aside
  class="sidebar sidebar--static@md js-sidebar sidebar--static border-right
  sidebar--loaded"
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
        <!-- StepCircles Slot -->
        <slot name="step-circles" />
      </div>
      <div class="flex justify-between margin-top-sm">
        <div class="text-left">
          <a class="btn btn--default text-component" href="/" rel="external">
            Go Back
          </a>

        </div>
        <!-- RestartButton Slot -->
        <slot name="restart-button" />
      </div>
      <!-- end sidebar content -->
    </div>
  </div>
</aside>

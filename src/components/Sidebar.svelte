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
          <button
            class="btn btn--default text-component"
            on:click={() => goto('/')}>
            <!-- icon button -->
            <!-- <svg aria-hidden="true" class="icon" viewBox="0 0 24 24"><g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" stroke="currentColor" fill="none" stroke-miterlimit="10"><polyline points="1.614 3.558 12 13 22.385 3.559" stroke-linecap="butt"></polyline><rect x="1" y="3" width="22" height="18" rx="2" ry="2"></rect></g></svg> -->
            Go Back
          </button>

        </div>
        <!-- RestartButton Slot -->
        <slot name="restart-button" />
      </div>
      <!-- end sidebar content -->
    </div>
  </div>
</aside>

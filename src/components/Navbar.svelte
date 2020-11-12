<script>
  export let segment;
  import { stores } from "@sapper/app";
  const { session } = stores();

  $: avatar =
    $session.user && $session.user.avatar ? $session.user.avatar : null;

  // Listener: don't show 'logout' to an Anonymous user 
  $: noUserOrAnonymous = !$session.user || $session.user.isAnonymous;
</script>

<!-- Navbar -->
<header
  class="f-header js-f-header bg hide-nav js-hide-nav js-hide-nav--main"
  data-mobile-trigger="js-anim-menu-btn">
  <!-- Nav Mobile -->
  <div class="f-header__mobile-content container max-width-lg">
    <a rel="external" href="#0" class="f-header__logo">
      <svg width="130" height="32" viewBox="0 0 130 32">
        <title>Go to homepage</title>
        <circle fill="var(--color-primary)" cx="16" cy="16" r="16" />
        <rect
          fill="var(--color-contrast-higher)"
          x="41"
          y="11"
          width="89"
          height="10" />
      </svg>
    </a>

    <button
      class="reset anim-menu-btn js-anim-menu-btn f-header__nav-control
      js-tab-focus"
      aria-label="Toggle menu"
      id="mytestbutton">
      <i
        class="anim-menu-btn__icon anim-menu-btn__icon--close"
        aria-hidden="true" />
    </button>
  </div>

  <!-- Nav Desktop -->
  <div class="f-header__nav" role="navigation">
    <div class="f-header__nav-grid justify-between@md container ">
      <!-- Nav Logo Side -->
      <div class="f-header__nav-logo-wrapper flex-grow flex-basis-0">
        <a rel="external" href="/" class="f-header__logo">
          <svg width="130" height="32" viewBox="0 0 130 32">
            <title>Go to homepage</title>
            <circle fill="var(--color-primary)" cx="16" cy="16" r="16" />
            <rect
              fill="var(--color-contrast-higher)"
              x="41"
              y="11"
              width="89"
              height="10" />
          </svg>
        </a>
      </div>

      <!-- Nav Right Side -->
      <ul class="f-header__list flex-grow flex-basis-0 justify-end@md">
        {#if noUserOrAnonymous}
          <li class="f-header__item">
            <a
              class={segment === 'login' ? 'f-header__btn btn btn--primary' : segment === 'undefined' ? 'f-header__link' : 'f-header__link'}
              rel="external"
              href="login">
              Login
            </a>
          </li>
          <li class="f-header__item">
            <a
              class={segment === 'signup' ? 'f-header__btn btn btn--primary' : segment === 'undefined' || segment === 'login' ? 'f-header__link' : 'f-header__btn btn btn--primary'}
              rel="external"
              href="signup">
              Sign Up
            </a>
          </li>
        {:else}
          <li class="f-header__item">
            <a
              class="f-header__btn btn btn--primary"
              rel="external"
              href="logout">
              Logout
            </a>
          </li>
          <!-- Avatar Profile -->
          {#if segment != 'profile'}
            <li class="f-header__item">
              <div class="avatar avatar--lg">
                <a rel="external" href="profile">
                  <figure
                    class="avatar__figure"
                    role="img"
                    aria-label="Emily Ewing">
                    <svg
                      class="avatar__placeholder"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      stroke-linecap="round"
                      stroke-linejoin="round"><circle
                        cx="10"
                        cy="6"
                        r="2.5"
                        stroke="currentColor" />
                      <path
                        d="M10,10.5a4.487,4.487,0,0,0-4.471,4.21L5.5,15.5h9l-.029-.79A4.487,4.487,0,0,0,10,10.5Z"
                        stroke="currentColor" /></svg>
                    <!-- Avatar Image -->
                    {#if avatar != null}
                      <img class="avatar__img" src={avatar} alt="" title="" />
                    {/if}
                  </figure>
                </a>
              </div>
            </li>
          {/if}
        {/if}
      </ul>
    </div>
  </div>
</header>

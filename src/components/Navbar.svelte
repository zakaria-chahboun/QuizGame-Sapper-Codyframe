<!-- Navbar Codyframe -->
<header
  class="f-header js-f-header bg hide-nav js-hide-nav js-hide-nav--main"
  data-mobile-trigger="js-anim-menu-btn">
  <!-- Nav Mobile -->
  <div class="f-header__mobile-content container max-width-lg">
    <a href="#0" class="f-header__logo">
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
      aria-label="Toggle menu" id="mytestbutton">
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
        <a href="/" class="f-header__logo">
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
        <li class="f-header__item">
          <a href="login" class="f-header__link">Login</a>
        </li>
        <li class="f-header__item">
          <a href="signup" class="f-header__btn btn btn--primary">
            Sign Up
          </a>
        </li>
      </ul>
    </div>
  </div>
</header>
<script>
  
  
</script>





  <header class="f-header js-f-header bg hide-nav js-hide-nav js-hide-nav--main" data-mobile-trigger='js-anim-menu-btn'>
    <!-- Nav Mobile -->
    <div class="f-header__mobile-content container max-width-lg">
      <a href="#0" class="f-header__logo">
        <svg width="130" height="32" viewBox="0 0 130 32"><title>Go to homepage</title><circle fill="var(--color-primary)" cx="16" cy="16" r="16"/><rect fill="var(--color-contrast-higher)" x="41" y="11" width="89" height="10"/></svg>
      </a>
  
      <button class="reset anim-menu-btn js-anim-menu-btn f-header__nav-control js-tab-focus" aria-label="Toggle menu">
        <i class="anim-menu-btn__icon anim-menu-btn__icon--close" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Nav Desktop -->
    <div class="f-header__nav" role="navigation">
      <div class="f-header__nav-grid justify-between@md container ">
        <!-- Nav Logo Side -->
        <div class="f-header__nav-logo-wrapper flex-grow flex-basis-0">
          <a href="index.html" class="f-header__logo">
            <svg width="130" height="32" viewBox="0 0 130 32"><title>Go to homepage</title><circle fill="var(--color-primary)" cx="16" cy="16" r="16"/><rect fill="var(--color-contrast-higher)" x="41" y="11" width="89" height="10"/></svg>
          </a>
        </div>

        <!-- Nav Middle Side -->
        <!-- <ul class="f-header__list flex-grow flex-basis-0 justify-center@md">
          <li class="f-header__item"><a href="test.html" class="f-header__link">About</a></li>
          <li class="f-header__item">
            <a href="#0" class="f-header__link">
              <span>Solutions</span>
              <svg class="f-header__dropdown-icon icon" aria-hidden="true" viewBox="0 0 12 12"><path d="M6,9l4-5H2Z"/></svg>
            </a>
  
            <ul class="f-header__dropdown">
              <li><a href="#0" class="f-header__dropdown-link">Sub Nav Item One</a></li>
              <li><a href="#0" class="f-header__dropdown-link">Sub Nav Item Two</a></li>
              <li><a href="#0" class="f-header__dropdown-link">Sub Nav Item Three</a></li>
              <li><a href="#0" class="f-header__dropdown-link">Sub Nav Item Four</a></li>
              <li><a href="#0" class="f-header__dropdown-link">Sub Nav Item Five</a></li>
            </ul>
          </li>
          <li class="f-header__item"><a href="#0" class="f-header__link">Resources</a></li>
          <li class="f-header__item"><a href="#0" class="f-header__link">Pricing</a></li>
          <li class="f-header__item"><a href="#0" class="f-header__link">Contact</a></li>
        </ul> -->
        
        <!-- Nav Right Side -->
        <ul class="f-header__list flex-grow flex-basis-0 justify-end@md">
          <li class="f-header__item"><a href="login.html" class="f-header__link">Login</a></li>
          <li class="f-header__item"><a href="signup.html" class="f-header__btn btn btn--primary">Sign Up</a></li>
        </ul>
      </div>
    </div>
  </header>

  <div class="container margin-top-lg justify-between@md max-width-lg">
    <ul class="grid-auto-xl gap-md">
      <li class="card card--locked padding-sm">
        <a href="test.html">
          <div class="card__content">
            <div class="text-component">
              <h4>Test 1</h4>
              <p>Login required</p>
              <!-- <p>
                <a href='#0' class='text-bg-fx text-bg-fx--scale-x'>Learn more</a>
              </p> -->
            </div>
          </div>
          <!-- progress bar circle  -->
          <div class="c-progress-bar js-c-progress-bar" data-progress="1%" data-animation="on">
            <p class="sr-only" aria-live="polite" aria-atomic="true">Progress value is <span class="js-c-progress-bar__aria-value">60%</span></p>
          
            <div class="c-progress-bar__shape color-contrast" aria-hidden="true">
              <span class="c-progress-bar__icon locked">
              </span>
          
              <svg viewBox="0 0 100 100" stroke-width="6" fill="none" stroke="currentColor" stroke-linecap="round">
                <circle class="c-progress-bar__bg" cx="50" cy="50" r="44"></circle>
                <circle class="c-progress-bar__fill" cx="50" cy="50" r="44"></circle>
              </svg>
            </div>
          </div>
        </a>
      </li>
      <li>
        <div class="card padding-sm">
          <div class="card__content">
            <div class="text-component">
              <h4>Test 1</h4>
              <p>Test not completed</p>
              <!-- <p>
                <a href='#0' class='text-bg-fx text-bg-fx--scale-x'>Learn more</a>
              </p> -->
            </div>
          </div>
          <!-- progress bar circle  -->
          <div class="c-progress-bar js-c-progress-bar" data-progress="100%" data-animation="on">
            <p class="sr-only" aria-live="polite" aria-atomic="true">Progress value is <span class="js-c-progress-bar__aria-value">60%</span></p>
          
            <div class="c-progress-bar__shape color-success" aria-hidden="true">
              <span class="c-progress-bar__icon completed">
              </span>
          
              <svg viewBox="0 0 100 100" stroke-width="6" fill="none" stroke="currentColor" stroke-linecap="round">
                <circle class="c-progress-bar__bg" cx="50" cy="50" r="44"></circle>
                <circle class="c-progress-bar__fill" cx="50" cy="50" r="44"></circle>
              </svg>
            </div>
          </div>
        </div>
      </li>
      <li class="card card--uncompleted padding-sm">
        <a href="test.html">
          <div class="card__content">
            <div class="text-component">
              <h4>Test 1</h4>
              <p>Test not completed</p>
              <!-- <p>
                <a href='#0' class='text-bg-fx text-bg-fx--scale-x'>Learn more</a>
              </p> -->
            </div>
          </div>
          <!-- progress bar circle  -->
          <div class="c-progress-bar js-c-progress-bar" data-progress="30%" data-animation="on">
            <p class="sr-only" aria-live="polite" aria-atomic="true">Progress value is <span class="js-c-progress-bar__aria-value">60%</span></p>
          
            <div class="c-progress-bar__shape color-primary" aria-hidden="true">
              <span class="c-progress-bar__icon unlocked">
              </span>
          
              <svg viewBox="0 0 100 100" stroke-width="6" fill="none" stroke="currentColor" stroke-linecap="round">
                <circle class="c-progress-bar__bg" cx="50" cy="50" r="44"></circle>
                <circle class="c-progress-bar__fill" cx="50" cy="50" r="44"></circle>
              </svg>
            </div>
          </div>
        </a>
      </li>
      <li>
        <div class="card padding-sm">
          <div class="card__content">
            <div class="text-component">
              <h4>Test 1</h4>
              <p>Test not completed</p>
              <!-- <p>
                <a href='#0' class='text-bg-fx text-bg-fx--scale-x'>Learn more</a>
              </p> -->
            </div>
          </div>
          <!-- progress bar circle  -->
          <div class="c-progress-bar js-c-progress-bar" data-progress="30%" data-animation="on">
            <p class="sr-only" aria-live="polite" aria-atomic="true">Progress value is <span class="js-c-progress-bar__aria-value">60%</span></p>
          
            <div class="c-progress-bar__shape color-primary" aria-hidden="true">
              <span class="c-progress-bar__icon unlocked">
              </span>
          
              <svg viewBox="0 0 100 100" stroke-width="6" fill="none" stroke="currentColor" stroke-linecap="round">
                <circle class="c-progress-bar__bg" cx="50" cy="50" r="44"></circle>
                <circle class="c-progress-bar__fill" cx="50" cy="50" r="44"></circle>
              </svg>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="card padding-sm">
          <div class="card__content">
            <div class="text-component">
              <h4>Test 1</h4>
              <p>Test not completed</p>
              <!-- <p>
                <a href='#0' class='text-bg-fx text-bg-fx--scale-x'>Learn more</a>
              </p> -->
            </div>
          </div>
          <!-- progress bar circle  -->
          <div class="c-progress-bar js-c-progress-bar" data-progress="30%" data-animation="on">
            <p class="sr-only" aria-live="polite" aria-atomic="true">Progress value is <span class="js-c-progress-bar__aria-value">60%</span></p>
          
            <div class="c-progress-bar__shape color-primary" aria-hidden="true">
              <span class="c-progress-bar__icon unlocked">
              </span>
          
              <svg viewBox="0 0 100 100" stroke-width="6" fill="none" stroke="currentColor" stroke-linecap="round">
                <circle class="c-progress-bar__bg" cx="50" cy="50" r="44"></circle>
                <circle class="c-progress-bar__fill" cx="50" cy="50" r="44"></circle>
              </svg>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="card padding-sm">
          <div class="card__content">
            <div class="text-component">
              <h4>Test 1</h4>
              <p>Test not completed</p>
              <!-- <p>
                <a href='#0' class='text-bg-fx text-bg-fx--scale-x'>Learn more</a>
              </p> -->
            </div>
          </div>
          <!-- progress bar circle  -->
          <div class="c-progress-bar js-c-progress-bar" data-progress="30%" data-animation="on">
            <p class="sr-only" aria-live="polite" aria-atomic="true">Progress value is <span class="js-c-progress-bar__aria-value">60%</span></p>
          
            <div class="c-progress-bar__shape color-primary" aria-hidden="true">
              <span class="c-progress-bar__icon unlocked">
              </span>
          
              <svg viewBox="0 0 100 100" stroke-width="6" fill="none" stroke="currentColor" stroke-linecap="round">
                <circle class="c-progress-bar__bg" cx="50" cy="50" r="44"></circle>
                <circle class="c-progress-bar__fill" cx="50" cy="50" r="44"></circle>
              </svg>
            </div>
          </div>
        </div>
      </li>
      
    </ul>
  </div>

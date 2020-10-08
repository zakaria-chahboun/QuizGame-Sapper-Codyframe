<script context="module">
  export async function preload(page, session) {
    //> /login?message=text
    let { message } = page.query;
    let { user } = session;
    if (!message) message = "welcome to our game!";
    if (user && !user.isAnonymous) this.redirect(302, "/");
    return { message };
  }
</script>

<script>
  import UserLogin from "../../components/UserLogin.svelte";

  // ------------------ Props ------------------

  // To show it to the user in case samething happen
  export let message;

  // User Inputs
  let email;
  let password;
  let provider;
  let firstName;
  let lastName;

  // enum: Social Media Providers
  const Providers = {
    Email: 1,
    Google: 2,
    Facebook: 3,
    Twitter: 4
  };

  // UI / UX
  let isLoading = false;
  let isError = false;

  // event of UserLogin Component
  let clicked = false;
</script>

<!-- UserLogin is a js componant for easy login handling 🥰 -->
<UserLogin
  bind:clicked
  bind:provider
  bind:email
  bind:firstName
  bind:lastName
  bind:password
  bind:message
  bind:isLoading
  bind:isError
  isSingUp={true} />

<!-- Body -->
<div
  class="container margin-top-md margin-bottom-lg justify-between@md
  max-width-xs">
  <div class="sign-up-form">
    <div class="text-component text-center margin-bottom-sm">
      <h1>Get started</h1>
      {#if !isLoading}
        <p class:bg-error-light={isError} class:color-white={isError}>
          {message}
        </p>
      {:else}
        <div class="fill-loader fill-loader--v1" role="alert">
          <p class="fill-loader__label">Content is loading...</p>
          <div aria-hidden="true">
            <div class="fill-loader__base" />
            <div class="fill-loader__fill" />
          </div>
        </div>
      {/if}
      <br />
      Already have an account?
      <a rel="external" href="login">Login</a>
    </div>

    <div class="grid gap-xs">
      <div class="col-6@xs">
        <button
          class="btn btn--subtle width-100%"
          on:click={() => {
            provider = Providers.Twitter;
            clicked = true;
          }}>
          <svg
            aria-hidden="true"
            class="icon margin-right-xxxs"
            viewBox="0 0 16 16">
            <g>
              <path
                d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1
                C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7
                c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3
                c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z" />
            </g>
          </svg>
          <span>Join using Twitter</span>
        </button>
      </div>

      <div class="col-6@xs">
        <button
          class="btn btn--subtle width-100%"
          on:click={() => {
            provider = Providers.Facebook;
            clicked = true;
          }}>
          <svg
            aria-hidden="true"
            class="icon margin-right-xxxs"
            viewBox="0 0 16 16">
            <g>
              <path
                d="M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16H8v-5H6V8h2V6c0-2.1,1.2-3,3-3
                c0.9,0,1.8,0,2,0v3h-1c-0.6,0-1,0.4-1,1v1h2.6L13,11h-2v5h4.3c0.4,0,0.7-0.3,0.7-0.7V0.7C16,0.3,15.7,0,15.3,0z" />
            </g>
          </svg>
          <span>Join using Facebook</span>
        </button>
      </div>

      <div class="col-6@xs">
        <button
          class="btn btn--subtle width-100%"
          on:click={() => {
            provider = Providers.Google;
            clicked = true;
          }}>
          <svg
            aria-hidden="true"
            class="icon margin-right-xxxs"
            viewBox="0 0 16 16">
            <g>
              <path
                d="M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16H8v-5H6V8h2V6c0-2.1,1.2-3,3-3
                c0.9,0,1.8,0,2,0v3h-1c-0.6,0-1,0.4-1,1v1h2.6L13,11h-2v5h4.3c0.4,0,0.7-0.3,0.7-0.7V0.7C16,0.3,15.7,0,15.3,0z" />
            </g>
          </svg>
          <span>Join using Google</span>
        </button>
      </div>
    </div>

    <p class="text-center margin-y-sm">or</p>

    <div class="margin-bottom-sm">
      <div class="grid gap-xs">
        <div class="col-6@md">
          <label class="form-label margin-bottom-xxxs" for="inputFirstName">
            First name
          </label>
          <input
            class="form-control width-100%"
            type="text"
            name="inputFirstName"
            id="inputFirstName"
            bind:value={firstName} />
        </div>

        <div class="col-6@md">
          <label class="form-label margin-bottom-xxxs" for="inputLastName">
            Last name
          </label>
          <input
            class="form-control width-100%"
            type="text"
            name="inputLastName"
            id="inputLastName"
            bind:value={lastName} />
        </div>
      </div>
    </div>

    <div class="margin-bottom-sm">
      <label class="form-label margin-bottom-xxxs" for="inputEmail1">
        Email
      </label>
      <input
        class="form-control width-100%"
        type="email"
        name="inputEmail1"
        id="inputEmail1"
        placeholder="email@myemail.com"
        bind:value={email} />
    </div>

    <div class="margin-bottom-md">
      <label class="form-label margin-bottom-xxxs" for="inputPassword1">
        Password
      </label>
      <input
        class="form-control width-100%"
        type="password"
        name="inputPassword1"
        id="inputPassword1"
        bind:value={password} />
      <p class="text-xs color-contrast-medium margin-top-xxs">
        Minimum 6 characters
      </p>
    </div>

    <div class="margin-bottom-sm">
      <button
        class="btn btn--primary btn width-100%"
        on:click={() => {
          provider = Providers.Email;
          clicked = true;
        }}>
        Join
      </button>
    </div>

    <div class="text-center">
      <p class="text-xs color-contrast-medium">
        By joining, you agree to our
        <a href="#0">Terms</a>
        and
        <a href="#0">Privacy Policy</a>
        .
      </p>
    </div>

  </div>
</div>

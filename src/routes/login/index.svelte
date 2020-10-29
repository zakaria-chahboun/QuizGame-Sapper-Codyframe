<script context="module">
  export async function preload(page, session) {
    //> /login?message=text
    let { message } = page.query;
    //> /login?email_verification=true
    let { email_verification } = page.query;
    let { user } = session;
    if (!message) message = "welcome to our game!";
    if (user && !user.isAnonymous) this.redirect(302, "/");
    return { message, email_verification };
  }
</script>

<script>
  import UserLogin from "../../components/UserLogin.svelte";

  // ------------------ Props ------------------

  // To show it to the user in case samething happen
  export let message;
  // In case the user must verifiy his account, this variable show him an alert or mesage
  export let email_verification;

  // User Inputs
  let email;
  let password;
  let provider;

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

  // Login: is the Providers ready?
  let isReady;
</script>

<!-- UserLogin is a js componant for easy login handling 🥰 -->
<UserLogin
  bind:isReady
  bind:clicked
  bind:provider
  bind:email
  bind:password
  bind:message
  bind:isLoading
  bind:isError
  isSingUp={false} />

<!-- Body -->
{#if isReady}
  <div
    class="container margin-top-md margin-bottom-lg justify-between@md
    max-width-xs">
    <div class="login-form">
      <div class="text-component text-center margin-bottom-sm">
        <h1>Log in</h1>
        {#if !isLoading}
          <p class:bg-error-light={isError} class:color-white={isError}>
            {message}
          </p>
        {:else}
          <div class="fill-loader fill-loader--v4" role="alert">
            <p class="fill-loader__label">Content is loading...</p>
            <div aria-hidden="true">
              <div class="fill-loader__base" />
              <div class="fill-loader__fill" />
            </div>
          </div>
        {/if}
      </div>
      <!-- Check if login with email must has (email_verification): Then show a message to user to tell him check your email -->
      {#if email_verification}
        <div class="alert alert--is-visible" role="alert">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg
                aria-hidden="true"
                class="icon margin-right-xxxs"
                viewBox="0 0 32 32">
                <title>info icon</title>
                <g>
                  <path
                    d="M16,0C7.178,0,0,7.178,0,16s7.178,16,16,16s16-7.178,16-16S24.822,0,16,0z
                    M18,7c1.105,0,2,0.895,2,2
                    s-0.895,2-2,2s-2-0.895-2-2S16.895,7,18,7z
                    M19.763,24.046C17.944,24.762,17.413,25,16.245,25c-0.954,0-1.696-0.233-2.225-0.698
                    c-1.045-0.92-0.869-2.248-0.542-3.608l0.984-3.483c0.19-0.717,0.575-2.182,0.036-2.696c-0.539-0.514-1.794-0.189-2.524,0.083
                    l0.263-1.073c1.054-0.429,2.386-0.954,3.523-0.954c1.71,0,2.961,0.855,2.961,2.469c0,0.151-0.018,0.417-0.053,0.799
                    c-0.066,0.701-0.086,0.655-1.178,4.521c-0.122,0.425-0.311,1.328-0.311,1.765c0,1.683,1.957,1.267,2.847,0.847L19.763,24.046z" />
                </g>
              </svg>
              <p class="text-component text-center">
                A verification link has been sent to your email, Please check it!
              </p>
            </div>
          </div>
        </div>
      {:else}
        <!-- or Just show the social media providers -->
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
              <span>Login with Twitter</span>
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
              <span>Login with Facebook</span>
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
                    d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1
                    C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7
                    c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3
                    c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z" />
                </g>
              </svg>
              <span>Login with Google</span>
            </button>
          </div>
        </div>

        <p class="text-center margin-y-sm">or</p>
      {/if}

      <!-- Email & Password Login -->
      <div class="margin-bottom-sm">
        <label class="form-label margin-bottom-xxxs" for="inputEmail1">
          Email
        </label>
        <input
          class="form-control width-100%"
          type="email"
          name="inputEmail1"
          id="inputEmail1"
          bind:value={email}
          placeholder="email@myemail.com"
          on:keyup={e => {
            if (e.code == 'Enter' || e.code == 'NumpadEnter') {
              provider = Providers.Email;
              clicked = true;
            }
          }} />
      </div>

      <div class="margin-bottom-sm">
        <div class="flex justify-between margin-bottom-xxxs">
          <label class="form-label" for="inputPassword1">Password</label>
          <span class="text-sm">
            <a rel="external" href="reset">Forgot?</a>
          </span>
        </div>

        <input
          class="form-control width-100%"
          type="password"
          name="inputPassword1"
          bind:value={password}
          id="inputPassword1"
          on:keyup={e => {
            if (e.code == 'Enter' || e.code == 'NumpadEnter') {
              provider = Providers.Email;
              clicked = true;
            }
          }} />
      </div>

      <div class="margin-bottom-sm">
        <button
          class="btn btn--primary btn width-100%"
          on:click={() => {
            provider = Providers.Email;
            clicked = true;
          }}>
          Login
        </button>
      </div>

      <div class="text-center">
        <p class="text-sm">
          Don't have an account?
          <a rel="external" href="signup">Get started</a>
        </p>
      </div>
    </div>
  </div>
{:else}
  <!-- Loading .. The page is not ready -->
  <div
    class="container margin-top-md margin-bottom-lg justify-between@md
    max-width-xs">
    <div class="login-form">
      <div class="text-component text-center margin-bottom-sm">
        <h1>Log in</h1>
        <p>{message}</p>

        <div class="fill-loader fill-loader--v6" role="alert">
          <p class="fill-loader__label">Content is loading...</p>
          <div aria-hidden="true" class="fill-loader__grid">
            <div class="fill-loader__bar">
              <div class="fill-loader__base" />
              <div class="fill-loader__fill fill-loader__fill--1st" />
            </div>

            <div class="fill-loader__bar">
              <div class="fill-loader__base" />
              <div class="fill-loader__fill fill-loader__fill--2nd" />
            </div>

            <div class="fill-loader__bar">
              <div class="fill-loader__base" />
              <div class="fill-loader__fill fill-loader__fill--3rd" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

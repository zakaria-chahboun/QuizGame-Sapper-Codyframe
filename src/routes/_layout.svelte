<script>
  export let segment;

  import { fly } from "svelte/transition";
  import Navbar from "../components/Navbar.svelte";

  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  const { session } = stores();

  // Is the page ready or not?
  let ready = false;
  // CodyHouse script
  let codyFrameScripts = "";

  onMount(async () => {
    // ---- To mount the CodyFrame scripts ----
    codyFrameScripts = "codyframe/scripts.js";
    ready = true;
  });
</script>

<style lang="scss" global>
  /* codyframe framework SASS - Global */
  @import "./codyframe/assets/css/style.scss";
</style>

<svelte:head>
  <script defer src={codyFrameScripts}>

  </script>
</svelte:head>

{#if $session.user}
  User: ID:
  <mark>{$session.user.uid || '__'}</mark>
  , isAnonymous: {$session.user.isAnonymous ? 'YES' : 'NO'}
{:else}No User{/if}

<!-- Email verification notification -->
{#if ready && $session.user && $session.user.emailVerified === false}
  <div
    in:fly={{ y: -10 }}
    class="alert alert--warning alert--is-visible"
    role="alert">
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
          Your account is not verified yet! A verification link has been sent to
          your email
        </p>
        <span class="margin-left-xs margin-right-xs badge badge--outline text-sm"> {$session.user.email}</span>
        <p> Please check it!</p>
      </div>
    </div>
  </div>
{/if}

<Navbar {segment} />
<slot />

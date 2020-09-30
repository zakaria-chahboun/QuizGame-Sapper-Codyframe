<script>
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";

  export let currentTestID;

  // Ux/Ui
  let wait = false;

  let csrfCookie;

  async function reset() {
    wait = true;
    const snapshot = await fetch("api/v1/user/game/test/reset", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": csrfCookie
      },
      credentials: "include",
      body: JSON.stringify({
        test: currentTestID
      })
    });

    const result = await snapshot.json();
    // check the return data of api
    if (result.status.isError) {
      return alert(`${snapshot.status}: ${result.status.message}`);
    }
    wait = false;
    // refresh
    window.location.reload();
  }

  // --- Client Side
  onMount(async () => {
    // ---- get crsf cookie ----
    let jsc = await import("js-cookie");
    let Cookies = jsc.default;
    csrfCookie = Cookies.get("XSRF-TOKEN");
  });
</script>

<style>
  .is-striped {
    background-image: repeating-linear-gradient(
      -45deg,
      #e0efff,
      #e0efff 0.5rem,
      #1f87ff 0.5rem,
      #1f87ff 1rem
    );
    background-size: 200% 200%;
    animation: progress 7s linear infinite;
  }

  @keyframes progress {
    100% {
      background-position: 100% 100%;
    }
  }
</style>

<div class="text-right">
  <button
    class="btn btn--default text-component {wait ? 'is-striped' : ''}"
    on:click={reset}>
    Restart Test
  </button>
</div>

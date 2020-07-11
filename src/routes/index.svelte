<script context="module">
  import { firebase } from "../firebase.js";
  export async function preload(page, session) {
    const snapshot = await firebase
      .firestore()
      .collection("tests")
      .get();
    return { tests: snapshot.docs.map(doc => doc.data()) };
  }
</script>

<script>
  import TestCard from "../components/testCard/TestCard.svelte";
  import { types } from "../components/testCard/TestCard.js";

  export let tests;
</script>

<!-- TestCard Section -->
<div class="container margin-top-lg justify-between@md max-width-lg">
  <ul class="grid-auto-xl gap-md">
    <!-- TestCard Elements -->
    {#each tests as { testTitle, testSubTitle, testProgress, testStatus }}
      <TestCard
        type="card--{testStatus}"
        value={testProgress}
        title={testTitle}
        subtitle={testSubTitle}
        url="#" />
    {/each}
  </ul>
</div>

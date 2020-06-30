<script>
  import Navbar from "../components/Navbar.svelte";
  import { onMount } from "svelte";

// if you put the script tag in the "template.htmp" or directly in the "svelte:head" tag section: it's not work as expected! because of the stupid codyframe js coding
// the only way to get all functionalities work, is by inject the script with onMount
// - zaki
let codyframeScript = "";
  onMount(() => {
    codyframeScript = "codyframe/scripts.min.js";
  });
</script>

<!-- candy framework SASS - Global -->
<style lang="scss" global>
  @import "./codyframe/assets/css/style.scss";
</style>

<!--  cody framework	 -->
<svelte:head>
	<script defer src="{codyframeScript}">

	</script>

</svelte:head>


<main>
<!-- Navbar CodyFrame -->
<Navbar />
  <slot />
</main>


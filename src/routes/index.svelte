<script>
  import TestCard from "../components/testCard/TestCard.svelte";
  import { types } from "../components/testCard/TestCard.js";

</script>


<!-- TestCard Section -->
<div class="container margin-top-lg justify-between@md max-width-lg">
  <ul class="grid-auto-xl gap-md">
    <!-- TestCard Elements -->
    <TestCard type={types.completed} value={50} title="Hello" subtitle="you win!" url="https://google.com"/>
    <TestCard type={types.uncompleted} value={50} title="Hello" subtitle="continue your game!" url="https://google.com"/>
    <TestCard type={types.locked}/>
    <TestCard type={types.completed}/>
    <TestCard type={types.uncompleted}/>
    <TestCard type={types.completed} title="hamza" value=25/>
  </ul>

</div>

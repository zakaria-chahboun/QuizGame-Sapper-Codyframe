<script>
  import Choice from "./Choice.svelte";
  import { types } from "./types.js";

  export let isMultiple = false;
</script>

<Choice
  type={types.current}
  answer="hala"
  id="radio1"
  group={isMultiple ? '' : 'my-group'} />
<Choice
  type={types.correct}
  answer="hala"
  id="radio2"
  group={isMultiple ? '' : 'my-group'} />
<Choice
  type={types.uncorrect}
  answer="hala"
  id="radio3"
  group={isMultiple ? '' : 'my-group'} />
<Choice group={isMultiple ? '' : 'my-group'} />

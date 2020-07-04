<script>
  import Choice from "./Choice.svelte";
  import { types } from "./types.js";

  export let isMultiple = false;
  export let data = {
    data1: { type: types.current, answer: "Hola!" },
    data2: { type: types.uncorrect, answer: "Hola!" },
    data3: { type: types.correct, answer: "Hola!" },
    data4: { type: types.uncorrect, answer: "Hola!" }
  };
</script>

<Choice {...data.data1} id="radio1" group={isMultiple ? '' : 'my-group'} />
<Choice {...data.data2} id="radio2" group={isMultiple ? '' : 'my-group'} />
<Choice {...data.data3} id="radio3" group={isMultiple ? '' : 'my-group'} />
<Choice {...data.data4} group={isMultiple ? '' : 'my-group'} />

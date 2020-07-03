<script>
  export let type = "";
  export let answer = "this is choice";
  export let group = "";
  export let id = "default-id";
</script>

<li>
  <input class="radio radio--bg {type}" type="radio" {id} name={group} />
  <label for={id}>{answer}</label>
</li>

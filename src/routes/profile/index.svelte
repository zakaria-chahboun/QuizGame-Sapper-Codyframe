<script context="module">
  export async function preload(page, session) {
    let { user } = session;
    //console.log(user);
    if (user && user.isAnonymous) this.redirect(302, "/");
    return { user };
  }
</script>

<script>
  import { FirebaseProviders } from "../../tools/cool.js";
  export let user;
</script>

<pre>
    {user.name} <br />
    
    {user.email} <br />
    {#if user.provider == FirebaseProviders.google}
    
    You are login with google account!

  {/if}

</pre>

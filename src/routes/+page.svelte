<script>
  import { page } from "$app/stores";
  import { signIn, signOut } from "@auth/sveltekit/client";
</script>

<div>
	<main>
		{#if $page.data.session}
		<span class="signedInText">
		  <small>Signed in as</small><br />
		  <strong
			>{$page.data.session.user?.email ??
			  $page.data.session.user?.name}</strong
		  >
		</span>
		<button
		  class="bg-white text-blueGray-700 active:bg-blueGray-50 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
		  type="button"
		  on:click={() => signOut()}
		>
		  <i class="fas fa-arrow-alt-circle-down" /> Logout
		</button>
	  {:else}
		<span class="notSignedInText">You are not signed in</span>
		<button
		  on:click={() => signIn("authentik")}
		  class="bg-white text-blueGray-700 active:bg-blueGray-50 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
		  type="button">Sign in</button
		>
	  {/if}
	</main>
</div>

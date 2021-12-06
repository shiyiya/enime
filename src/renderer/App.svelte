<script>
    import Router from 'svelte-spa-router'

    import Home from './pages/home.svelte';

    const routes = {
        '/': Home
    }
</script>

<Router {routes}/>

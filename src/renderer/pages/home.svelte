<script>
    export let name;
</script>

<style lang="sass">
    $color: aqua
    div
        > p
            background: green
            color: white


    h1
        color: $color

</style>

<h1>Hello {name}!</h1>

<div>
    <p>SASS is working!</p>
</div>

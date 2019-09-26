<template>
    <div id="app">
        <login></login>
    </div>
</template>

<script>
  import login from "@/components/login";

  export default {
    name: 'app',
    components: {
      login
    }
  }
</script>

<style>
    #app {
        height: 100%;
    }
</style>

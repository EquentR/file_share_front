<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

import Login from "@/views/pages/Login";

export default {
  name: 'App',
  components: {Login}
}
</script>

<style>
  #app{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div id="app">
    <Navigation/>
    <router-view/>
  </div>
</template>

<script>
import Navigation from './components/nav/Navigation.vue'
export default {
  components: {
    Navigation
  }
}
</script>

<style>

</style>

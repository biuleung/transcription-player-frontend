<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
  setup() {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 25px; */
  padding: 0 15px;
}

.disabled {
  cursor: not-allowed !important;
}
.hidden {
  display: none !important;
}
.pointer {
  cursor: pointer !important;
}
.bg-red {
  background-color: red !important;
}
.color-gray {
  color: gray !important;
}
.color-white {
  color: white !important;
}
</style>

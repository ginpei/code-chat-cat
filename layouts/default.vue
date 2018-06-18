<template>
  <div>
    <nuxt/>
  </div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

button {
  cursor: pointer;
}

:link,
:visited {
  color: #039;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1em;
}

.warnMessage {
  background-color: cornSilk;
  border: 2px solid gold;
  padding: 0.2em 0.4em;
}

.errorMessage {
  background-color: mistyRose;
  border: 2px solid tomato;
  padding: 0.2em 0.4em;
}
</style>

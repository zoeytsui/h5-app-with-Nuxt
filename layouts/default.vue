<template>
  <div id="layout">
    <Nuxt />
  </div>
</template>

<style lang="scss">
html {
  body {
    font-family: Helvetica;
    #layout {
      background: transparent linear-gradient(0deg, #1b2831 0%, #314e60 100%) 0%
        0% no-repeat padding-box;
      height: 100%;
      p {
        white-space: pre-wrap;
      }
    }
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>

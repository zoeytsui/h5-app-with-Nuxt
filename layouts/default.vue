<template>
  <div id="layout">
    <Nuxt />
  </div>
</template>

<style lang="scss">
$border-color: 1px solid #285b65;
html {
  font-family: "Helvetica Neue", Arial, sans-serif, -apple-system,
    BlinkMacSystemFont, "Source Sans Pro", "Segoe UI", Roboto;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  #layout {
    background: transparent linear-gradient(0deg, #47728e 0%, #1b2831 100%) 0%
      0% no-repeat padding-box;
    height: 100vh;
    // display: flex;
    // flex-flow: column;
    // align-items: stretch;
    // justify-content: flex-start;
    p {
      white-space: pre-wrap;
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

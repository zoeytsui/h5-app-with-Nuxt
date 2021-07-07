<template>
  <div id="wallet">

    <TopBar :currentPage="currentPage" :prevPageURL="prevPageURL" />

    <TotalBalance :totalBalance="totalBalance" />

    <Nuxt />

  </div>
</template>

<script>
export default {
  computed: {
    currentPage() {
      return this.$store.state.wallet.currentPage;
    },
    prevPageURL() {
      return this.$store.state.wallet.prevPageURL;
    },
    totalBalance() {
      return this.$store.state.wallet.totalBalance;
    }
  },
  methods:{
      changeBackground(){
          if (this.currentPage == "Payment History"){
              let wallet = document.querySelector('#wallet');
              wallet.style.background = "#314553";
          }
      },
  },
  mounted(){
      this.changeBackground()
  },
};
</script>

<style lang="scss">
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
  #wallet {
    background: transparent linear-gradient(0deg, #47728e 0%, #1b2831 100%) 0%
      0% no-repeat padding-box;
    min-height: 100vh;
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
.totalbalance {
  text-align: center;
  margin: 0 auto;
  color: #fff;
  width: 80%;
  h2 {
    color: #2beae2;
  }
}
</style>
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
  methods: {
    changeBackground() {
      if (this.currentPage == "Payment History") {
        let wallet = document.querySelector("#wallet");
        wallet.style.background = "#314553";
      }
    }
  },
  mounted() {
    this.changeBackground();
  }
};
</script>

<style lang="scss">
html {
  font-family: Helvetica, "Helvetica Neue", Arial, sans-serif, -apple-system,
    BlinkMacSystemFont, "Source Sans Pro", "Segoe UI", Roboto;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  #wallet {
    background: transparent linear-gradient(0deg, #1b2831 0%, #314e60 100%) 0%
      0% no-repeat padding-box;
    min-height: 100vh;
    p {
      white-space: pre-wrap;
    }
  }

  // the modal showing after complete withdrawal
  .modal-dialog {
    .modal-content {
    border: 0;
      .modal-body {
        top: 2rem;
        p {
          font-weight: 700;
          text-align: center;
        }
      }
      .modal-footer {
        border-top: 0;
        justify-content: center;
        .btn-secondary {
          @include button-grey;
        }
        button {
          @include button-green;
          color: #fff;
          border: 0;
        }
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
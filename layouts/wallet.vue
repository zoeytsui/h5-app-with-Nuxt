<template>
  <div id="wallet">

    <TopBar :currentPage="currentPage" :prevPageURL="prevPageURL" />

    <keep-alive>
      <TotalBalance :totalBalance="totalBalance" />
    </keep-alive>

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
  mounted() {
    if (this.currentPage == "Payment History") {
      document.querySelector("#wallet").style.background = "#314553";
    }
  }
};
</script>

<style lang="scss">
html {
  body {
    font-family: Helvetica;
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
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
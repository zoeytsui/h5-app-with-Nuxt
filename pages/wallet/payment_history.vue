<template>
  <div class="container deposit">

    <span class="span-box">{{keyStr('deposit')}}</span>
    <span class="span-box">{{keyStr('withdrawal')}}</span>
    <span class="span-box">{{keyStr('payment history')}}</span>

    <hr>

  </div>
</template>

<script>
export default {
  layout: "wallet",
  data() {
    return {
      amount: null
    };
  },
  async asyncData({ $content, app }) {
    const content = await $content("wallet").fetch();
    return { content, app };
  },
  created() {
    this.updateState();
  },
  methods: {
    updateState() {
      this.$store.commit("wallet/updateState", {
        currentPage: this.keyStr("payment history"),
        prevPageURL: "/wallet",
        totalBalance: this.keyStr("Total Balance")
      });
    },
    keyStr(key) {
      return this.app.$csvHandler(this.content.body, key);
    }
  }
};
</script>
<style lang="scss" scoped>
$border-color: #25d6cd54;
.deposit {
  color: #fff;
  .span-box {
    padding: 0.2rem 0.4rem;
    background-color: #2beae2;
    color: #000;
    border-radius: 0.2rem;
  }
  hr {
    margin: 1rem 0;
    border-color: $border-color !important;
  }
  #btn-export {
    @include button-green;
  }

  // hide the arrows of input field
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>

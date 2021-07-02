<template>
  <div class="container withdrawal">

    <span class="span-box">Currency(from API)</span>

    <hr>

    <div class="main">
      <p>{{keyStr("Recipient's Address")}}</p>
      <div class="input-group">
        <b-form-input v-model="amount" :placeholder="keyStr('Amount')"></b-form-input>
        <div class="input-group-append">
          <span class="input-group-text text-light bg-transparent border-0">Currency(from API)</span>
        </div>
      </div>

      <p>{{keyStr("Withdrawal Amount")}}</p>
      <div class="input-group">
        <b-form-input v-model="amount" :placeholder="keyStr('Amount')"></b-form-input>
        <div class="input-group-append">
          <span class="input-group-text text-light bg-transparent border-0">Currency(from API)</span>
        </div>
      </div>
    </div>

    <hr>

    <p>{{keyStr("Transaction fee")}}</p>

    <hr>

    <p>{{keyStr("Actual withdrawal")}}</p>

    <h4>{{ 'xxxx USDT' }}</h4>

    <b-button type="submit" id="btn-export" class="btn my-3 w-100 text-light">{{keyStr('Withdrawal')}}</b-button>

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
        currentPage: this.keyStr("withdrawal"),
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
.withdrawal {
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

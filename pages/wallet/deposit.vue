<template>
  <div class="container deposit">

    <span class="span-box">{{deal_type_name}}</span>

    <hr>

    <div class="main">
      <p>{{keyStr('Deposit Amount')}}</p>
      <div class="input-group">
        <b-form-input v-model="amount" :placeholder="keyStr('Amount')" aria-label="Amount (to the nearest dollar)"></b-form-input>
        <span class="input-group-text text-light bg-transparent border-0">{{ deal_type }}</span>
      </div>

      <b-button type="submit" id="btn-export" class="btn my-3 w-100 text-light">{{keyStr('confirm')}}</b-button>
    </div>

  </div>
</template>

<script>
export default {
  layout: "wallet",
  data() {
    return {
      deal_type_name: null,
      deal_type: null,
      amount: null
    };
  },
  async asyncData(context) {
    const content = await context.$content("wallet").fetch();
    return { content };
  },
  created() {
    this.updateState();
  },
  async fetch() {
    let plugin = await this.$genSign("deposit.get_deal_type");

    let token = {
      token: this.$auth.$storage.getUniversal("token"),
      user: plugin.user,
      timestamp: plugin.timestamp,
      sign: plugin.sign
    };
  console.log(token);
    let get_deal_type = await this.$axios.$get(
      "/api/?s=deposit.get_deal_type",
      {
        token: this.$auth.$storage.getUniversal("token"),
        user: plugin.user,
        timestamp: plugin.timestamp,
        sign: plugin.sign
      }
    );

    console.log(get_deal_type);
  },
  methods: {
    updateState() {
      this.$store.commit("wallet/updateState", {
        currentPage: this.keyStr("deposit"),
        prevPageURL: "/wallet",
        totalBalance: this.keyStr("Total Balance")
      });
    },
    keyStr(key) {
      return this.$csvHandler(this.content.body, key);
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

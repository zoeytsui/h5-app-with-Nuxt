<template>
  <div class="container deposit">

    <span class="span-box">{{currency_name}}</span>

    <hr>

    <div class="main">
      <p>{{keyStr('Deposit Amount')}}</p>
      <b-form @submit="onSubmit">
        <div class="input-group">
          <b-form-input v-model="amount" type="number" :placeholder="keyStr('Amount')" aria-label="Amount (to the nearest dollar)"></b-form-input>
          <span class="input-group-text text-light bg-transparent border-0">{{ deal_type }}</span>
          <!-- <b-form-invalid-feedback :state="validation">please input number</b-form-invalid-feedback> -->
        </div>

        <b-button type="submit" id="btn-export" class="btn my-3 w-100 text-light">{{keyStr('confirm')}}</b-button>
      </b-form>
    </div>

  </div>
</template>

<script>
export default {
  layout: "wallet",
  data() {
    return {
      currency_decimal: null,
      currency_name: null,
      deal_type: null,
      amount: null,
      reback_sing: null,
      formURL: null
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
    // -=-=-=-=-=-= get_deal_type =-=-=-=-=-=-=-=
    let plugin_get_deal_type = await this.$genSign({
      s: "deposit.get_deal_type",
      user: "",
      timestamp: "",
      token: ""
    });

    let get_deal_type = await this.$axios
      .$get("/api/?s=deposit.get_deal_type", {
        params: {
          token: plugin_get_deal_type.token,
          user: plugin_get_deal_type.user,
          timestamp: plugin_get_deal_type.timestamp,
          sign: plugin_get_deal_type.sign
        }
      })
      .then(res => res.data.shift());

    // result
    // console.log(get_deal_type);
    this.currency_name = get_deal_type.name;
    this.deal_type = get_deal_type.deal_type;
    this.currency_decimal = get_deal_type.decimal;

    // FIXME: cannot get amount from the ssr
    console.log("ssr", this.amount);

    // -=-=-=-=-=-= deposit_index =-=-=-=-=-=-=-=
    let plugin_deposit_index = await this.$genSign({
      s: "deposit.index",
      amount: "123",
      display_type: "m",
      deal_type: get_deal_type.deal_type,
      currency_name: get_deal_type.name,
      currency_decimal: get_deal_type.decimal,
      deposit_type: "egpay",
      track: "",
      callbackUrl: "url",
      remark: "",
      login: "",
      user: "",
      timestamp: "",
      token: ""
    });

    let deposit_index = await this.$axios
      .$get("/api/?s=deposit.index", {
        params: {
          amount: "123",
          display_type: "m",
          deal_type: get_deal_type.deal_type,
          currency_name: get_deal_type.name,
          currency_decimal: get_deal_type.decimal,
          deposit_type: "egpay",
          // TODO: wait to get callbackUrl from app
          callbackUrl: "url",
          remark: "",
          track: plugin_deposit_index.track,
          login: plugin_deposit_index.login,
          token: plugin_deposit_index.token,
          user: plugin_deposit_index.user,
          timestamp: plugin_deposit_index.timestamp,
          sign: plugin_deposit_index.sign
        }
      })
      .then(res => res.data);

    // result
    // console.log(deposit_index);
    this.reback_sing = deposit_index.reback_sing;
    this.formURL = deposit_index.url;

    // TODO: egpay test
    // let egpay = await fetch(deposit_index.url)

    // -=-=-=-=-=-= deposit_callbackurl =-=-=-=-=-=-=-=
    let plugin_deposit_callbackurl = await this.$genSign({
      s: "deposit.callbackurl",
      encryptedText: "",
      signedText: "",
      reback_sing: deposit_index.reback_sing,
      user: "",
      timestamp: "",
      token: ""
    });

    let deposit_callbackurl = await this.$axios
      .$get("/api/?s=deposit.callbackurl", {
        params: {
          encryptedText: "",
          signedText: "",
          reback_sing: deposit_index.reback_sing,
          token: plugin_deposit_callbackurl.token,
          user: plugin_deposit_callbackurl.user,
          timestamp: plugin_deposit_callbackurl.timestamp,
          sign: plugin_deposit_callbackurl.sign
        }
      })
      .then(res => res.data);

    // result
    // TODO: egpay not ready
    // console.log(deposit_callbackurl);

  },
  methods: {
    updateState() {
      this.$store.commit("wallet/updateState", {
        currentPage: this.keyStr("deposit"),
        prevPageURL: "/wallet",
        totalBalance: this.keyStr("Total Balance")
      });
      console.log(this.$store.state);
    },
    keyStr(key) {
      return this.$csvHandler(this.content.body, key);
    },
    async onSubmit(event) {
      event.preventDefault();
      // TODO: update value to fetch
      console.log("onSubmit", this.amount);
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

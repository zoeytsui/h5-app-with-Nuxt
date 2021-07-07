<template>
  <div class="container withdrawal">

    <span class="span-box">{{currency_name}}</span>

    <hr>

    <b-form @submit="onSubmit">
      <div class="main">

        <p>{{keyStr("Recipient's Address")}}</p>
        <div class="input-group">
          <b-form-input v-model="address" :placeholder="keyStr('Address')"></b-form-input>
          <div class="input-group-append">
            <span class="input-group-text text-light bg-transparent border-0 pt-0 align-middle"><img src="~/assets/wallet/qr-code.png"></span>
          </div>
        </div>

        <p>{{keyStr("Withdrawal Amount")}}</p>
        <div class="input-group">
          <b-form-input v-model="amount" :placeholder="keyStr('Amount')"></b-form-input>
          <div class="input-group-append">
            <span class="input-group-text text-light bg-transparent border-0">{{currency_name}}</span>
          </div>
        </div>
      </div>

      <hr>

      <div class="d-flex align-items-center justify-content-between">
        <p>{{keyStr("Transaction fee")}}</p>
        <p>
          <span>{{transactionFee}}</span>
          <span>{{deal_type}}</span>
        </p>
      </div>

      <hr>

      <div class="d-flex flex-column align-items-center justify-content-between">
        <p>{{keyStr("Actual withdrawal")}}</p>
        <h4>
          <span>{{actualWithdrawal}}</span>
          <span>{{deal_type}}</span>
        </h4>
      </div>

      <b-button type="submit" id="btn-export" class="btn my-3 w-100 text-light">{{keyStr('Withdrawal')}}</b-button>
    </b-form>
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
      fee: null,
      amount: null,
      address: null
    };
  },
  computed: {
    transactionFee() {
      return (this.amount * `${this.fee / 100}`).toFixed(3);
    },
    actualWithdrawal() {
      return this.amount - this.transactionFee;
    }
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
      s: "withdraw.get_deal_type",
      user: "",
      timestamp: "",
      token: ""
    });

    let get_deal_type = await this.$axios
      .$get("/api/?s=withdraw.get_deal_type", {
        params: {
          token: plugin_get_deal_type.token,
          user: plugin_get_deal_type.user,
          timestamp: plugin_get_deal_type.timestamp,
          sign: plugin_get_deal_type.sign
        }
      })
      .then(res => res.data.shift());

    // result
    console.log(get_deal_type);
    this.fee = get_deal_type.fee;
    this.deal_type = get_deal_type.deal_type;
    this.currency_name = get_deal_type.name;
    this.currency_decimal = get_deal_type.decimal;
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
  form {
    p {
      margin: 0;
    }
    .main {
      p {
        margin: 1rem 0;
      }
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
}
</style>

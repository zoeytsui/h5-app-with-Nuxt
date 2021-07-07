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

      <b-button type="submit" id="btn-export" :disabled="isDisabled" class="btn my-3 w-100 text-light">{{keyStr('Withdrawal')}}</b-button>
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
      // factor of ten, round to 3 decimal places
      const fac = Math.pow(10, 3);
      return Math.floor(this.amount * `${this.fee / 100}` * fac) / fac;
    },
    actualWithdrawal() {
      // factor of ten, round to 3 decimal places
      const fac = Math.pow(10, 3);
      return Math.floor((this.amount - this.transactionFee) * fac) / fac;
    },
    isDisabled() {
      return this.amount !== null ? false : true;
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
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- get_deal_type
    // http://showdoc.pubhx.com/index.php?s=/50&page_id=1216
    let get_deal_type_params = {
      s: "withdraw.get_deal_type",
      user: "app",
      login: this.$auth.$storage.getUniversal("login"),
      timestamp: Math.floor(Date.now() / 1000),
      token: this.$auth.$storage.getUniversal("token")
    };

    let get_deal_type_sign = await this.$axios.$post(
      "/lib/sign",
      get_deal_type_params
    );

    let get_deal_type = await this.$axios
      .$get("/api?", {
        params: { ...get_deal_type_params, ...get_deal_type_sign }
      })
      .then(res => res.data.shift());

    // result
    // console.log(get_deal_type);
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
      alert("loading");

      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- withdraw_index
      // http://showdoc.pubhx.com/index.php?s=/50&page_id=1217
      // TODO: GET callbackUrl from app
      let withdraw_index_params = {
        s: "withdraw.index",
        amount: this.amount,
        deal_type: this.deal_type,
        currency_name: this.currency_name,
        currency_decimal: this.currency_decimal,
        track: this.$genTrack(),
        fee: this.fee,
        miner_fee: "",
        remark: "",
        user: "app",
        login: this.$auth.$storage.getUniversal("login"),
        timestamp: Math.floor(Date.now() / 1000),
        token: this.$auth.$storage.getUniversal("token")
      };

      let withdraw_index_sign = await this.$axios.$post(
        "/lib/sign",
        withdraw_index_params
      );

      //TODO: test when balance enough
      let withdraw_index = await this.$axios
        .$get("/api?", {
          params: { ...withdraw_index_params, ...withdraw_index_sign }
        })
        .then(res => {
          console.log(res);
          alert(`api msg said: ${res.msg}`);
          this.$router.push({ path: "/wallet" });
        });
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

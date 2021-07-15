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

        <b-button type="submit" id="btn-export" :disabled="isDisabled" class="btn my-3 w-100 text-light">{{keyStr('confirm')}}</b-button>
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
      reback_sing: null
    };
  },
  computed: {
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
    // http://showdoc.pubhx.com/index.php?s=/50&page_id=1210
    try {
      let get_deal_type_params = {
        s: "deposit.get_deal_type",
        user: "ucenter",
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
        .then(res => {
          if (res.ret !== 200) {
            console.error(res.msg);
            return;
          }
          let result = res.data.shift();
          this.currency_name = result.name;
          this.deal_type = result.deal_type;
          this.currency_decimal = result.decimal;
        })
        .catch(err => console.error(err));
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    updateState() {
      this.$store.commit("wallet/updateState", {
        currentPage: this.keyStr("deposit"),
        prevPageURL: "/wallet",
        totalBalance: this.keyStr("Total Balance")
      });
      // console.log(this.$store.state);
    },
    keyStr(key) {
      return this.$csvHandler(this.content.body, key);
    },
    async onSubmit(event) {
      event.preventDefault();
      if (this.amount <= 0) return;
      alert("loading");

      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- deposit_index
      // http://showdoc.pubhx.com/index.php?s=/50&page_id=1211
      // TODO: GET callbackUrl from app
      try {
        let deposit_index_params = {
          s: "deposit.index",
          amount: this.amount,
          display_type: "m",
          deal_type: this.deal_type,
          currency_name: this.currency_name,
          currency_decimal: this.currency_decimal,
          deposit_type: "egpay",
          track: this.$genTrack(),
          callbackUrl: "wait from app",
          remark: "",
          user: "ucenter",
          login: this.$auth.$storage.getUniversal("login"),
          timestamp: Math.floor(Date.now() / 1000),
          token: this.$auth.$storage.getUniversal("token")
        };

        let deposit_index_sign = await this.$axios.$post(
          "/lib/sign",
          deposit_index_params
        );
        let deposit_index = await this.$axios
          .$get("/api?", {
            params: { ...deposit_index_params, ...deposit_index_sign }
          })
          .then(res => {
            if (res.ret !== 200) {
              console.error(res.msg);
              return;
            }
            return res.data;
          })
          .catch(err => {
            console.error(err);
          });

        // console.log(deposit_index);

        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- EGPay
        // TODO: GET result from EGPay
        // let goEGPay = await this.$axios
        //   .$get(deposit_index.url, deposit_index.form)
        //   .then(res => res.data);

        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- deposit_callbackurl
        // http://showdoc.pubhx.com/index.php?s=/50&page_id=1212
        // TODO: update data from EGPay
        let deposit_callbackurl_params = {
          s: "deposit.callbackurl",
          encryptedText: "wait to update",
          signedText: "wait to update",
          reback_sing: deposit_index.reback_sing,
          user: "ucenter",
          timestamp: Math.floor(Date.now() / 1000),
          token: this.$auth.$storage.getUniversal("token")
        };

        let deposit_callbackurl_sign = await this.$axios.$post(
          "/lib/sign",
          deposit_callbackurl_params
        );

        // TODO: test again when EGPay network working
        let deposit_callbackurl = await this.$axios
          .$get("/api?", {
            params: {
              ...deposit_callbackurl_params,
              ...deposit_callbackurl_sign
            }
          })
          .then(res => {
            console.log(res);
            alert(`${this.amount} deposit request send!`);
            this.$router.push({ path: "/wallet" });
          })
          .catch(err => {
            console.error(err);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$border-color: #25d6cd54;
.deposit {
  width: 90%;
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

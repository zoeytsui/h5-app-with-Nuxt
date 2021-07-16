<template>
  <div class="container withdrawal">

    <span class="span-box">{{currency_name}}</span>

    <hr>

    <b-form @submit="onSubmit">
      <div class="main">

        <p>{{keyStr("Recipient's Address")}}</p>
        <div class="input-group">
          <b-form-input v-model="address" :placeholder="keyStr('Address')"></b-form-input>
          <div class="input-group-text text-light bg-transparent border-0 pt-0 align-middle">
            <label for="file-input">
              <img src="~/assets/wallet/qr-code.png">
            </label>
            <!-- FIXME: dev use -->
            <b-form-file v-model="QRCodePic" type="file" accept="image/*" id="file-input" capture plain></b-form-file>
            <!-- <b-form-file v-model="QRCodePic" type="file" accept="image/*" id="file-input" style="display: none;" capture plain></b-form-file> -->
          </div>
        </div>

        <p>{{keyStr("Withdrawal Amount")}}</p>
        <div class="input-group">
          <b-form-input v-model="amount" type="number" :placeholder="keyStr('Amount')"></b-form-input>
          <div class="input-group-append">
            <span class="input-group-text text-light bg-transparent border-0">{{deal_type}}</span>
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

      <div id="reader" width="600px"></div>

      <b-button type="submit" id="btn-export" :disabled="isDisabled" class="btn my-3 w-100 text-light">{{keyStr('Withdrawal')}}</b-button>
    </b-form>

    <b-modal v-model="modalShow" id="withdrawal-completed-modal" :ok-title="keyStr('Back to my Wallet')" @ok="$router.push({ path: '/wallet' })" centered hide-header ok-only>
      <p class="my-4">{{keyStr('Withdrawal Completed')}}</p>
      <p>{{order}}</p>
    </b-modal>

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
      address: null,
      QRCodePic: null,
      order: null,
      modalShow: false
    };
  },
  watch: {
    QRCodePic() {
      try {
        // FIXME: dev use: should not display reader 
        const html5Qrcode = new Html5Qrcode("reader");
        html5Qrcode.scanFile(this.QRCodePic, true).then(decodedText => {
          this.address = decodedText;
        });
      } catch (error) {
        console.error(error);
      }
    }
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

    // if not set fund password go back to app
    if (process.browser && !this.$store.state.wallet.userInfo.isSetFundPass) {
      window.location.href = "x60://set_fund_password_page";
    }
  },
  async fetch() {
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- get_deal_type
    // http://showdoc.pubhx.com/index.php?s=/50&page_id=1216
    try {
      let get_deal_type_params = {
        s: "withdraw.get_deal_type",
        user: "ucenter",
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
        .then(res => {
          if (res.ret !== 200) {
            console.error(res.msg);
            return;
          }
          let result = res.data.shift();
          this.fee = result.fee;
          this.deal_type = result.deal_type;
          this.currency_name = result.name;
          this.currency_decimal = result.decimal;
        });
    } catch (error) {
      console.error(error);
    }
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
        user: "ucenter",
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
          if (res.ret !== 200) {
            alert(`api msg said: ${res.msg}`);
            return;
          }
          this.order = res.data.order;
          window.location.href = "x60://check_fund_password_page";
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.withdrawal {
  color: #fff;
  width: 90%;
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

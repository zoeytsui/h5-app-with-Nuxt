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
            <b-form-file v-model="QRCodePic" type="file" accept="image/*" id="file-input" style="display: none;" capture plain></b-form-file>
          </div>
        </div>

        <p>{{keyStr("Withdrawal Amount")}}</p>
        <div class="input-group">
          <b-form-input v-model="amount" type="number" :placeholder="keyStr('Amount')"></b-form-input>
          <!-- <b-form-invalid-feedback :state="validation">please input number</b-form-invalid-feedback> -->
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

    <b-modal v-model="withdrawal_completed_modal" id="withdrawal_completed_modal" content-class="correct_modal" :ok-title="keyStr('Back to my Wallet')" @ok="$router.push({ path: '/wallet' })" centered hide-header ok-only>
      <p class="my-4">{{keyStr('Withdrawal Completed')}}</p>
      <p><small>{{order}}</small></p>
    </b-modal>

    <b-modal v-model="withdrawal_fail_modal" if="withdrawal_fail_modal" content-class="error_modal" :ok-title="keyStr('Logout')" @ok="userLogout" centered hide-header>
      <p class="mt-4">{{keyStr('Withdrawal Fail')}}</p>
      <p><small>{{keyStr('Please try again later')}}</small></p>
    </b-modal>

    <b-modal v-model="forbidden_modal" content-class="error_modal" :ok-title="keyStr('Logout')" @ok="userLogout" centered hide-header>
      <p class="mt-4">{{keyStr('Action is forbidded')}}</p>
      <p><small>{{keyStr('Suspicious activity has been detected')}}</small></p>
    </b-modal>


    <b-modal v-model="insufficient_modal" content-class="warn_modal" centered hide-header ok-only>
      <p class="mt-4">{{keyStr('Insufficient fund')}}</p>
      <p><small>{{keyStr('Not enough fund to withdraw')}}</small></p>
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
      forbidden_modal: false,
      insufficient_modal: false,
      withdrawal_fail_modal: false,
      withdrawal_completed_modal: false,
    };
  },
  watch: {
    QRCodePic() {
      try {
        const html5Qrcode = new Html5Qrcode("reader");
        html5Qrcode.scanFile(this.QRCodePic, false).then(decodedText => {
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
    },
    isSetFundPass() {
      return this.$store.state.wallet.userInfo.isSetFundPass;
    }
  },
  async asyncData(context) {
    const content = await context.$content("wallet").fetch();
    return { content };
  },
  created() {
    // if not set fund password go back to app
    setTimeout(() => {
      if (process.client && !this.isSetFundPass) {
        window.location.href = "x60://set_fund_password_page";
      }
    }, 500);
    this.updateState();
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
            console.error(`${res.ret}: ${res.msg}`);
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
        .then(async res => {
          if (res.ret === 400) {
            this.insufficient_modal = true;
            return;
          }
          if (res.ret === 2206) {
            this.forbidden_modal = true;
            return;
          }
          if (res.ret !== 200) {
            this.withdrawal_fail_modal = true;
            return;
          }
          await (this.order = res.data.order);
          // this.withdrawal_completed_modal = true;
          window.location.href = "x60://check_fund_password_page";
        });
    },
    async userLogout() {
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- members_logout
      // http://showdoc.pubhx.com/index.php?s=/50&page_id=1196
      try {
        let members_logout_params = {
          s: "members.logout",
          user: "ucenter",
          login: this.$auth.$storage.getUniversal("login"),
          timestamp: Math.floor(Date.now() / 1000),
          token: this.$auth.$storage.getUniversal("token")
        };

        let members_logout_sign = await this.$axios.$post(
          "/lib/sign",
          members_logout_params
        );
        let members_logout = await this.$axios
          .$get("/api?", {
            params: { ...members_logout_params, ...members_logout_sign }
          })
          .then(res => {
            if (res.ret !== 200) {
              console.error(`${res.ret}: ${res.msg}`);
              return;
            }
            return console.warn("Logout:" + res.data);
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

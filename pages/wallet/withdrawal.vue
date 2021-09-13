<template>
  <section class="container withdrawal">

    <span class="span-box">{{get_deal_type.name}}</span>

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
          <b-form-input v-model="amount" type="number" pattern="[0-9]*" step="any" :placeholder="keyStr('Amount')" :oninput="`javascript: if (this.value.indexOf('.') >= 0) { this.value = (this.value.substr(0, this.value.indexOf('.')) + this.value.substr(this.value.indexOf('.'), 9))}`"></b-form-input>
          <div class="input-group-append">
            <span class="input-group-text text-light bg-transparent border-0">{{get_deal_type.deal_type}}</span>
          </div>
        </div>
      </div>

      <hr>

      <div class="d-flex align-items-center justify-content-between">
        <p>{{keyStr("Transaction fee")}}</p>
        <p>
          <span>{{transactionFee}}</span>
          <span>{{get_deal_type.deal_type}}</span>
        </p>
      </div>

      <hr>

      <div class="d-flex flex-column align-items-center justify-content-between">
        <p>{{keyStr("Actual withdrawal")}}</p>
        <h4>
          <span>{{actualWithdrawal}}</span>
          <span>{{get_deal_type.deal_type}}</span>
        </h4>
      </div>

      <div id="reader" width="600px"></div>

      <b-button type="submit" id="btn-export" :disabled="isDisabled" class="btn my-3 w-100 text-light">{{keyStr('Withdrawal')}}</b-button>
    </b-form>

    <b-modal v-model="withdrawal_completed_modal" id="withdrawal_completed_modal" content-class="correct_modal" :ok-title="keyStr('Back to my Wallet')" @ok="$router.push({ path: '/wallet' })" centered hide-header ok-only>
      <p class="my-4">{{keyStr('Withdrawal Completed')}}</p>
      <p><small>{{$auth.$storage.getUniversal("order")}}</small></p>
    </b-modal>

    <b-modal v-model="withdrawal_fail_modal" id="withdrawal_fail_modal" content-class="error_modal" centered hide-header ok-only>
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

  </section>
</template>

<script>
export default {
  layout: "wallet",
  data() {
    return {
      track: null,
      amount: null,
      address: null,
      QRCodePic: null,
      forbidden_modal: false,
      insufficient_modal: false,
      withdrawal_fail_modal: false,
      withdrawal_completed_modal: false
    };
  },
  watch: {
    QRCodePic() {
      try {
        const html5Qrcode = new Html5Qrcode("reader");
        html5Qrcode.scanFile(this.QRCodePic, false).then(decodedText => this.address = decodedText);
      } catch (error) {
        console.error(error);
      }
    }
  },
  computed: {
    transactionFee() {
      if (this.amount <= 0) return 0;
      // factor of ten, round to 3 decimal places
      const fac = Math.pow(10, 3);
      return this.get_deal_type.w_type === "percentage"
        ? Math.floor(this.amount * `${this.get_deal_type.fee / 100}` * fac) / fac
        : this.get_deal_type.fee;
    },
    actualWithdrawal() {
      if (this.amount <= 0) return 0;
      // factor of ten, round to 3 decimal places
      const fac = Math.pow(10, 3);
      return Math.floor((this.amount - this.transactionFee) * fac) / fac;
    },
    isDisabled() {
      return this.amount !== null && this.amount >= 0 && this.amount !== '' && this.address !== null && this.address !== '' ? false : true;
    }
  },
  async asyncData(context) {
    try {
      const content = await context.$content("wallet").fetch();

      let queryStr = context.query;
      switch (true) {
        // senario 1: query string exsited
        case Boolean(queryStr.token):
          context.$auth.$storage.setUniversal("token", queryStr.token);

        case Boolean(queryStr.login):
          context.$auth.$storage.setUniversal("login", queryStr.login);
          break;
      }

      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- get_deal_type
      // http://showdoc.pubhx.com/index.php?s=/50&page_id=1216
      let get_deal_type_params = {
        s: "withdraw.get_deal_type",
        user: "ucenter",
        login: context.$auth.$storage.getUniversal("login"),
        timestamp: Math.floor(Date.now() / 1000),
        token: context.$auth.$storage.getUniversal("token")
      };

      let get_deal_type_sign = await context.$axios.$post("/lib/sign", get_deal_type_params);

      let get_deal_type = await context.$axios
        .$get("/api?", { params: { ...get_deal_type_params, ...get_deal_type_sign } })
        .then(res => {
          if (res.ret !== 200) { console.error(`${res.ret}: ${res.msg}`); return; };
          let result = res.data.shift();
          return result;
        }).catch(err => console.error(err));

      return { content, get_deal_type };

    } catch (error) {
      console.error(error);
    }
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
      return this.$csvHandler(this.content.body, key);
    },
    async onSubmit(event) {
      event.preventDefault();
      if (this.amount <= 0) return;

      try {
        this.track = this.$genTrack();
        this.$auth.$storage.setUniversal("track", this.track);
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- withdraw_index
        // http://showdoc.pubhx.com/index.php?s=/50&page_id=1217
        let withdraw_index_params = {
          s: "withdraw.index",
          amount: this.amount,
          deal_type: this.get_deal_type.deal_type,
          currency_name: this.get_deal_type.name,
          currency_decimal: this.get_deal_type.decimal,
          track: this.$auth.$storage.getUniversal("track"),
          fee: this.transactionFee,
          wallet_address: this.address,
          miner_fee: "",
          remark: "",
          user: "ucenter",
          login: this.$auth.$storage.getUniversal("login"),
          timestamp: Math.floor(Date.now() / 1000),
          token: this.$auth.$storage.getUniversal("token")
        };

        let withdraw_index_sign = await this.$axios.$post("/lib/sign", withdraw_index_params);

        window.location.href = `x60://check_fund_password_page?parameter="?${this.$objectToQueryString({ ...withdraw_index_params, ...withdraw_index_sign })}"`;
        // let withdraw_index = await this.$axios
        //   .$get("/api?", { params: { ...withdraw_index_params, ...withdraw_index_sign } })
        //   .then(async res => {
        //     if (res.ret === 400) return this.insufficient_modal = true;
        //     if (res.ret === 2206) return this.forbidden_modal = true;
        //     if (res.ret !== 200) return this.withdrawal_fail_modal = true;

        //     // this.withdrawal_completed_modal = true;
        //     this.$auth.$storage.setUniversal("order", res.data.order);
        //     this.$store.commit("wallet/updateUserInfo", { balance: res.data.balance });
        //     window.location.href = "x60://check_fund_password_page";
        //   });
      } catch (error) {
        console.error(error);
      }
    },
    async userLogout() {
      this.$store.dispatch("wallet/userLogout");
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

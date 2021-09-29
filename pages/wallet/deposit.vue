<template>
  <section class="container deposit">

    <span class="span-box">{{get_deal_type.name}}</span>

    <hr>

    <div class="main">
      <p>{{keyStr('Deposit Amount')}}</p>
      <b-form @submit="onSubmit">
        <div class="input-group">
          <b-form-input v-model="amount" type="number" pattern="[0-9]*" step="any" :placeholder="keyStr('Amount')" :oninput="`javascript: if (this.value.indexOf('.') >= 0) { this.value = (this.value.substr(0, this.value.indexOf('.')) + this.value.substr(this.value.indexOf('.'), 9))}`"></b-form-input>
          <span class="input-group-text text-light bg-transparent border-0">{{ get_deal_type.deal_type }}</span>
        </div>

        <b-button type="submit" id="btn-export" :disabled="isDisabled" class="btn my-3 w-100 text-light">{{keyStr('confirm')}}</b-button>
      </b-form>
    </div>

    <b-modal v-model="deposit_completed_modal" id="deposit_completed_modal" content-class="correct_modal" @ok="$router.push({ path: '/wallet' })" centered hide-header ok-only>
      <p class="my-4">{{keyStr('Deposit Completed')}}</p>
      <p><small>{{$auth.$storage.getUniversal("order")}}</small></p>
    </b-modal>

    <b-modal v-model="forbidden_modal" content-class="error_modal" :ok-title="keyStr('Logout')" @ok="userLogout" centered hide-header>
      <p class="mt-4">{{keyStr('Action is forbidded')}}</p>
      <p><small>{{keyStr('Suspicious activity has been detected')}}</small></p>
    </b-modal>

    <b-modal v-model="deposit_fail_modal" content-class="warn_modal" centered hide-header ok-only>
      <p class="mt-4">{{keyStr('Deposit Fail')}}</p>
      <p><small>{{keyStr('Please try again later')}}</small></p>
    </b-modal>

  </section>
</template>

<script>
export default {
  layout: "wallet",
  data() {
    return {
      amount: null,
      forbidden_modal: false,
      deposit_fail_modal: false,
      deposit_completed_modal: false,
      egPayPage: null
    };
  },
  computed: {
    isDisabled() {
      return this.amount !== null && this.amount >= 0 ? false : true;
    },
  },
  watch: {
    amount() {
      return this.amount = this.amount.replace(/^00+/, '')
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
      // http://showdoc.pubhx.com/index.php?s=/50&page_id=1210

      let get_deal_type_params = {
        s: "deposit.get_deal_type",
        user: "ucenter",
        timestamp: Math.floor(Date.now() / 1000),
        token: context.$auth.$storage.getUniversal("token")
      };

      let get_deal_type_sign = await context.$axios.$post("/lib/sign", get_deal_type_params);

      let get_deal_type = await context.$axios
        .$get("/api?", { params: { ...get_deal_type_params, ...get_deal_type_sign } })
        .then(res => {
          if (res.ret !== 200) console.error(`${res.ret}: ${res.msg}`);
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
    if (this.$auth.$storage.getUniversal("post_request")) this.updateDeposit();
  },
  methods: {
    updateState() {
      this.$store.commit("wallet/updateState", {
        currentPage: this.keyStr("deposit"),
        prevPageURL: "/wallet",
        totalBalance: this.keyStr("Total Balance")
      });
    },
    decimalCount(num) {
      // Convert to String
      const numStr = String(num);
      // String Contains Decimal
      if (numStr.includes('.')) {
        return numStr.split('.')[1].length;
      };
      // String Does Not Contain Decimal
      return 0;
    },
    keyStr(key) {
      return this.$csvHandler(this.content.body, key);
    },
    async onSubmit(event) {
      event.preventDefault();
      if (this.amount <= 0) return;

      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- deposit_index
      // http://showdoc.pubhx.com/index.php?s=/50&page_id=1211
      try {
        this.track = this.$genTrack();
        this.$auth.$storage.setUniversal("track", this.track);
        let deposit_index_params = {
          s: "deposit.index",
          amount: this.amount,
          display_type: "m",
          deal_type: this.get_deal_type.deal_type,
          currency_name: this.get_deal_type.name,
          currency_decimal: this.get_deal_type.decimal,
          deposit_type: "egpay",
          track: this.$auth.$storage.getUniversal("track"),
          callbackurl: `${window.location.origin}/lib/deposit?`,
          remark: "",
          user: "ucenter",
          login: this.$auth.$storage.getUniversal("login"),
          timestamp: Math.floor(Date.now() / 1000),
          token: this.$auth.$storage.getUniversal("token")
        };

        let deposit_index_sign = await this.$axios.$post("/lib/sign", deposit_index_params);

        let deposit_index = await this.$axios
          .$get("/api?", { params: { ...deposit_index_params, ...deposit_index_sign } })
          .then(res => {
            if (res.ret === 2206) { this.forbidden_modal = true; return; }
            if (res.ret !== 200) { this.deposit_fail_modal = true; console.error(`${res.ret}: ${res.msg}`); return; }
            this.$auth.$storage.setUniversal("reback_sing", res.data.reback_sing);
            this.$auth.$storage.setUniversal("order", res.data.order);
            return res.data;
          })
          .catch(err => {
            console.error(err);
          });

        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- EGPay
        function postForm(path, params, method = "post") {
          const form = document.createElement("form");
          form.method = method;
          form.action = path;

          for (const key in params) {
            if (params.hasOwnProperty(key)) {
              const hiddenField = document.createElement("input");
              hiddenField.type = "hidden";
              hiddenField.name = key;
              hiddenField.value = params[key];

              form.appendChild(hiddenField);
            }
          }

          document.body.appendChild(form);
          form.submit();
        }

        postForm(deposit_index.url, deposit_index.form);

        this.$auth.$storage.setUniversal("post_request", true);
      } catch (error) {
        console.error(error);
      }
    },
    async updateDeposit() {
      try {
        if (process.client) {
          let dataFromEGPay = await this.$axios.$get("/lib/deposit_data").then(res => {
            if (!res.data) return;
            return res.data;
          }).catch(err => console.error(err));

          // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- deposit_callbackurl
          // http://showdoc.pubhx.com/index.php?s=/50&page_id=1212
          let deposit_callbackurl_params = {
            s: "deposit.callbackurl",
            encryptedText: dataFromEGPay.encryptedText,
            signedText: dataFromEGPay.signedText,
            reback_sing: this.$auth.$storage.getUniversal("reback_sing"),
            user: "ucenter",
            timestamp: Math.floor(Date.now() / 1000),
            token: this.$auth.$storage.getUniversal("token")
          };

          let deposit_callbackurl_sign = await this.$axios.$post("/lib/sign", deposit_callbackurl_params);

          let deposit_callbackurl = await this.$axios
            .$get("/api?", { params: { ...deposit_callbackurl_params, ...deposit_callbackurl_sign } })
            .then(res => {
              if (res.ret !== 200) {
                this.deposit_fail_modal = true;
                console.error(`${res.ret}: ${res.msg}`);
                this.$auth.$storage.setUniversal("post_request", false);
                return;
              }
              this.$store.commit("wallet/updateUserInfo", { balance: res.data.balance });
              this.deposit_completed_modal = true;
              this.$auth.$storage.setUniversal("post_request", false);
            }).catch(err => console.error(err));
        }
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

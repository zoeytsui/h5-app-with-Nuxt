<template>
  <div class="container deposit">

    <object v-if="egPayPage !== null" :data="egPayPage"></object>

    <span class="span-box">{{currency_name}}</span>

    <hr>

    <div class="main">
      <p>{{keyStr('Deposit Amount')}}</p>
      <b-form @submit="onSubmit">
        <div class="input-group">
          <b-form-input v-model="amount" type="number" :placeholder="keyStr('Amount')" aria-label="Amount (to the nearest dollar)"></b-form-input>
          <span class="input-group-text text-light bg-transparent border-0">{{ deal_type }}</span>
        </div>

        <b-button type="submit" id="btn-export" :disabled="isDisabled" class="btn my-3 w-100 text-light">{{keyStr('confirm')}}</b-button>
      </b-form>
    </div>

    <b-modal v-model="deposit_completed_modal" id="deposit_completed_modal" content-class="correct-modal" @ok="$router.push({ path: '/wallet' })" centered hide-header ok-only>
      <p class="my-4">{{keyStr('Deposit Completed')}}</p>
      <p><small>{{order}}</small></p>
    </b-modal>

    <b-modal v-model="forbidden_modal" content-class="error_modal" :ok-title="keyStr('Logout')" @ok="userLogout" centered hide-header>
      <p class="mt-4">{{keyStr('Action is forbidded')}}</p>
      <p><small>{{keyStr('Suspicious activity has been detected')}}</small></p>
    </b-modal>

    <b-modal v-model="deposit_fail_modal" content-class="warn_modal" centered hide-header ok-only>
      <p class="mt-4">{{keyStr('Deposit Fail')}}</p>
      <p><small>{{keyStr('Please try again later')}}</small></p>
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
      amount: null,
      order: null,
      signedText: null,
      reback_sing: null,
      encryptedText: null,
      forbidden_modal: false,
      deposit_fail_modal: false,
      deposit_completed_modal: false,
      egPayPage: null
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
            console.error(`${res.ret}: ${res.msg}`);
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
    },
    keyStr(key) {
      return this.$csvHandler(this.content.body, key);
    },
    async onSubmit(event) {
      event.preventDefault();
      if (this.amount <= 0) return;

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
          callbackurl: `${window.location.href}`,
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
            if (res.ret === 2206) {
              this.forbidden_modal = true;
              return;
            }
            if (res.ret !== 200) {
              this.fail_modal = true;
              return;
            }
            this.reback_sing = res.data.reback_sing;
            this.encryptedText = res.data.form.encryptedText;
            this.signedText = res.data.form.signedText;
            return res.data;
          })
          .catch(err => {
            console.error(err);
          });

        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- EGPay
        console.log(deposit_index);
        // this.egPayPage = deposit_index.form;
        // const axios = require("axios");

        // let data = new FormData();
        // for (const [key, value] of Object.entries(deposit_index.form)) {
        //   data.append(key, value)
        // };

        // let goEGPay = await axios({
        //   method: "post",
        //   url: deposit_index.url,
        //   crossdomain: true,
        //   data: data
        // // }).then(res => (this.egPayPage = res.data));
        // }).then(res => {console.log(res); return res;});
        // window.location.href = goEGPay.request.responseURL;

        function post(path, params, method = "post") {
          // The rest of this code assumes you are not using a library.
          // It can be made less verbose if you use one.
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

        // post(deposit_index.url, deposit_index.form);

        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- deposit_callbackurl
        // http://showdoc.pubhx.com/index.php?s=/50&page_id=1212
        // TODO: update data from EGPay
        // let deposit_callbackurl_params = {
        //   s: "deposit.callbackurl",
        //   encryptedText: "wait to update",
        //   signedText: "wait to update",
        //   reback_sing: this.reback_sing,
        //   user: "ucenter",
        //   timestamp: Math.floor(Date.now() / 1000),
        //   token: this.$auth.$storage.getUniversal("token")
        // };

        // let deposit_callbackurl_sign = await this.$axios.$post(
        //   "/lib/sign",
        //   deposit_callbackurl_params
        // );

        // // TODO: test again when EGPay network working
        // let deposit_callbackurl = await this.$axios
        //   .$get("/api?", {
        //     params: {
        //       ...deposit_callbackurl_params,
        //       ...deposit_callbackurl_sign
        //     }
        //   })
        //   .then(res => {
        //     console.log(res);
        //     // alert(`${this.amount} deposit request send!`);
        //     // this.$router.push({ path: "/wallet" });
        //   })
        //   .catch(err => {
        //     console.error(err);
        //   });
      } catch (error) {
        console.error(error);
      }
    },
    async userLogout() {
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- members_logout
      // http://showdoc.pubhx.com/index.php?s=/50&page_id=1196
      // TODO: GET callbackUrl from app
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
  // .modal-footer{
  //   button:nth-child(1){
  //     @include button-grey;
  //   }
  // }
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

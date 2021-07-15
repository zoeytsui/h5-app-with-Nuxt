
<template>
  <div class="totalbalance pt-3">
    <h6>{{ `${totalBalance}:` }}</h6>
    <h1>{{ balance }}</h1>
    <h6>{{ currency }}</h6>
  </div>
</template>

<script>
export default {
  props: {
    totalBalance: String
  },
  computed: {
    isSetFundPass() {
      return this.$store.state.wallet.userInfo.isSetFundPass;
    },
    currency() {
      return this.$store.state.wallet.userInfo.currency;
    },
    balance() {
      return this.$numFormatter(this.$store.state.wallet.userInfo.balance);
    }
  },
  created() {
    this.getQueryStr();
  },
  methods: {
    async getQueryStr() {
      let queryStr = this.$nuxt.context.query;

      switch (true) {
        // senario 1: query string exsited
        case Boolean(queryStr.token):
          this.$auth.$storage.setUniversal("token", queryStr.token);

        case Boolean(queryStr.login):
          this.$auth.$storage.setUniversal("login", queryStr.login);
          break;

        // senario 2: query string not exsited
        case !queryStr.token:
          this.$auth.$storage.getUniversal("token") !== undefined
            ? (this.token = this.$auth.$storage.getUniversal("token"))
            : console.error("token - Query String required");

        case !queryStr.login:
          this.$auth.$storage.getUniversal("login") !== undefined
            ? (this.login = this.$auth.$storage.getUniversal("login"))
            : console.error("login - Query String required");
          break;
      }
      this.getUserInfo();
    },
    async getUserInfo() {
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- getUserInfo
      // http://showdoc.pubhx.com/index.php?s=/50&page_id=1302
      try {
        let getUserInfo_params = {
          s: "members.getUserInfo",
          token: this.$auth.$storage.getUniversal("token"),
          login: this.$auth.$storage.getUniversal("login"),
          timestamp: Math.floor(Date.now() / 1000),
          user: "ucenter"
        };

        let getUserInfo_sign = await this.$axios.$post(
          "/lib/sign",
          getUserInfo_params
        );
        let getUserInfo = await this.$axios
          .$get("/api", {
            params: { ...getUserInfo_params, ...getUserInfo_sign }
          })
          .then(res => {
            if (res.ret !== 200) {
              console.error(res.msg);
              return;
            }
            this.$store.commit("wallet/updateUserInfo", {
              isSetFundPass: res.data.isSetFundPass,
              balance: Object.values(res.data.balance)[0],
              currency: Object.keys(res.data.balance)[0]
            });
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
.totalbalance {
  text-align: center;
  margin: 0 auto;
  color: #fff;
  width: 80%;
  h1 {
    color: #2beae2;
    font-weight: 600;
    font-family: Helvetica;
  }
}
</style>
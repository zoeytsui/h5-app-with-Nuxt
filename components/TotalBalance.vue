
<template>
  <div class="totalbalance pt-3 text-center text-white text-break">
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
    currency() {
      return this.$store.state.wallet.userInfo.currency;
    },
    balance() {
      return this.$thousandsSeparator(this.$store.state.wallet.userInfo.balance);
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
      this.$store.dispatch("wallet/getUserInfo");
    }
  }
};
</script>

<style lang="scss" scoped>
.totalbalance {
  background: transparent;
  h1 {
    color: #2beae2;
    font-weight: 600;
  }
}
</style>
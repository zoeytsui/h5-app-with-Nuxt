
<template>
  <div class="totalbalance pt-3">
    <h6>{{ totalBalance }}</h6>
    <h2>{{ balance }}</h2>
    <h6>{{ currency }}</h6>
  </div>
</template>

<script>
export default {
  props: {
    totalBalance: String
  },
  data() {
    return {
      balance: null,
      currency: null
    };
  },
  created() {
    this.getLogin();
    // this.getToken();
  },
  methods: {
    getLogin() {
      let queryStr = this.$nuxt.context.query;
      if (!process.browser) return;
      switch (Object.keys(queryStr).length) {
        // senario 1: query string exsited
        case 4:
          this.$auth.$storage.setUniversal("token", queryStr.token);
          this.$auth.$storage.setUniversal("login", queryStr.login);
          this.$auth.$storage.setUniversal("balance", queryStr.balance);
          this.$auth.$storage.setUniversal("currency", queryStr.currency);
          this.balance = queryStr.balance;
          this.currency = queryStr.currency;
          break;
        // senario 2: query string not exsited
        case 0:
          this.$auth.$storage.getUniversal("balance") !== undefined
            ? (this.balance = this.$auth.$storage.getUniversal("balance"))
            : console.error("balance - Query String required");

          this.$auth.$storage.getUniversal("currency") !== undefined
            ? (this.currency = this.$auth.$storage.getUniversal("currency"))
            : console.error("currency - Query String required");

          this.$auth.$storage.getUniversal("login") !== undefined
            ? (this.login = this.$auth.$storage.getUniversal("login"))
            : console.error("login - Query String required");

          this.$auth.$storage.getUniversal("token") !== undefined
            ? (this.token = this.$auth.$storage.getUniversal("token"))
            : console.error("token - Query String required");
          break;
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
  h2 {
    color: #2beae2;
  }
}
</style>
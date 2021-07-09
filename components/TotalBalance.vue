
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
  data() {
    return {
      balance: null,
      currency: null
    };
  },
  created() {
    this.getLogin();
  },
  methods: {
    getLogin() {
      let queryStr = this.$nuxt.context.query;
      if (!process.browser) return;

      // switch (true) {
      //   case queryStr.token:
      //     this.$auth.$storage.setUniversal("token", queryStr.token);

      //   case queryStr.login:
      //     this.$auth.$storage.setUniversal("login", queryStr.login);

      //   case !queryStr.token:
      //     this.$auth.$storage.getUniversal("token") !== undefined
      //       ? (this.token = this.$auth.$storage.getUniversal("token"))
      //       : console.error("token - Query String required");

      //   case !queryStr.login:
      //     this.$auth.$storage.getUniversal("login") !== undefined
      //       ? (this.login = this.$auth.$storage.getUniversal("login"))
      //       : console.error("login - Query String required");
      // }

      // senario 1: query string exsited
      // console.log(!queryStr.token &&!queryStr.login);
      if (Object.keys(queryStr).length === 4) {
        this.$auth.$storage.setUniversal("token", queryStr.token);
        this.$auth.$storage.setUniversal("login", queryStr.login);
        this.$auth.$storage.setUniversal("balance", queryStr.balance);
        this.$auth.$storage.setUniversal("currency", queryStr.currency);
        this.balance = this.$numFormatter(queryStr.balance);;
        this.currency = queryStr.currency;
      }
      // senario 2: query string not exsited
      else if (Object.keys(queryStr).length !== 4) {
        this.$auth.$storage.getUniversal("balance") !== undefined
          ? (this.balance = this.$numFormatter(this.$auth.$storage.getUniversal("balance")))
          : console.error("balance - Query String required");

        this.$auth.$storage.getUniversal("currency") !== undefined
          ? (this.currency = this.$auth.$storage.getUniversal("currency"))
          : console.error("currency - Query String required");

        if (this.$auth.$storage.getUniversal("login") === undefined)
          console.error("login - Query String required");

        if (this.$auth.$storage.getUniversal("token") === undefined)
          console.error("token - Query String required");
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
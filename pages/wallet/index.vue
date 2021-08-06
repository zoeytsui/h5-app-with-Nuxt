<template>

  <b-list-group class="mr-auto ml-auto justify-content-between ">
    <b-list-group-item v-for="item,index in items" :key="index" @click="switchPage(item.page)" class="d-flex align-items-center justify-content-center border-right-0 border-left-0">
      <div class="container d-flex align-items-center px-0">
        <img :src="item.icon" class="icon mr-3" width="35px" />
        <p>{{item.name}}</p>
      </div>
      <img class="arrow" src="~assets/wallet/Arrow_Right_white.png">
    </b-list-group-item>
  </b-list-group>

</template>

<script>
export default {
  layout: "wallet",
  computed: {
    items() {
      return [
        {
          icon: require("@/assets/wallet/deposit.png"),
          name: this.keyStr("deposit"),
          page: "deposit"
        },
        {
          icon: require("@/assets/wallet/withdrawal.png"),
          name: this.keyStr("withdrawal"),
          page: "withdrawal"
        },
        {
          icon: require("@/assets/wallet/payment_history.png"),
          name: this.keyStr("payment history"),
          page: "payment_history"
        }
      ];
    },
    isSetFundPass() {
      return this.$store.state.wallet.userInfo.isSetFundPass;
    }
  },
  async asyncData(context) {
    const content = await context.$content("wallet").fetch();
    return { content };
  },
  async created() {
    this.updateState();
  },
  methods: {
    updateState() {
      this.$store.commit("wallet/updateState", {
        currentPage: this.keyStr("my wallet"),
        totalBalance: this.keyStr("Total Balance")
      });
    },
    keyStr(key) {
      return this.$csvHandler(this.content.body, key);
    },
    switchPage(page) {
      // if not set fund password go back to app
      if (event.target.innerText === 'Withdrawal' && !this.isSetFundPass) {
        return window.location.href = "x60://set_fund_password_page";
      }
      return this.$router.push({ path: `/wallet/${page}` });
    },
  }
};
</script>
<style lang="scss" scoped>
.list-group {
  width: 80%;
  .list-group-item {
    background: transparent;
    color: #fff;
    border-color: $border-color !important;
    p {
      font-size: 1rem;
      margin-bottom: 0;
    }
    .icon {
      width: 1.3rem;
    }
    .arrow {
      width: 0.4rem;
    }
  }
}
</style>

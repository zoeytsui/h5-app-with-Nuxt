<template>

  <b-list-group class="mr-auto ml-auto justify-content-between ">
    <b-list-group-item :href="route + item.page" v-for="item,index in items" :key="index" class="d-flex align-items-center justify-content-center border-right-0 border-left-0 px-0">
      <div class="container d-flex align-items-center">
        <img :src="item.icon" class="mr-3" width="35px" />
        <h5>{{item.name}}</h5>
      </div>
      <img src="~assets/wallet/Arrow_Right_white.png">
    </b-list-group-item>
  </b-list-group>

</template>

<script>
export default {
  layout: "wallet",
  data() {
    return {
      route: `${this.$route.path}/`,
      items: [
        {
          icon: require("@/assets/wallet/deposit.png"),
          name: undefined,
          page: "deposit"
        },
        {
          icon: require("@/assets/wallet/withdrawal.png"),
          name: undefined,
          page: "withdrawal"
        },
        {
          icon: require("@/assets/wallet/payment_history.png"),
          name: undefined,
          page: "payment_history"
        }
      ]
    };
  },
  async asyncData(context) {
    const content = await context.$content("wallet").fetch();
    return { content };
  },
  async created() {
    this.updateState();
    this.items[0].name = this.keyStr("deposit");
    this.items[1].name = this.keyStr("withdrawal");
    this.items[2].name = this.keyStr("payment history");
  },
  methods: {
    updateState() {
      this.$store.commit("wallet/updateState", {
        currentPage: this.keyStr("my wallet"),
        // FIXME: URL not updated from store to page
        prevPageURL: "x60://me_page",
        totalBalance: this.keyStr("Total Balance")
      });
    },
    keyStr(key) {
      return this.$csvHandler(this.content.body, key);
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
  }
}
</style>

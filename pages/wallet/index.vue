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
  async asyncData({ $content, app }) {
    const content = await $content("wallet").fetch();
    return { content, app };
  },
  async created() {
    this.updateString();
    this.items[0].name = this.transKey("deposit");
    this.items[1].name = this.transKey("withdrawal");
    this.items[2].name = this.transKey("payment_history");
  },
  methods: {
    updateString() {
      this.$store.commit("wallet/update", {
        currentPage: this.transKey("title"),
        prevPageURL: "../help-and-support",
        totalBalance: this.transKey("TOTAL_BALANCE")
      });
    },
    transKey(key) {
      return this.app.$contentHandler(this.content.body, key);
    }
  }
};
</script>
<style lang="scss" scoped>
.list-group {
  width: 80%;
  .list-group-item {
    background: transparent;
    color: #fff;
    border-color: #25d6cd54 !important;
  }
}

.table {
  width: 80%;
  margin: 2rem;
  color: #fff;
  tr {
    height: 4rem;
    border-top: $border !important;
    border-bottom: $border !important;
    text-decoration: none;
    a {
      color: #fff;
      text-decoration: none;
      td {
        vertical-align: middle !important;
        img {
          width: calc(100% * 0.82);
        }
      }
    }
  }
}
</style>

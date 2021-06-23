<template>
  <div>
    <TopBar :currentPage="contentHandler('TITLE')" :prevPageURL="prevPageURL" />

    <TotalBalance :languageInBalance="contentHandler('TOTAL_BALANCE')" />

    <template v-if="currentStatus === 'index'">
      <table class="table text-left align-middle table-borderless">
        <tr v-for="item,index in items" :key="index" v-on:click="changeTemplate(item.state)">
          <!-- <a :href="item.url"> -->
          <td width="20%"><img :src="item.icon"></td>
          <td width="70%"> {{item.name}}</td>
          <td width="10%">{{item.arrow}}</td>
          <!-- </a> -->
        </tr>
      </table>
    </template>

    <template v-if="currentStatus === 'deposit'">
      <depositTemp></depositTemp>
    </template>

    <template v-if="currentStatus === 'withdrawal'">
      <h1>hihihihihihi withdrawal</h1>
    </template>

    <template v-if="currentStatus === 'paymentHistory'">
      <h1>hihihihihihi paymentHistory</h1>
    </template>

  </div>
</template>

<script>
import depositTemp from "./deposit.vue";
export default {
  data() {
    return {
      currentStatus: "index",
      // TODO: update url
      prevPageURL: "../help-and-support",
      items: [
        {
          icon: require("@/assets/wallet/deposit.png"),
          name: undefined,
          arrow: ">",
          state: "deposit"
        },
        {
          icon: require("@/assets/wallet/withdrawal.png"),
          name: undefined,
          arrow: ">",
          state: "withdrawal"
        },
        {
          icon: require("@/assets/wallet/payment_history.png"),
          name: undefined,
          arrow: ">",
          state: "paymentHistory"
        }
      ]
    };
  },
  components: { depositTemp },
  async asyncData({ $content, route, i18n }) {
    const lang = i18n.getLocaleCookie();
    const content = await $content("wallet").fetch();
    return { content, lang };
  },
  created() {
    this.items[0].name = this.contentHandler("DEPOSIT");
    this.items[1].name = this.contentHandler("WITHDRAWAL");
    this.items[2].name = this.contentHandler("PAYMENT_HISTORY");
  },
  methods: {
    contentHandler(keyStr) {
      const capitalLang = this.lang.toUpperCase();
      const keyArr = this.content.body;
      let ouputString;
      for (let i in keyArr) {
        keyArr[i].KEY === keyStr
          ? (ouputString = keyArr[i][`${capitalLang}`])
          : undefined;
      }
      return ouputString;
    },
    changeTemplate(temp) {
      return (this.currentStatus = temp);
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  width: 80%;
  margin: 2rem;
  color: #fff;
  tr {
    height: 4rem;
    border-top: $border !important;
    border-bottom: $border !important;
    td {
      vertical-align: middle !important;
      img {
        width: calc(100% * 0.82);
      }
    }
  }
}
</style>

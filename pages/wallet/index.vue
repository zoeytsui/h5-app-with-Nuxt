<template>
  <div>
    <TopBar :currentPage="contentHandler('TITLE')" :prevPageURL="prevPageURL" />

    <TotalBalance :languageInBalance="contentHandler('TOTAL_BALANCE')" />

    <b-list-group class="mr-auto ml-auto justify-content-between ">
        <b-list-group-item>
        </b-list-group-item>
    </b-list-group>
    <!-- <b-list-group class="mr-auto ml-auto justify-content-between ">
      <b-list-group-item v-bind:href="'wallet/' + links[index] " v-for="text,index in texts" :key="index" class="d-flex align-items-center justify-content-center border-right-0 border-left-0 px-0">
        <div class="container d-flex align-items-center">
          <img v-bind:src="require(`@/assets/${imgs[index]}`)" class="mr-3" width="35px" />
          <h4>{{ text }}</h4>
        </div>
        <img src="~assets/Arrow_Right_white.png">
      </b-list-group-item>
    </b-list-group> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // TODO: update url
      prevPageURL: "../help-and-support",
      page: {
        title: null,
        description: null
      },
      imgs: [],
      texts: [],
      links: []
    };
  },
  async asyncData({ $content, route, i18n }) {
    const lang = i18n.getLocaleCookie();
    const content = await $content("wallet").fetch();
    return { content, lang };
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
    }
  }
};
</script>
<style lang="scss" scoped>
$border-color: #25d6cd54;
h2 {
  font-weight: bold;
  font-size: 28px;
}
.list-group {
  width: 80%;
}
.list-group,
.list-group-item {
  background-color: transparent;
  color: #fff;
}
.list-group-item {
  border-color: $border-color !important;
}
</style>

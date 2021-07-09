<template>
  <div class="container-fluid">
    <nav class="navbar navbar-dark container-fluid">
      <n-link class="navbar-brand" id="prevPage" :to="prevPageURL">
        <img src="~assets/Arrow_l_blue.png" alt="">
        {{currentPage}}
      </n-link>
    </nav>
    <hr>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: String,
    prevPageURL: String
  },
  data() {
    return {
      back: null
    };
  },
  mounted() {
    if (this.currentPage === "My Wallet") {
      this.backApp();
    }
  },
  methods: {
    async backApp() {
      document.querySelector("#prevPage").setAttribute("href", "x60://me_page");
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  .navbar-brand {
    font-size: 1rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    img {
      width: 21px;
      height: 17px;
      margin-right: 0.4rem;
    }
  }
}
hr {
  border-color: $border-color;
  margin: 0 2rem;
}
</style>
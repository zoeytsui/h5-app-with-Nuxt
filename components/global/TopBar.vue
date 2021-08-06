<template>
  <div class="container-fluid">
    <nav class="navbar navbar-dark container-fluid" @click="switchPage">
      <img src="~assets/Arrow_l_blue.png" alt="">
      {{currentPage}}
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
  methods: {
    switchPage() {
      if (this.$route.path === "/wallet" || this.$route.path === "/help-and-support") {
        return window.location.href = "x60://back_to_page";
      }
      return this.$router.push({ path: `${this.prevPageURL}` });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  color: white;
  font-size: 1rem;
  display: flex;
  justify-content: flex-start;
  flex-flow: row nowrap;
  align-items: center;
  img {
    width: 21px;
    height: 17px;
    margin-right: 0.4rem;
  }
}
hr {
  border-color: $border-color;
  margin: 0 2rem;
}
</style>
<template>
  <div class="container-fluid">
    <nav class="navbar navbar-dark">
      <a class="navbar-brand" :href="prevPageURL">
        <img src="~assets/Arrow_l_blue.png" alt="">
        {{currentPage}}
      </a>
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
  // TODO: for dev use
  mounted() {
    console.log("currentPage", this.currentPage);
  }
};
</script>

<style lang="scss" scoped>
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
hr {
  border: $border;
  margin: 0 2rem;
}
</style>
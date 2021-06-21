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
  // TODO: only for dev use
  mounted() {
    console.log('currentPage', this.currentPage);
  }
};
</script>

<style lang="scss" scoped>
hr {
  border: 1px solid #2beae2;
  margin: 0 2rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}
img {
  vertical-align: text-top !important;
  display: inline !important;
  width: 31px;
  height: 26px;
}
</style>
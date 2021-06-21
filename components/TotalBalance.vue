
<template>
  <div class="totalbalance pt-3">
    <h4>{{ languageInBalance }}</h4>
    <h1>{{ balancedAmount }}</h1>
    <h4>{{ currency }}</h4>
  </div>
</template>

<script>
export default {
  props: {
    languageInBalance: String
  },
  data() {
    return {
      balancedAmount: "API.balance",
      currency: "API.currency"
    };
  },
  async fetch() {
    // TODO: finished balance API
  }
};
</script>

<style lang="scss" scoped>
.totalbalance {
  text-align: center;
  margin: 0 auto;
  color: #fff;
  width: 80%;
  border-top: 1px solid #25d6cd54;
}

h1 {
  color: #2beae2;
}
</style>
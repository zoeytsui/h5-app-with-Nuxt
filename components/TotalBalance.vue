
<template>
  <div class="totalbalance pt-3">
    <h6>{{ totalBalance }}</h6>
    <h2>{{ balancedAmount }}</h2>
    <h6>{{ currency }}</h6>
  </div>
</template>

<script>
export default {
  props: {
    totalBalance: String
  },
  data() {
    return {
      // FIXME:
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
  h2 {
    color: #2beae2;
  }
}
</style>
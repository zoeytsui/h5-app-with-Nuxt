<template>
  <div id="slug">
    <!-- <TopBar :currentPage="'depost'" :prevPageURL="prevPageURL" />

    <TotalBalance :languageInBalance="'TOTAL_BALANCE'" /> -->

    <div class="container border-bottom pb-2">
      <b-button type="button" class="btn">Currency(from API)</b-button>
    </div>
    <div class="main">
      <p>{{texts[0]}}</p>
      <div class="input-group">
        <input type="number" class="form-control rounded" aria-label="Amount (to the nearest dollar)">
        <div class="input-group-append">
          <span class="input-group-text text-light bg-transparent border-0">Currency(from API)</span>
        </div>
      </div>
      <div class="qrcode py-4">QR code</div>
      <p>{{texts[1]}}</p>
      <div class="input-group">
        <input type="number" class="form-control border-right-0" aria-label="Amount (to the nearest dollar)">
        <div class="input-group-append">
          <span class="input-group-text bg-white">copy img</span>
        </div>
      </div>

      <button type="button" id="btn-export" class="btn my-3 w-100 text-light">{{texts[2]}}</button>
    </div>
  </div>
</template>

<script>
export default {
  layout: "wallet",
  data() {
    return {
      texts: []
    };
  },
  async asyncData({ $content, app }) {
    const content = await $content("docs/deposit").fetch();
    return { content, app };
  },
  created() {
    // this.app.$contentHandler(this.content.body, "deposit");
    // this._contentHandler(this.content.body)
  },
  methods: {
    // async _contentHandler(keyArr) {
    //   console.log(keyArr);
    //   const capitalLang = this.lang.toUpperCase();
    //   for (let i in keyArr) {
    //     this.texts.push(keyArr[i][capitalLang]);
    //   }
    // }
  }
};
</script>
<style lang="scss" scoped>
$border-color: #25d6cd54;
#slug {
  color: #fff;
  .container {
    &.border-bottom {
      border-color: $border-color !important;
    }
    .btn {
      background-color: #2beae2;
      color: #000;
    }
  }
  #btn-export {
    background: linear-gradient(
      180deg,
      rgba(43, 234, 226, 1) 0%,
      rgba(43, 234, 226, 1) 15%,
      rgb(21, 112, 108) 100%
    );
    background-repeat: no-repeat;
  }

  // hide the arrows of input field
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>

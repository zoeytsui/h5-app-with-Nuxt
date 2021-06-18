<template>
    <section class="header d-flex align-items-center px-3 py-2 mb-4">
        <img src="~assets/Arrow_l_blue.png" alt="" height="50%" class="">
        <h4 class="">{{position}}</h4>
    </section>
</template>

<script>
export default {
    data() {
        return {
            position: "My Wallet", 
            //maybe save to store?
            //when click the menu pass the data to store and change the header?
        }
    },
}
</script>

<style lang="scss" scoped>
.header {
    color: #fff;
    height: 6%;
    box-sizing: content-box;
    box-shadow: 0px 44px 3px -41px #2beae2;
}
</style>
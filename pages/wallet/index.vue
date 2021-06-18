<template>
    <div id="slug">
        <b-list-group class="mr-auto ml-auto justify-content-between ">
            <b-list-group-item v-bind:href="'wallet/' + links[index] " v-for="text,index in texts" :key="index" class="d-flex align-items-center justify-content-center border-right-0 border-left-0 px-0">
                <div class="container d-flex align-items-center">
                    <img v-bind:src="require(`@/assets/${imgs[index]}`)" class="mr-3" width="35px" />
                    <h4>{{ text }}</h4>
                </div>
                <img src="~assets/Arrow_Right_white.png">
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
export default {
    layout: "myWallet",
    data() {
        return {
            imgs: [],
            texts: [],
            links: [],
        }
    },
    async asyncData({ $content, params, i18n }) {
        const lang = i18n.getLocaleCookie()
        const content = await $content("docs/wallet").fetch()
        return { content, lang }
    },
    created() {
        this._contentHandler(this.content.body)
    },
    methods: {
        async _contentHandler(keyArr) {
            console.log(keyArr)
            const capitalLang = this.lang.toUpperCase()
            for (let i in keyArr) {
                this.imgs.push(keyArr[i]["IMG"])
                this.texts.push(keyArr[i][capitalLang])
                this.links.push(keyArr[i]["LINK"])
            }
        },
    },
}
</script>
<style lang="scss" scoped>
$border-color: #25d6cd54;
#slug {
    margin-top: 2.5rem;
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
}
</style>

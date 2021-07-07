<template>
    <div>
        <b-container v-if="selectedData.total == 0 ">
            <b-row>
                <b-col>
                    NO Records
                </b-col>
            </b-row>
        </b-container>
        <b-container class="records" v-for="i in count" :key="i" v-else>
            <span v-for="(date , j) in Object.keys(selectedData.dateList[i-1].tenRecords)" :key="j">
                <b-row class="records-header">
                    <b-col sm="3" cols="3" v-html="selectedData.dateList[i-1].tenRecords[date].date"></b-col>
                    <b-col sm="4" cols="6" v-html="selectedData.dateList[i-1].tenRecords[date].records.length + ' Records'"></b-col>
                    <b-col sm="5" cols="3"></b-col>
                </b-row>
                <span v-for="(record , k) in selectedData.dateList[i-1].tenRecords[date].records" :key="k">
                    <b-row>
                        <b-col sm="3" cols="3" v-html="record.time"></b-col>
                        <b-col sm="4" cols="6" class="order-no" v-html="record.order"></b-col>
                        <b-col sm="5" cols="3" class="text-right amount" v-html="'+ ' + record.amount"></b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="3" cols="3"></b-col>
                        <b-col sm="4" cols="6">{{keyStr(record.status)}}</b-col>
                        <b-col sm="5" cols="3" class="text-right" v-html="record.currency"></b-col>
                    </b-row>
                </span>
            </span>
        </b-container>
    </div>
</template>

<script>
export default {
    props: {
        selectedData: {
            type: Object,
            required: true,
        },
        contents: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            count: 1,
            content: "",
        }
    },

    methods: {
        keyStr(key) {
            return this.$csvHandler(this.contents.body, key)
        },
    },
}
</script>

<style lang="scss" scoped>
.records {
    &-header {
        color: #2beae2;
        font-weight: bold;
        background-color: #273d4b;
    }
    span .row:nth-of-type(even) {
        background-color: #273d4b;
    }
    .order-no {
        word-wrap: break-word;
    }
    .amount {
        color: #60bc3f;
    }
}
</style>
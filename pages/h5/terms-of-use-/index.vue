<template>
  <div id="slug">
    <h2 class="text-center">{{ page.title }}</h2>
    <p class="text-right">{{ page.date }}</p>
    <ol class="list-group">
      <li v-for="question,index in page.list.questions" :key="index">{{ question }}
        <p>{{ page.list.answers[index] }}</p>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: {
        title: null,
        date: null,
        list: {
          questions: [],
          answers: []
        }
      }
    };
  },
  async asyncData({ $content, params, i18n }) {
    const lang = i18n.getLocaleCookie();
    const content = await $content("docs/terms-of-use").fetch();
    return { content, lang };
  },
  created() {
    this._contentHandler(this.content.body);
  },
  methods: {
    async _contentHandler(keyArr) {
      const capitalLang = this.lang.toUpperCase();
      for (let i in keyArr) {
        Object.keys(keyArr[i]).forEach(k => k.toUpperCase());
        let keyVal = keyArr[i].KEY;
        switch (true) {
          case keyVal === "TITLE":
            this.page.title = keyArr[i][`${capitalLang}`];
            break;
          case keyVal === "DATE":
            this.page.date = keyArr[i][`${capitalLang}`];
            break;
          case keyVal.includes("QUEST"): {
            this.page.list.questions.push(keyArr[i][`${capitalLang}`]);
            break;
          }
          case keyVal.includes("ANS"): {
            this.page.list.answers.push(keyArr[i][`${capitalLang}`]);
            break;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#slug {
  padding: 2rem;
  h2 {
    font-weight: bold;
    font-size: 28px;
  }
  ol {
    font-weight: bold;
    li {
      p {
        font-weight: normal;
        text-align: justify;
        margin-bottom: 20px;
      }
    }
  }
}
</style>

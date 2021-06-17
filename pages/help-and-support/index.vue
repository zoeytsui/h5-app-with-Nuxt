<template>
  <div id="slug" class="text-left">
    <h2>{{ page.title }}</h2>

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
        list: {
          questions: [],
          answers: []
        }
      }
    };
  },
  async asyncData({ $content, params, i18n, app }) {
    const lang = i18n.getLocaleCookie();
    const content = await $content("docs/help-and-support").fetch();
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
    counter-reset: quest;
    list-style: none;
    font-weight: bold;
  }
  li {
    counter-increment: quest;
    p{
      font-weight: normal;
    }
  }
  li::before {
    content: "Q" counter(quest) ": ";
  }
  p {
    margin-bottom: 20px;
  }
}
</style>

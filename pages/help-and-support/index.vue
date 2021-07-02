<template>
  <div>
    <TopBar :currentPage="page.title" :prevPageURL="prevPageURL" />

    <div id="help-and-support" class="text-left container">
      <h2>{{ page.description }}</h2>
      <ol class="list-group">
        <li v-for="question,index in page.list.questions" :key="index">{{ question }}
          <p>{{ page.list.answers[index] }}</p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prevPageURL: "x60://me_page",
      page: {
        title: null,
        description: null,
        list: {
          questions: [],
          answers: []
        }
      }
    };
  },
  async asyncData({ $content, i18n, route }) {
    const lang = i18n.getLocaleCookie();
    const content = await $content("docs", route.path).fetch();
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
          case keyVal === "DESCRIPTION":
            this.page.description = keyArr[i][`${capitalLang}`];
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
#help-and-support {
  padding: 2rem;
  background: border-box #f2f3f3;
  border-radius: 20px;
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
    p {
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
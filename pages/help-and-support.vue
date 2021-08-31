<template>
  <section>
    <TopBar :currentPage="page.title" />

    <div id="help-and-support" class="text-left container title_color">
      <h2>{{ page.description }}</h2>
      <ol class="list-group">
        <li v-for="question,index in page.list.questions" :key="index">{{ question }}
          <p class="content_color"><small>{{ page.list.answers[index] }}</small></p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script>
export default {
  async asyncData({ $content, i18n, route }) {
    try {

      const lang = i18n.locale.toUpperCase();
      const content = await (await $content("docs/help-and-support").fetch()).body;

      let page = {
        title: null,
        description: null,
        list: {
          questions: [],
          answers: []
        }
      };

      for (let i in content) {
        Object.keys(content[i]).forEach(k => k.toUpperCase());
        let keyVal = content[i].KEY;
        switch (true) {
          case keyVal === "TITLE":
            page.title = content[i][`${lang}`];
            break;
          case keyVal === "DESCRIPTION":
            page.description = content[i][`${lang}`];
            break;
          case keyVal.includes("QUEST"): {
            page.list.questions.push(content[i][`${lang}`]);
            break;
          }
          case keyVal.includes("ANS"): {
            page.list.answers.push(content[i][`${lang}`]);
            break;
          }
        }
      }

      return { page };

    } catch (error) { console.error(error) }
  },
};
</script>
<style lang="scss" scoped>
#help-and-support {
  padding: 2rem;
  background: border-box #fdfdfd;
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
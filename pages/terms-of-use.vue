<template>
  <section>
    <div id="terms-of-use" class="container title_color">
      <h2 class="text-center">{{ page.title }}</h2>
      <p class="text-right">{{ page.date }}</p>
      <ol class="list-group">
        <li v-for="question,index in page.list.questions" :key="index">{{ question }}
          <p class="content_color"><small>{{ page.list.answers[index] }}</small></p>
        </li>
      </ol>
    </div>

    <nav id="footer" class="fixed-bottom navbar navbar-dark">
      <b-form-checkbox v-model="checked"><small>{{ page.checkbox }}</small></b-form-checkbox>
      <b-button type="button" :disabled="isButtonDisabled" href="x60://back_to_page"><small>{{ page.button + " >" }}</small></b-button>
    </nav>
  </section>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
    };
  },
  computed: {
    isButtonDisabled() {
      return this.checked ? false : true;
    }
  },
  async asyncData({ $content, i18n }) {
    try {
      const lang = i18n.locale.toUpperCase();
      const content = await (await $content("docs/terms-of-use").fetch()).body;

      let page = {
        title: null,
        date: null,
        list: {
          questions: [],
          answers: []
        },
        checkbox: null,
        button: null
      };

      for (let i in content) {
        Object.keys(content[i]).forEach(k => k.toUpperCase());
        let keyVal = content[i].KEY;
        switch (true) {
          case keyVal === "TITLE":
            page.title = content[i][`${lang}`];
            break;
          case keyVal === "DATE":
            page.date = content[i][`${lang}`];
            break;
          case keyVal.includes("QUEST"): {
            page.list.questions.push(content[i][`${lang}`]);
            break;
          }
          case keyVal.includes("ANS"): {
            page.list.answers.push(content[i][`${lang}`]);
            break;
          }
          case keyVal === "CHECKBOX_TEXT": {
            page.checkbox = content[i][`${lang}`];
            break;
          }
          case keyVal === "BUTTON_TEXT": {
            page.button = content[i][`${lang}`];
            break;
          }
        }
      }

      return { page };

    } catch (error) { console.error(error) }
  },
  mounted() {
    this.$nuxt.context.query.tnc === 'accepted' ? this.checked = true : this.checked = false;

    document.getElementById("terms-of-use").style.marginBottom = `${document.getElementById("footer").offsetHeight - 1}px`;
  },
};
</script>

<style lang="scss" scoped>
#terms-of-use {
  padding: 2rem;
  background: border-box #fdfdfd;
  border-radius: 20px;
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
      }
    }
  }
}
#footer {
  color: #fff;
  background: #1b2831;
  .btn {
    @include button-green;
  }
}
</style>

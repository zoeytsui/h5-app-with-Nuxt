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
      page: {
        title: null,
        date: null,
        list: {
          questions: [],
          answers: []
        },
        checkbox: null,
        button: null
      }
    };
  },
  computed: {
    isButtonDisabled() {
      return this.checked ? false : true;
    }
  },
  async asyncData({ $content, route, i18n }) {
    const lang = i18n.getLocaleCookie();
    const content = await $content("docs", route.path).fetch();
    return { content, lang };
  },
  created() {
    this._contentHandler(this.content.body);

    this.$nuxt.context.query.tnc === 'accepted' ? this.checked = true : this.checked = false;

    if (process.client) {
      document.getElementById("terms-of-use").style.marginBottom = `${document.getElementById("footer").offsetHeight - 1}px`;
    }
  },
  methods: {
    async _contentHandler(keyArr) {
      try {
        if (process.client) {
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
              case keyVal === "CHECKBOX_TEXT": {
                this.page.checkbox = keyArr[i][`${capitalLang}`];
                break;
              }
              case keyVal === "BUTTON_TEXT": {
                this.page.button = keyArr[i][`${capitalLang}`];
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
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

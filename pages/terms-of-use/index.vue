<template>
  <div>
    <div id="terms-of-use" class="container">
      <h2 class="text-center">{{ page.title }}</h2>
      <p class="text-right">{{ page.date }}</p>
      <ol class="list-group">
        <li v-for="question,index in page.list.questions" :key="index">{{ question }}
          <p>{{ page.list.answers[index] }}</p>
        </li>
      </ol>
    </div>

    <div class="container-fluid">
      <nav class="fixed-bottom navbar navbar-dark">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="page.checkbox.state" id="checkbox">
          <label class="form-check-label" for="checkbox">{{ page.checkbox.caption}}</label>
        </div>
        <b-button type="button" class="btn btn-info" :disabled="isButtonDisabled" :href="page.button.url">{{ page.button.caption + " >" }}</b-button>
      </nav>
    </div>
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
        },
        checkbox: {
          caption: null,
          state: false
        },
        button: {
          caption: null,
          disabled: true,
          url: "x60://back_to_page"
        }
      }
    };
  },
  computed: {
    isButtonDisabled() {
      return this.page.checkbox.state ? false : true;
    }
  },
  async asyncData({ $content, route, i18n }) {
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
            this.page.checkbox.caption = keyArr[i][`${capitalLang}`];
            break;
          }
          case keyVal === "BUTTON_TEXT": {
            this.page.button.caption = keyArr[i][`${capitalLang}`];
            break;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#terms-of-use {
  padding: 2rem;
  margin-bottom: 3.3rem;
  background: border-box #f2f3f3;
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
        margin-bottom: 20px;
      }
    }
  }
}
.navbar {
  color: #fff;
  background: #1b2831;
  .btn-info {
    color: #1b2831;
    background: #2beae2;
    border-color: #2beae2;
  }
  .form-check {
    label {
      text-decoration: underline;
    }
  }
}
</style>

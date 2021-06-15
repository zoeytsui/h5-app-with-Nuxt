<template>
  <article class="text-left">
    <!-- <NuxtLink :to="`#${link.id}`">{{ link.text }}</NuxtLink> -->
    <!-- <p>{{ $t('messages.hi') }}</p> -->

    <h1>{{ textGenerator('TITLE') }}</h1>
    <p>{{ QUEST }}</p>

    <nuxt-content :document="page" />
  </article>
</template>

<script>
export default {
  data() {
    return {
      TITLE: null,
      QUEST: null
    };
  },
  async asyncData({ $content, params, app, i18n, error }) {
    const lang = i18n.getLocaleCookie();
    const page = await $content("docs", params.slug).fetch();
      // .then((res, rej) => {
      //   res.body.map(content => {
      //     console.log("content", content);
      //     // for (const [key, value] of Object.entries(content)) {
      //     if (content.KEY === "TITLE") {
      //       // console.log(TITLE);
      //       console.log(app);
      //     }
      //   });
      // });
    // controll[0].generator();
    return { page };
  },
  methods: {
    textGenerator(tag) {
      console.log('tag', tag);
      console.log('this', this);
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en", options);
    }
  }
};
</script>
<style lang="scss" scoped>
.nuxt-content {
  padding: 2rem;
  h2 {
    font-weight: bold;
    font-size: 28px;
  }
  h3 {
    font-weight: bold;
    font-size: 22px;
  }
  p {
    margin-bottom: 20px;
  }
}
</style>

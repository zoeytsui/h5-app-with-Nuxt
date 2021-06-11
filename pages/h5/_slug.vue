<template>
  <article class="text-center">
    <!-- <NuxtLink :to="`#${link.id}`">{{ link.text }}</NuxtLink> -->

    <h1>{{ page.title }}</h1>
    <p>{{ page.Q1.ques }}</p>

    <nuxt-content :document="page" />
  </article>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    const page = await $content("docs", params.slug).fetch();
    console.log("contentPage", page);
    return { page };
  },
  methods: {
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en", options);
    }
  }
};
</script>
<style lang="scss" scoped>
.nuxt-content {
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

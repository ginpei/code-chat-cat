<template lang="pug">
  div.defaultLayout
    header.defaultLayout-header
      div.globalHeader
        a.globalHeader-logo(v-if="titleUrl" :href="titleUrl") {{ title || defaultTitle }}
        span.globalHeader-logo(v-else) {{ title || defaultTitle }}
        div.globalHeaderMenu
          div.globalHeaderMenu-group(v-for="link in links")
            span.globalHeaderMenu-title {{ link.title }}
            div.globalHeaderMenu-list
              a.globalHeaderMenu-item(v-for="item in link.items" :href="item.href") {{ item.title }}
    div.defaultLayout-body
      slot(v-if="!processing || !firstTime")
    footer.defaultLayout-footer(v-if="!noFooter")
      div.container
        p
          = 'Created by '
          a(href="https://ginpei.info/") Ginpei Takanashi
    Processing(v-show="processing")
</template>

<script>
import Processing from '~/components/Processing.vue';

export default {
  props: [
    'processing',
    'title',
    'titleLink',
    'noFooter',
    'links'
  ],

  components: {
    Processing,
  },

  data () {
    return {
      firstTime: true,
    };
  },

  computed: {
    defaultTitle () {
      return 'Code Chat Cat';
    },

    titleUrl () {
      return this.titleLink || (this.title ? '' : '/');
    },
  },

  watch: {
    processing () {
      this.firstTime = false;
    },
  },
};
</script>


<style lang="scss" scoped>
.defaultLayout {
  --defaultLayout-headerHeight: 1.2rem;
  --defaultLayout-footerHeight: 5rem;

  .defaultLayout-header {
    grid-area: header;
    height: var(--defaultLayout-headerHeight);
    line-height: var(--defaultLayout-headerHeight);
  }

  .defaultLayout-main {
    grid-area: main;
  }
}

.globalHeader {
  justify-content: space-between;
  background-color: #036;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 0.8rem;
  height: var(--defaultLayout-headerHeight);
  left: 0;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  width: 100%;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.globalHeaderMenu {
  cursor: default;
  display: flex;

  .globalHeaderMenu-group {
    background-color: #036;
    margin-left: 0em;
    padding: 0 1px;
    position: relative;

    &:hover {
      border: 1px silver;
      border-style: solid solid none;
      padding: 0;

      .globalHeaderMenu-list {
        border: 1px solid silver;
        height: auto;
        opacity: 1;
        padding-top: 0.5em;
        transition: opacity 0;
      }
    }
  }

  .globalHeaderMenu-title {
    padding: 0 0.5em;
  }

  .globalHeaderMenu-list {
    background-color: #036;
    box-shadow: 0 0 20px #0006;
    height: 0;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    right: -1px;
    top: calc(1.4em - 1px);
    transition: opacity 200ms;
    min-width: 5em;
    z-index: -1;
  }

  .globalHeaderMenu-item {
    display: block;
    padding: 0.4em 1em;
  }
}

.defaultLayout-body {
  min-height: calc(100vh - var(--defaultLayout-headerHeight) - var(--defaultLayout-footerHeight));
}

.defaultLayout-footer {
  border-top: 1px solid gray;
  height: calc(var(--defaultLayout-footerHeight) - 1rem);
  margin-top: 1rem;
  padding: 1rem 0;
}

.container {
  box-sizing: border-box;
  min-width: 800px;
  margin: 0 auto;
  padding: 0 1em;
}
</style>

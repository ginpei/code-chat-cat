<template lang="pug">
  div.defaultLayout
    header.defaultLayout-header
      div.globalHeader
        a.globalHeader-logo(v-if="titleUrl" :href="titleUrl") {{ title || defaultTitle }}
        span.globalHeader-logo(v-if="!titleUrl") {{ title || defaultTitle }}
    div.defaultLayout-body
      slot(v-if="!processing || !firstTime")
    footer.defaultLayout-footer(v-if="!noFooter")
      div.container
        p
          = 'Created by '
          a(href="https://ginpei.info/") Ginpei Takanashi
    Processing(v-if="processing")
</template>

<script>
import Processing from '~/components/Processing.vue';

export default {
  props: [
    'processing',
    'title',
    'titleLink',
    'noFooter',
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
  background-color: #036;
  box-sizing: border-box;
  color: #fff;
  font-size: 0.8rem;
  height: var(--defaultLayout-headerHeight);
  left: 0;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  width: 100%;

  a.globalHeader-logo {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
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

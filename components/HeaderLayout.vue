<template lang="pug">
  div.defaultLayout
    header.defaultLayout-header
      div.globalHeader
        div.container.globalHeader-container
          a.globalHeader-logo(v-if="titleUrl" :href="titleUrl") {{ roomTitle }}
          span.globalHeader-logo(v-else) {{ roomTitle }}
          div.globalHeaderMenu
            div.globalHeaderMenu-group(v-show="!loadingUser" v-for="link in headerLinks")
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
import firebase from '~/plugins/firebase.js';
import { mapState, mapGetters, mapActions } from 'vuex';

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

    roomTitle () {
      return typeof this.title === 'string' ? this.title : this.defaultTitle;
    },

    titleUrl () {
      return this.titleLink || (this.title ? '' : '/');
    },

    headerLinks () {
      const links = [...(this.links || [])];
      if (this.currentUser) {
        links.push({
          title: this.userName || '(No name)',
          items: [
            { title: 'My rooms', href: '/rooms/' },
            { title: 'Sign out', href: '/signOut' },
          ],
        });
      } else {
        links.push({
          title: 'Sign in',
          items: [
            { title: 'Sign in as student', href: '/signIn' },
            { title: 'Sign in as instructor', href: '/signIn' },
          ]
        });
      }
      return links;
    },

    ...mapState([
      'currentUser',
      'loadingUser'
    ]),

    ...mapGetters([
      'userName',
    ]),
  },

  created () {
    this.setAuth(firebase.auth());
  },

  methods: {
    ...mapActions([
      'setAuth',
    ]),
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

  .globalHeader-container {
    justify-content: space-between;
    display: flex;
  }
}

.globalHeaderMenu {
  align-items: flex-start;
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
      white-space: nowrap;
    }
  }
}

.defaultLayout-body {
  min-height: calc(100vh - var(--defaultLayout-headerHeight) - var(--defaultLayout-footerHeight));

  & > .container > h1:first-child {
    margin-top: 0;
  }

  h1,
  h2,
  h3 {
    margin-top: 1em;
  }
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

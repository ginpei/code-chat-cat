<template lang="pug">
  div.signIn
    form.signIn-box(@submit.prevent="signIn_onSubmit")
      h1.signIn-heading Welcome!
      p.signIn-message Input your name and sign in to the class.
      div.signIn-form
        input.signIn-input(v-model="userNameInput" placeholder="Alice")
        button.signIn-signIn Sign In
</template>

<script>
export default {
  data () {
    return {
      userNameInput: '',
    };
  },

  methods: {
    signIn_onSubmit () {
      const data = { name: this.userNameInput };
      this.$emit('SignIn_submit', data);
    },
  },
};
</script>

<style lang="scss" scoped>
.signIn {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;

  .signIn-box {
    border: 1px solid lightgray;
    border-radius: 0.2rem;
    box-shadow: 0 0 1rem #0001;
    padding: 2em;
    width: 300px;
  }

  .signIn-heading,
  .signIn-message {
    margin-bottom: 1rem;
  }

  .signIn-form {
    display: grid;
  }

  .signIn-label {
    display: block;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .signIn-input {
    margin-left: 0.2em;
    padding: 0.4em;
  }

  .signIn-controls {
    text-align: right;
  }

  .signIn-signIn {
    height: 2em;
    min-width: 7em;
  }
}
</style>

<template lang="pug">
  div.Processing
    div.Processing-box *
    div.Processing-box *
    div.Processing-box *
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
.Processing {
  background-color: #fff3;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  position: fixed;
  width: 100%;

  .Processing-box {
    animation: rotate 1s infinite;
    height: 30px;
    text-align: center;
    width: 30px;

    &:nth-child(1) {
      animation-delay: 0ms;
    }
    &:nth-child(2) {
      animation-delay: 100ms;
    }
    &:nth-child(3) {
      animation-delay: 200ms;
    }
  }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

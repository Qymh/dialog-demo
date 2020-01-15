<template>
  <div id="app"></div>
</template>

<script>
export default {
  name: 'app',
  created() {
    this.$dialog
      .show({
        title: '实例弹窗',
        details: '详情',
        type: 'confirm'
      })
      .then(() => {})
      .catch(() => {});

    setTimeout(() => {
      this.$dialog
        .show({
          title: '第二次实例弹窗',
          details: '第二次详情'
        })
        .then(() => {})
        .catch(() => {});
    }, 2000);
  }
};
</script>

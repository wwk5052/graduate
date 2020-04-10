<template>
  <router-view />
</template>
<style scoped>
.showMenu {
  display: none;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isAdmin: function() {
      return this.$store.getters.userLogin;
    },
    // 滚动区高度
    // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
    scrollerHeight: () => window.outerHeight - 100 + 'px',
    menuClass: function() {
      return ['layout', this.isAdmin ? '' : 'showMenu'];
    },
  },
  methods: {},
};
</script>

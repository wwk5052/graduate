<template>
  <div>
    <div id="app">
      <Sider
        :style="{
          position: 'fixed',
          height: '100vh',
          left: 0,
          overflow: 'auto',
        }"
      >
        <Menu active-name="1-1" theme="dark" width="auto">
          <MenuItem name="1-1">
            <router-link to="/detail/products" tag="div">
              <Icon type="md-basket" />
              <span>产品中心</span>
            </router-link>
          </MenuItem>
          <MenuItem name="1-2">
            <router-link to="/detail/news" tag="div">
              <Icon type="logo-designernews" />
              <span>新闻中心</span>
            </router-link>
          </MenuItem>
          <MenuItem name="1-3">
            <router-link to="/detail/cases" tag="div">
              <Icon type="ios-briefcase-outline" />
              <span>经典案例</span>
            </router-link>
          </MenuItem>
        </Menu>
      </Sider>
      <Header
        :style="{
          background: '#fff',
          boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)',
          marginLeft: '200px',
          textAlign: 'right',
        }"
      >
        <div class="exit" @click="exit">登出 <Icon type="md-exit" /></div>
      </Header>
      <Layout :style="{ marginLeft: '200px', padding: '20px' }">
        <Content
          :style="{
            padding: '20px',
            background: '#fff',
            minHeight: scrollerHeight,
          }"
        >
          <router-view />
        </Content>
      </Layout>
    </div>
    <Modal v-model="exitModalSwitch" title="登出！" @on-ok="confirmExit">
      <div>确定要登出么？</div>
    </Modal>
  </div>
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
.ivu-icon-md-exit:before {
  font-size: 26px;
}

.exit {
  cursor: pointer;
}
</style>

<script>
export default {
  data() {
    return {
      exitModalSwitch: false,
    };
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
  methods: {
    exit() {
      this.exitModalSwitch = true;
    },
    confirmExit() {
      this.$router.push({ path: '/' });
      this.exitModalSwitch = false;
    },
  },
};
</script>

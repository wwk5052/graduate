<template>
  <div class="NewsDetails">
    <banner img="../assets/img/bgtop.jpg" />
    <div class="NewsDetails-product">
      <div class="NewsDetails-product-content">
        <!-- <img v-lazy="imgserver+newsIdList.Img" alt /> -->
        <img :src="newsIdList.imgurl" alt />
        <p class="product-title">{{newsIdList.title}}</p>
        <p class="product-time">{{dateFormat(newsIdList.createTime)}}</p>
        <p class="product-content">{{newsIdList.content}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '../components/Banner'
export default {
  name: 'NewsDetails',
  components: {
    Banner
  },
  data() {
    return {
      pid: 0,
      newsIdList: {}
    }
  },
  created() {
    this.pid = this.$route.params.id || ''
    this.type = this.$route.params.type || 0
    window.console.log(this.pid)
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      // this.$http
      //   .get(`News/GetNewsById/${this.pid}`)
      //   .then(response => {
      //     //console.log(response);
      //     this.newsIdList = response.data;
      //     window.console.log(this.newsIdList);
      //   })
      //   .catch(function(error) {
      //     window.console.log(error);
      //   });
      this.$http
        .get(`/api/new/list`, {
          params: {
            id: this.pid,
            type: this.type
          }
        })
        .then(response => {
          this.newsIdList = response.data.data[0]
        })
        .catch(function(error) {
          window.console.log(error)
        })
    },
    dateFormat(time) {
      var moment = require('moment')
      var date = time
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="scss" scoped>
.NewsDetails {
  width: 100%;
  height: 100%;
  //overflow: hidden;
  background-color: #14679f;
  &-product {
    width: 1240px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid red;
    &-content {
      width: 760px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 50px 0;
      img {
        width: 100%;
        //height: 500px;
      }
      .product-title {
        font-size: 25px;
        color: #e13834;
        padding: 20px 0;
      }
      .product-content {
        font-size: 17px;
        font-weight: bolder;
        padding: 20px 0;
      }
    }
  }
}
</style>
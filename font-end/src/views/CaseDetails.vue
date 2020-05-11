<template>
  <div class="case">
    <banner img="../assets/img/bgtop.jpg" />
    <div class="case-product">
      <div class="case-product-content">
        <!-- <img v-lazy="imgserver+caseIdList.Img" alt /> -->
        <img :src="caseIdList.imgurl" alt />
        <p class="product-title">{{caseIdList.title}}</p>
        <p class="product-time">{{dateFormat(caseIdList.createtime)}}</p>
        <p class="product-content">{{caseIdList.content}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '../components/Banner'
export default {
  components: {
    Banner
  },
  data() {
    return {
      pid: 0,
      caseIdList: {}
    }
  },
  created() {
    this.pid = this.$route.params.id
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      // this.$http
      //   .get(`Cases/GetCasesById/${this.pid}`)
      //   .then(response => {
      //     //console.log(response);
      //     this.caseIdList = response.data;
      //     window.console.log(this.caseIdList);
      //   })
      //   .catch(function(error) {
      //     window.console.log(error);
      //   });
      this.$http
        .get(`/api/case/list`, {
          params: {
            id: this.pid
          }
        })
        .then(res => {
          this.caseIdList = res.data.data[0]
        })
        .catch(err => {
          console.log('请求失败')
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
.case {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #14679f;
  &-product {
    width: 1240px;
    margin: 0 auto;
    background-color: #fff;
    //border: 1px solid red;
    &-content {
      width: 760px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 50px 0;
      img {
        width: 100%;
        height: 430px;
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
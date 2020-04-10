<template>
  <div>
    <h1 class="title">产品列表</h1>
    <Table border :columns="columns" :data="data" :loading="tableLoading" />
    <Button type="primary" class="addButton" @click="showAddProductsModal">
      添加产品
    </Button>
    <Modal
      v-model="addModalSwitch"
      title="Add a new product"
      @on-ok="addNewProductDetail"
    >
      <Form>
        <FormItem label="title">
          <Input
            v-model="newProductDetail.title"
            placeholder="input new product title"
          />
        </FormItem>
        <FormItem label="content">
          <Input
            v-model="newProductDetail.content"
            placeholder="input new product content"
          />
        </FormItem>
        <FormItem label="img">
          <Input
            v-model="newProductDetail.imgurl"
            placeholder="input new product imgurl"
          />
        </FormItem>
      </Form>
    </Modal>
    <!-- update Modal -->
    <Modal
      v-model="updateModalSwitch"
      title="Update this product"
      @on-ok="updateProductDetail"
    >
      <Form>
        <FormItem label="title">
          <Input
            v-model="newProductDetail.title"
            placeholder="input new product title"
          />
        </FormItem>
        <FormItem label="content">
          <Input
            v-model="newProductDetail.content"
            placeholder="input new product content"
          />
        </FormItem>
        <FormItem label="img">
          <Input
            v-model="newProductDetail.imgurl"
            placeholder="input new product imgurl"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  margin: 20px;
}
.addButton {
  margin: 10px;
}
</style>

<script>
export default {
  data() {
    return {
      tableLoading: true,
      addModalSwitch: false,
      updateModalSwitch: false,
      newProductDetail: {},
      columns: [
        {
          title: '产品ID',
          key: 'id'
        },
        {
          title: '产品title',
          key: 'title'
        },
        {
          title: '产品content',
          key: 'content'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showUpdateProductDetailModal(params.row);
                    }
                  }
                },
                'Update'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delProduct(params.row.id);
                    }
                  }
                },
                'Delete'
              )
            ]);
          }
        }
      ],
      data: []
    };
  },
  created() {
    this.getProductList();
  },
  methods: {
    // add modal
    addNewProductDetail() {
      this.$axios
        .post('/baseUrl/api/pro/add', this.newProductDetail)
        .then(res => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.$Message.info('添加成功');
            this.newProductDetail = {};
            this.getProductList();
          }
        })
        .catch(err => {
          console.log('添加失败', err);
        });
    },
    delProduct(productId) {
      this.$axios
        .delete('/baseUrl/api/pro/del', {
          params: {
            id: productId
          }
        })
        .then(res => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.$Message.info('删除成功');
            this.getProductList();
          }
        })
        .catch(err => {
          this.$Message.info('删除失败');
          console.log('删除product失败', err);
        });
    },
    getProductList() {
      this.$axios
        .get('/baseUrl/api/pro/list')
        .then(res => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.data = resData.data;
            this.tableLoading = false;
          }
        })
        .catch(err => {
          console.log('获取productList失败', err);
        });
    },
    showAddProductsModal() {
      this.addModalSwitch = true;
    },
    // update modal
    showUpdateProductDetailModal(detail) {
      this.newProductDetail = detail;
      this.updateModalSwitch = true;
    },
    updateProductDetail() {
      this.$axios
        .post('/baseUrl/api/pro/update', this.newProductDetail)
        .then(res => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.$Message.info('更新成功');
            this.newProductDetail = {};
            this.getProductList();
          }
        })
        .catch(err => {
          console.log('更新加失败', err);
        });
    }
  }
};
</script>

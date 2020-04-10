<template>
  <div>
    <h1 class="title">新闻列表</h1>
    <Table border :columns="columns" :data="data" :loading="tableLoading" />
    <Button type="primary" class="addButton" @click="showAddNewsModal">
      添加新闻
    </Button>
    <Modal
      v-model="addModalSwitch"
      title="Add a new new"
      @on-ok="addNewNewDetail"
    >
      <Form>
        <FormItem label="title">
          <Input
            v-model="newNewDetail.title"
            placeholder="input new new title"
          />
        </FormItem>
        <FormItem label="type">
          <Select v-model="newNewDetail.type">
            <Option value="1">公司新闻</Option>
            <Option value="2">行业新闻</Option>
          </Select>
        </FormItem>
        <FormItem label="content">
          <Input
            v-model="newNewDetail.content"
            placeholder="input new new content"
          />
        </FormItem>
        <FormItem label="img">
          <Input
            v-model="newNewDetail.imgurl"
            placeholder="input new new imgurl"
          />
        </FormItem>
      </Form>
    </Modal>
    <!-- update Modal -->
    <Modal
      v-model="updateModalSwitch"
      title="Update this new"
      @on-ok="updateNewDetail"
    >
      <Form>
        <FormItem label="title">
          <Input
            v-model="newNewDetail.title"
            placeholder="input new new title"
          />
        </FormItem>
        <FormItem label="content">
          <Input
            v-model="newNewDetail.content"
            placeholder="input new new content"
          />
        </FormItem>
        <FormItem label="img">
          <Input
            v-model="newNewDetail.imgurl"
            placeholder="input new new imgurl"
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
      newNewDetail: {},
      columns: [
        {
          title: '新闻ID',
          key: 'id',
        },
        {
          title: '新闻title',
          key: 'title',
        },
        {
          title: '新闻content',
          key: 'content',
        },
        {
          title: 'img',
          key: 'imgurl',
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
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.showUpdateNewDetailModal(params.row);
                    },
                  },
                },
                'Update'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.delNew(params.row.id);
                    },
                  },
                },
                'Delete'
              ),
            ]);
          },
        },
      ],
      data: [],
    };
  },
  created() {
    this.getNewList();
  },
  methods: {
    // add modal
    addNewNewDetail() {
      this.$axios
        .post('/baseUrl/api/new/create', this.newNewDetail)
        .then((res) => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.$Message.info('添加成功');
            this.newNewDetail = {};
            this.getNewList();
          }
        })
        .catch((err) => {
          console.log('添加失败', err);
        });
    },
    delNew(newId) {
      this.$axios
        .delete('/baseUrl/api/new/del', {
          params: {
            id: newId,
          },
        })
        .then((res) => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.$Message.info('删除成功');
            this.getNewList();
          }
        })
        .catch((err) => {
          this.$Message.info('删除失败');
          console.log('删除new失败', err);
        });
    },
    getNewList() {
      this.$axios
        .get('/baseUrl/api/new/list')
        .then((res) => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.data = resData.data;
            this.tableLoading = false;
          }
        })
        .catch((err) => {
          console.log('获取newList失败', err);
        });
    },
    showAddNewsModal() {
      this.addModalSwitch = true;
    },
    // update modal
    showUpdateNewDetailModal(detail) {
      this.newNewDetail = detail;
      this.updateModalSwitch = true;
    },
    updateNewDetail() {
      this.$axios
        .post('/baseUrl/api/new/update', this.newNewDetail)
        .then((res) => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.$Message.info('更新成功');
            this.newNewDetail = {};
            this.getNewList();
          }
        })
        .catch((err) => {
          console.log('更新加失败', err);
        });
    },
  },
};
</script>

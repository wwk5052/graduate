<template>
  <div>
    <h1 class="title">案例列表</h1>
    <Table border :columns="columns" :data="data" :loading="tableLoading" />
    <Button type="primary" class="addButton" @click="showAddCasesModal">
      添加案例
    </Button>
    <Modal
      v-model="addModalSwitch"
      title="Add a new case"
      @on-ok="addNewCaseDetail"
    >
      <Form>
        <FormItem label="title">
          <Input
            v-model="newCaseDetail.title"
            placeholder="input new case title"
          />
        </FormItem>
        <FormItem label="content">
          <Input
            v-model="newCaseDetail.content"
            placeholder="input new case content"
          />
        </FormItem>
        <FormItem label="img">
          <Input
            v-model="newCaseDetail.imgurl"
            placeholder="input new case imgurl"
          />
        </FormItem>
      </Form>
    </Modal>
    <!-- update Modal -->
    <Modal
      v-model="updateModalSwitch"
      title="Update this case"
      @on-ok="updateCaseDetail"
    >
      <Form>
        <FormItem label="title">
          <Input
            v-model="newCaseDetail.title"
            placeholder="input new case title"
          />
        </FormItem>
        <FormItem label="content">
          <Input
            v-model="newCaseDetail.content"
            placeholder="input new case content"
          />
        </FormItem>
        <FormItem label="img">
          <Input
            v-model="newCaseDetail.imgurl"
            placeholder="input new case imgurl"
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
      newCaseDetail: {},
      columns: [
        {
          title: '案例ID',
          key: 'id'
        },
        {
          title: '案例title',
          key: 'title'
        },
        {
          title: '案例content',
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
                      this.showUpdateCaseDetailModal(params.row);
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
                      this.delCase(params.row.id);
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
    this.getCaseList();
  },
  methods: {
    // add modal
    addNewCaseDetail() {
      this.$axios
        .post('/baseUrl/api/case/add', this.newCaseDetail)
        .then(res => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.$Message.info('添加成功');
            this.newCaseDetail = {};
            this.getCaseList();
          }
        })
        .catch(err => {
          console.log('添加失败', err);
        });
    },
    delCase(caseId) {
      this.$axios
        .delete('/baseUrl/api/case/del', {
          params: {
            id: caseId
          }
        })
        .then(res => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.$Message.info('删除成功');
            this.getCaseList();
          }
        })
        .catch(err => {
          this.$Message.info('删除失败');
          console.log('删除case失败', err);
        });
    },
    getCaseList() {
      this.$axios
        .get('/baseUrl/api/case/list')
        .then(res => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.data = resData.data;
            this.tableLoading = false;
          }
        })
        .catch(err => {
          console.log('获取caseList失败', err);
        });
    },
    showAddCasesModal() {
      this.addModalSwitch = true;
    },
    // update modal
    showUpdateCaseDetailModal(detail) {
      this.newCaseDetail = detail;
      this.updateModalSwitch = true;
    },
    updateCaseDetail() {
      this.$axios
        .post('/baseUrl/api/case/update', this.newCaseDetail)
        .then(res => {
          const resData = res.data;
          if (resData.errno === 0) {
            this.$Message.info('更新成功');
            this.newCaseDetail = {};
            this.getCaseList();
          }
        })
        .catch(err => {
          console.log('更新加失败', err);
        });
    }
  }
};
</script>

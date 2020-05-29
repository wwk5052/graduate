<template>
  <div class>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 系统通知
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="status" @tab-click="handleTabClick">
        <el-tab-pane :label="`未读通知`" name="0">
          <el-table :data="messageList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span
                  class="message-title"
                  @click="handleMessageDetail(scope.row)"
                >{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createtime" width="180" :formatter="dateFormat"></el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="handleRead(scope.row)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="`已读通知`" name="1">
          <el-table :data="messageList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span
                  class="message-title"
                  @click="handleMessageDetail(scope.row)"
                >{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createtime" width="180" :formatter="dateFormat"></el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="handleDel(scope.row)">点击删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="`已删除`" name="2">
          <el-table :data="messageList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span class="message-title" @click="detailMessage(scope.row)">{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createtime" width="180" :formatter="dateFormat"></el-table-column>
            <el-table-column width="120"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="messageDetail.title" :visible.sync="dialogVisible" width="50%">
      {{this.messageDetail.content}}
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data() {
    return {
      status: '0',
      showHeader: false,
      dialogVisible: false,
      messageList: [],
      messageDetail: {}
    }
  },
  mounted() {
    this.getMessageList()
  },
  methods: {
    handleTabClick(tab, event) {
      this.getMessageList(tab.name)
    },
    getMessageList() {
      this.$axios
        .get('/api/message/list', {
          params: {
            status: this.status
          }
        })
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.messageList = resData.data
          } else {
            this.$message.error('请求信息列表失败!')
          }
        })
        .catch(err => {
          this.$message.error('请求信息列表失败！')
        })
    },
    detailMessage(detail) {
      this.messageDetail = detail
      this.dialogVisible = true
    },
    handleMessageDetail(detail) {
      this.messageDetail = detail
      this.dialogVisible = true
      this.handleRead(detail)
    },
    dateFormat(row, column) {
      var moment = require('moment')
      var date = row[column.createtime]
      return moment(date).format('YYYY-MM-DD')
    },
    handleRead(inner) {
      inner.status = 1
      this.$axios
        .post('/api/message/update', {
          ...inner
        })
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.getMessageList()
          } else {
          }
        })
        .catch(err => {
          this.$message.error('已读失败！')
        })
    },
    handleDel(inner) {
      inner.status = 2
      this.$axios
        .post('/api/message/update', {
          ...inner
        })
        .then(res => {
          const resData = res.data
          if (resData.errno === 0) {
            this.$message.success('删除成功！')
            this.getMessageList()
          } else {
            this.$message.error('删除失败!')
          }
        })
        .catch(err => {
          this.$message.error('删除失败！')
        })
    },
    handleRestore(index) {
      const item = this.recycle.splice(index, 1)
      this.read = item.concat(this.read)
    }
  },
  computed: {
    unreadNum() {
      return this.unread.length
    }
  }
}
</script>

<style>
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
</style>


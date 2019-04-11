<template>
  <div>
    <Row :gutter="24" type="flex" justify="start">
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.name" size="large" placeholder="用户名称"/>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.account" size="large" placeholder="用户账号"/>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
      <Button
        type="primary"
        style="margin-left:10px;"
        size="large"
        icon="md-add"
        @click="addHandle"
      >添加用户</Button>
    </Row>
    <br>
    <Table ref="tableUser" stripe :columns="columns" :data="data">
      <!-- 操作 -->
      <template slot="action" slot-scope="props">
        <Button
          type="primary"
          size="small"
          @click="editHandle(props.id)"
          style="margin-right: 5px;"
        >编辑</Button>
        <Button
          type="warning"
          size="small"
          @click="operateHandle({id: props.id, type: 'disable'})"
          style="margin-right: 5px;"
          v-if="props.status == 1"
        >禁用</Button>
        <Button
          type="success"
          size="small"
          @click="operateHandle({id: props.id, type: 'enable'})"
          style="margin-right: 5px;"
          v-else-if="props.status == 0"
        >启用</Button>
        <Button
          type="error"
          size="small"
          @click="delHandle(props.id)"
          style="margin-right: 5px;"
        >删除</Button>
      </template>
    </Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
    <Modal
      v-model="editModal.state"
      @on-visible-change="editModalVisibleChange"
      :title="editModal.title"
    >
      <edit ref="editComponents" :params="editModal.params" @callback="editModalCallBack"></edit>
      <div slot="footer">
        <Row :gutter="16" type="flex" justify="end">
          <Button @click="editModalCancelHandle">取消</Button>
          <Button type="primary" @click="editModalSaveHandle">保存</Button>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
import { userFilters } from '@/libs/filters'
import { user } from '@/api/user'
import edit from './edit.vue'
export default {
  filters: {
    ...userFilters
  },
  components: {
    edit
  },
  data () {
    return {
      editModal: {
        state: false,
        title: '添加用户',
        params: {}
      },
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        name: '',
        account: ''
      },
      page: {
        total: 0,
        current: 1
      },
      columns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '用户名称',
          key: 'name'
        },
        {
          title: '用户账号',
          key: 'account'
        },
        {
          title: '用户角色',
          key: 'role_name'
        },
        {
          title: '创建时间',
          key: 'created_at'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  color: this.$options.filters.userStatusFilter(params.row.status).color
                }
              },
              this.$options.filters.userStatusFilter(params.row.status).text
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return ('div', this.$refs.tableUser.$scopedSlots.action({
              id: params.row.id,
              status: params.row.status
            }))
          }
        }
      ],
      data: []
    }
  },
  methods: {
    searchHandle () {
      this.page.current = 1
      this.params.offset > 0 ? (this.params.offset = 0) : this.getList()
    },
    pageChange (page) {
      this.params.offset = (page - 1) * this.params.limit
    },
    getList () {
      user.list(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
      })
    },
    addHandle () {
      this.editModal = {
        state: true,
        title: '添加用户',
        params: {}
      }
    },
    // 编辑
    editHandle (id) {
      user.detail(id).then(res => {
        if (res) {
          let detail = res.data.data
          this.editModal = {
            params: detail,
            state: true,
            title: '编辑用户'
          }
        }
      })
    },
    // 关闭modal
    editModalCancelHandle () {
      this.editModal.state = false
    },
    // 保存修改
    editModalSaveHandle () {
      this.$refs.editComponents.validateForm()
    },
    editModalCallBack () {
      this.editModalCancelHandle()
      this.getList()
    },
    // modal状态切换
    editModalVisibleChange (state) {
      if (!state) this.$refs.editComponents.$refs.formValidate.resetFields()
    },
    delHandle (id) {
      this.$Modal.confirm({
        title: '删除用户',
        content: '<p>您确定要删除此用户吗?</p>',
        onOk: () => {
          user.del(id).then(res => {
            let data = res.data
            if (data.code === 200) {
              this.$Message.success(data.msg)
            } else {
              this.$Message.error(data.msg)
            }
            this.searchHandle()
          })
        }
      })
    },
    operateHandle (data) {
      user.operate(data).then(res => {
        let data = res.data
        if (data.code === 200) {
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg)
        }
        this.getList()
      })
    }
  },
  watch: {
    params: {
      handler: 'getList',
      deep: true
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

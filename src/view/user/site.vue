<template>
  <div>
    <Row :gutter="24" type="flex" justify="start">
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.name" size="large" placeholder="场所名称"/>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
      <Button
        type="primary"
        style="margin-left:10px;"
        size="large"
        icon="md-add"
        @click="addHandle"
      >添加场所</Button>
    </Row>
    <br>
    <Table stripe :columns="columns" :data="data"></Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
    <Modal
      v-model="editModal.state"
      @on-visible-change="editModalVisibleChange"
      :title="editModal.title"
    >
      <editSite ref="editComponents" :params="editModal.params" @callback="editModalCallBack"></editSite>
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
import { site } from '@/api/user'
import editSite from './editSite.vue'
export default {
  components: {
    editSite
  },
  data () {
    return {
      editModal: {
        state: false,
        title: '添加场所',
        params: {}
      },
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        name: ''
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
          title: '场所名称',
          key: 'name'
        },
        {
          title: '创建时间',
          key: 'created_at'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return ('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editHandle(params.row.id)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delHandle(params.row.id)
                  }
                }
              }, '删除')
            ])
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
      site.list(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
      })
    },
    addHandle () {
      this.editModal = {
        state: true,
        title: '添加场所',
        params: {}
      }
    },
    // 编辑
    editHandle (id) {
      site.detail(id).then(res => {
        if (res) {
          let detail = res.data.data
          this.editModal = {
            params: detail,
            state: true,
            title: '编辑场所'
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
      if (!state) this.$refs.editComponents.resetForm()
    },
    delHandle (id) {
      this.$Modal.confirm({
        title: '删除场所',
        content: '<p>相关用户的所属场所会被置空，您确定要删除吗?</p>',
        onOk: () => {
          site.del(id).then(res => {
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

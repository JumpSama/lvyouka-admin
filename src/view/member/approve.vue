<template>
  <div>
    <Row :gutter="24" type="flex" justify="start">
      <i-col span="3">
        <Input clearable type="text" v-model="paramsExtend.name" size="large" placeholder="姓名"/>
      </i-col>
      <i-col span="3">
        <Input clearable type="text" v-model="paramsExtend.phone" size="large" placeholder="手机号"/>
      </i-col>
      <i-col span="3">
        <Input clearable type="text" v-model="paramsExtend.identity" size="large" placeholder="身份证号" />
      </i-col>
      <i-col span="3">
        <Select clearable v-model="paramsExtend.status" size="large" placeholder="状态">
          <Option :value="1">待审核</Option>
          <Option :value="2">已拒绝</Option>
          <Option :value="0">未支付</Option>
        </Select>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
    </Row>
    <br>
    <Table ref="tableApprove" stripe :columns="columns" :data="data">
      <!-- 操作 -->
      <template slot="action" slot-scope="props">
        <Button
          type="primary"
          size="small"
          @click="showUser(props.identity, props.member_id)"
          style="margin-right: 5px;"
        >查看已关联用户</Button>
        <Poptip
          confirm
          title="是否审核通过?"
          @on-ok="operateHandle({id: props.id, type: 'approve'})"
          transfer
          style="margin-right: 5px;"
          v-if="props.status == 1"
        >
          <Button type="success" size="small">通过</Button>
        </Poptip>
        <Poptip
          confirm
          title="是否审核驳回?"
          @on-ok="operateHandle({id: props.id, type: 'refuse'})"
          transfer
          v-if="props.status == 1"
        >
          <Button type="error" size="small">驳回</Button>
        </Poptip>
      </template>
    </Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
    <Drawer placement="right" width="600" v-model="detailDrawer.state">
      <memberDetail :detail="detailDrawer.detail" />
    </Drawer>
  </div>
</template>

<script>
import { approve } from '@/api/member'
import { memberFilters } from '@/libs/filters'
import expandRow from './expandApprove.vue'
import memberDetail from './memberDetail.vue'
export default {
  filters: {
    ...memberFilters
  },
  components: {
    expandRow,
    memberDetail
  },
  data () {
    return {
      detailDrawer: {
        detail: {},
        state: false
      },
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        status: 1,
        name: '',
        phone: '',
        identity: ''
      },
      page: {
        total: 0,
        current: 1
      },
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                identity_front: params.row.identity_front,
                identity_reverse: params.row.identity_reverse
              }
            })
          }
        },
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '性别',
          key: 'sex',
          render: (h, params) => {
            let sex = '未知'
            if (params.row.sex === 1) sex = '男'
            if (params.row.sex === 2) sex = '女'
            return h('span', sex)
          }
        },
        {
          title: '手机',
          key: 'phone'
        },
        {
          title: '身份证',
          key: 'identity'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  color: this.$options.filters.approveStatusFilter(params.row.status).color
                }
              },
              this.$options.filters.approveStatusFilter(params.row.status).text
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 240,
          render: (h, params) => {
            return ('div', this.$refs.tableApprove.$scopedSlots.action({
              id: params.row.id,
              status: params.row.status,
              identity: params.row.identity,
              member_id: params.row.member_id
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
      approve.list(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
      })
    },
    operateHandle (data) {
      approve.operate(data).then(res => {
        console.log(res)
      })
    },
    showUser (identity, memberId) {
      if (!memberId) {
        this.$Message.error('无关联用户')
        return
      }
      approve.member(identity).then(res => {
        let d = res.data
        if (d && d.code === 200) {
          this.detailDrawer = {
            state: true,
            detail: d.data
          }
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

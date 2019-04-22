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
        <Input clearable type="text" v-model="paramsExtend.identity" size="large" placeholder="身份证号"/>
      </i-col>
      <i-col span="3">
        <Input clearable type="text" v-model="paramsExtend.number" size="large" placeholder="卡号"/>
      </i-col>
      <i-col span="3">
        <Select clearable v-model="paramsExtend.status" size="large" placeholder="状态">
          <Option :value="1">已激活</Option>
          <Option :value="0">已过期</Option>
        </Select>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
      <Button style="margin-left:10px;" type="success" size="large" icon="md-card" @click="openModal('new')">开卡</Button>
      <Button style="margin-left:10px;" type="warning" size="large" icon="md-person" @click="openModal('bind')">绑卡</Button>
      <Button style="margin-left:10px;" type="error" size="large" icon="md-unlock" @click="openModal('lost')">挂失补卡</Button>
      <Button style="margin-left:10px;" type="success" size="large" icon="md-refresh" @click="openModal('renew')">续费</Button>
    </Row>
    <br>
    <Table ref="tableInfo" stripe :columns="columns" :data="data">
      <!-- 操作 -->
      <template slot="action" slot-scope="props">
        <Poptip
          confirm
          title="是否冻结该用户的实体卡?"
          @on-ok="disableCard(props.id)"
          transfer
          style="margin-right: 5px;"
          v-if="props.card_status == 1"
        >
          <Button type="error" size="small">冻结</Button>
        </Poptip>
        <Poptip
          confirm
          title="是否解冻该用户的实体卡?"
          @on-ok="enableCard(props.id)"
          transfer
          v-if="props.card_status == 3"
        >
          <Button type="success" size="small">解冻</Button>
        </Poptip>
      </template>
    </Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
    <Modal
      v-model="editModal.state"
      @on-visible-change="editModalVisibleChange"
      :title="editModal.title"
      :mask-closable="false"
    >
      <bindCard ref="editComponents" :type="editModal.type" @callback="editModalCallBack"></bindCard>
      <div slot="footer">
        <Row :gutter="16" type="flex" justify="end">
          <Button @click="editModalCancelHandle">关闭</Button>
          <Button type="primary" @click="editModalSaveHandle">确定</Button>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
import { member } from '@/api/member'
import { memberFilters } from '@/libs/filters'
import expandRow from './expand.vue'
import bindCard from './bindCard.vue'
export default {
  filters: {
    ...memberFilters
  },
  components: {
    expandRow,
    bindCard
  },
  data () {
    return {
      editModal: {
        state: false,
        title: '会员开卡',
        type: 'new'
      },
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        status: '',
        name: '',
        phone: '',
        identity: '',
        number: ''
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
                id: params.row.id
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
          title: '积分',
          key: 'point'
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
                  color: this.$options.filters.memberStatusFilter(params.row.status).color
                }
              },
              this.$options.filters.memberStatusFilter(params.row.status).text
            )
          }
        },
        {
          title: '卡号',
          key: 'number'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return ('div', this.$refs.tableInfo.$scopedSlots.action({
              id: params.row.id,
              card_status: params.row.card_status
            }))
          }
        }
      ],
      data: [],
      typeObj: {
        'new': '会员开卡',
        'bind': '会员绑卡',
        'lost': '会员补卡（旧卡无法再使用）',
        'renew': '会员续费'
      }
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
      member.list(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
      })
    },
    openModal (type) {
      this.editModal = {
        type,
        state: true,
        title: this.typeObj[type]
      }
    },
    // 关闭modal
    editModalCancelHandle () {
      this.editModal.state = false
    },
    // 保存修改
    editModalSaveHandle () {
      this.$refs.editComponents.validateForm()
    },
    // 保存回调
    editModalCallBack () {
      this.editModalCancelHandle()
    },
    // modal状态切换
    editModalVisibleChange (state) {
      if (!state) {
        this.$refs.editComponents.resetData()
        this.getList()
      }
    },
    disableCard (id) {
      member.memberDisable(id).then(res => {
        const d = res.data
        if (d && d.code === 200) {
          this.$Message.success(d.msg)
          this.getList()
        } else {
          this.$Message.error(d.msg || '操作失败')
        }
      })
    },
    enableCard (id) {
      member.memberEnable(id).then(res => {
        const d = res.data
        if (d && d.code === 200) {
          this.$Message.success(d.msg)
          this.getList()
        } else {
          this.$Message.error(d.msg || '操作失败')
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

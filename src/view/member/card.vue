<template>
  <div>
    <Row :gutter="24" type="flex" justify="start">
      <i-col span="4">
        <Select v-model="paramsExtend.status" size="large" clearable>
          <Option :value="0">未激活</Option>
          <Option :value="1">已激活</Option>
          <Option :value="2">已挂失</Option>
        </Select>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.number" size="large" placeholder="卡号"/>
      </i-col>
      <i-col span="4">
        <Input
          clearable
          type="text"
          v-model="paramsExtend.member_id"
          size="large"
          placeholder="用户ID"
        />
      </i-col>
      <i-col span="4">
        <Input
          clearable
          type="text"
          v-model="paramsExtend.member_name"
          size="large"
          placeholder="用户名称"
        />
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
      <Button style="margin-left:10px;" type="success" size="large" icon="md-add" @click="openModal">卡片录入</Button>
    </Row>
    <br>
    <Table ref="tableUser" stripe :columns="columns" :data="data"></Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
    <Modal
      v-model="editModal.state"
      @on-visible-change="editModalVisibleChange"
      :title="editModal.title"
    >
      <newCard ref="editComponents"></newCard>
      <div slot="footer">
        <Row :gutter="16" type="flex" justify="end">
          <Button @click="editModalCancelHandle">关闭</Button>
          <Button type="primary" @click="editModalSaveHandle">读卡</Button>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
import newCard from './newCard.vue'
import { cardFilters } from '@/libs/filters'
import { card } from '@/api/member'
export default {
  components: {
    newCard
  },
  filters: {
    ...cardFilters
  },
  data () {
    return {
      editModal: {
        state: false,
        title: '卡片录入'
      },
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        status: '',
        number: '',
        member_id: '',
        member_name: ''
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
          title: '卡号',
          key: 'number'
        },
        {
          title: '卡片状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  color: this.$options.filters.cardStatusFilter(params.row.status).color
                }
              },
              this.$options.filters.cardStatusFilter(params.row.status).text
            )
          }
        },
        {
          title: '关联用户',
          key: 'user_id',
          render: (h, params) => {
            return h(
              'p',
              params.row.member_name ? params.row.member_name + '(ID:' + params.row.member_id + ')' : '未关联'
            )
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
      card.list(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
      })
    },
    openModal () {
      this.editModal.state = true
    },
    // 关闭modal
    editModalCancelHandle () {
      this.editModal.state = false
    },
    // 保存修改
    editModalSaveHandle () {
      this.$refs.editComponents.readCard()
    },
    // modal状态切换
    editModalVisibleChange (state) {
      if (!state) {
        this.$refs.editComponents.emptyCard()
        this.getList()
      }
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

<template>
  <div>
    <Row :gutter="16" type="flex" justify="start">
      <i-col span="4">
        <DatePicker type="daterange" format="yyyy-MM-dd" size="large" @on-change="dateChange" split-panels placeholder="请选择时间范围"></DatePicker>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
      <Button style="margin-left: 20px;" type="success" size="large" icon="md-qr-scanner" @click="showQrcode">分销二维码</Button>
    </Row>
    <br>
    <Table stripe :columns="columns" :data="data"></Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
    <Modal title="查看图片" v-model="visible">
      <img :src="qrcodeUrl" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import { distribution } from '@/api/distribution'
export default {
  data () {
    return {
      qrcodeUrl: '',
      visible: false,
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        type: 1,
        start_time: '',
        end_time: ''
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
          title: '佣金',
          key: 'amount'
        },
        {
          title: '注册会员',
          key: 'member_id',
          render: (h, params) => {
            return h('p', params.row.name + '(ID:' + params.row.member_id + ')')
          }
        },
        {
          title: '注册时间',
          key: 'created_at'
        }
      ],
      data: []
    }
  },
  methods: {
    dateChange (date) {
      this.paramsExtend.start_time = date[0]
      this.paramsExtend.end_time = date[1]
    },
    searchHandle () {
      this.page.current = 1
      this.params.offset > 0 ? (this.params.offset = 0) : this.getList()
    },
    pageChange (page) {
      this.params.offset = (page - 1) * this.params.limit
    },
    getList () {
      distribution.list(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
      })
    },
    showQrcode () {
      distribution.qrcode().then(res => {
        const d = res.data

        if (d && d.code === 200) {
          this.visible = true
          this.qrcodeUrl = d.data.url
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

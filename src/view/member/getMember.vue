<template>
  <div>
    <Row>
      <i-col :span="12">
        <Input ref="qrinput" element-id="qrcode" style="margin-left:20px;display:none;" type="text" v-model="params.qrcode" placeholder="请选中此框后扫描二维码" autofocus v-if="type === 'scan'" />
        <Button style="margin-left:20px;" type="primary" @click="readCard" v-else>读卡</Button>
      </i-col>
    </Row>
    <br>
    <Form ref="formValidate" :label-width="80" :model="info">
      <FormItem label="姓名：">{{info.name}}</FormItem>
      <FormItem label="手机号：">{{info.phone}}</FormItem>
      <FormItem label="项目：">
        <RadioGroup vertical v-model="info.item_id">
          <Radio v-for="(item,i) in items" :key="i" :label="i" :disabled="item.count >= item.item_count">
            <span>{{item.item_name}}&nbsp;&nbsp;{{item.count}}/{{item.item_count}}</span>
          </Radio>
        </RadioGroup>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { card } from '@/api/member'
export default {
  name: 'getMember',
  props: {
    type: {
      type: String,
      default: 'card'
    }
  },
  data () {
    return {
      loading: false,
      items: {},
      info: {
        name: '',
        phone: '',
        item_id: '',
        member_id: ''
      },
      params: {
        qrcode: '',
        card_number: ''
      }
    }
  },
  watch: {
    'type' () {
      if (this.type === 'scan') {
        this.$nextTick(() => {
          this.$refs.qrinput.focus()
        })
      }
    },
    'params': {
      deep: true,
      handler () {
        console.log(this.params)
        if (this.params.qrcode.length === 31) this.getLog()
      }
    }
  },
  methods: {
    // 重置
    resetData () {
      this.loading = false
      this.items = {}
      this.info = {
        name: '',
        phone: '',
        item_id: '',
        member_id: ''
      }
      this.params = {
        qrcode: '',
        card_number: ''
      }
    },
    // 读卡
    readCard () {
      const card_number = icadapter.ReadCardNo()
      if (card_number) {
        this.params.card_number = card_number
        this.getLog()
      } else {
        this.$Message.error('读取失败')
      }
    },
    // 参数检查
    validateForm () {
      if (this.type === 'card' && !this.info.member_id) {
        this.$Message.error('请刷卡')
        return
      }
      if (this.type === 'scan' && !this.info.member_id) {
        this.$Message.error('请扫描')
        return
      }
      if (!this.info.item_id) {
        this.$Message.error('请选择项目')
        return
      }
      this.cardUse()
    },
    // 使用记录
    getLog () {
      if (this.loading) return
      this.loading = true
      card.detail(this.params).then(res => {
        this.loading = false
        const d = res.data
        if (d && d.code === 200) {
          const data = d.data
          const detail = data.detail
          this.info = {
            name: detail.name,
            phone: detail.phone,
            member_id: detail.id
          }
          const items = data.items
          const counts = data.counts
          let tempData = {}
          for (let p in items) {
            let id = items[p].id
            let count = 0
            for (let q in counts) {
              if (counts[q].item_id === id) {
                count = counts[q].count
                break
              }
            }
            tempData[id] = {
              count,
              item_name: items[p].item_name,
              item_count: items[p].item_count
            }
          }
          this.items = tempData
        } else {
          this.$Message.error(d.msg || '获取会员信息失败')
          this.resetData()
        }
      })
    },
    // 刷卡
    cardUse () {
      card.record({
        item_id: this.info.item_id,
        member_id: this.info.member_id
      }).then(res => {
        const d = res.data
        if (d && d.code === 200) {
          this.$Message.success('记录成功')
          this.$emit('callback')
        } else {
          this.$Message.error(d.msg || '操作失败')
        }
      })
    }
  }
}
</script>

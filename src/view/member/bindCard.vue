<template>
  <div>
    <Form ref="formValidate" :label-width="80" :model="info">
      <FormItem label="卡号：">
        <Row>
          <i-col :span="4">
            <Button type="primary" @click="readCard">读卡</Button>
          </i-col>
          <i-col :span="12" :offset="1">
            {{info.card_number}}
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="姓名：">
        <Row>
          <i-col :span="4">
            <Button type="primary" @click="readId">读身份证</Button>
          </i-col>
          <i-col :span="12" :offset="1">
            {{info.name}}
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="性别：">{{info.sex}}</FormItem>
      <FormItem label="身份证号：">{{info.identity}}</FormItem>
      <FormItem label="头像：" prop="avatar">
        <img v-if="info.avatar" :src="info.avatar">
      </FormItem>
      <FormItem v-if="type == 'new'" label="手机号：" prop="phone">
        <Input type="text" v-model="info.phone"/>
      </FormItem>
      <FormItem v-if="type == 'new'" label="验证码：" prop="code">
        <Row>
          <i-col :span="12">
            <Input type="text" v-model="info.code"/>
          </i-col>
          <i-col :span="6" :offset="1">
            <Button type="primary" @click="getCode">{{countText}}</Button>
          </i-col>
        </Row>
      </FormItem>
      <FormItem v-if="type == 'new'" label="年费：" prop="pay">
        <i-switch v-model="info.pay" size="large">
          <span slot="open">已付</span>
          <span slot="close">未付</span>
        </i-switch>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { member } from '@/api/member'
export default {
  name: 'bindCard',
  props: {
    type: {
      type: String,
      default: 'new'
    }
  },
  data () {
    return {
      countObj: null,
      countTime: 60,
      countText: '获取验证码',
      info: {
        card_number: '',
        name: '',
        sex: '',
        avatar: '',
        identity: ''
      }
    }
  },
  methods: {
    // 重置
    resetData () {
      this.info = {
        card_number: '',
        name: '',
        sex: '',
        avatar: '',
        identity: ''
      }
      this.countTime = 60
      this.countText = '获取验证码'
      if (this.countObj) clearTimeout(this.countObj)
    },
    // 倒计时
    countDown () {
      if (this.countTime < 1) {
        this.countTime = 60
        this.countText = '获取验证码'
        return
      }
      this.countText = this.countTime
      this.countTime--
      setTimeout(() => {
        this.countObj = this.countDown()
      }, 1000)
    },
    // 验证码
    getCode () {
      // 发送检查
      if (this.countText !== '获取验证码') return
      // 手机号
      const phone = this.info.phone ? this.info.phone : ''
      // 校验手机号
      if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(phone)) {
        this.$Message.error('请输入正确的手机号')
        return
      }
      // 发送验证码
      member.getCode(phone).then(res => {
        let d = res.data
        if (d && d.code === 200) {
          this.$Message.success('发送成功')
          this.countDown()
        } else {
          this.$Message.error('发送失败')
        }
      })
    },
    // 读卡
    readCard () {
      const card_number = icadapter.ReadCardNo()
      if (card_number) {
        Object.assign(this.info, {
          card_number
        })
      } else {
        this.$Message.error('读取失败')
      }
    },
    // 读身份证
    readId () {
      let data = idadapter.ReadCardInfo()
      if (!data) {
        this.$Message.error('读取失败')
        return
      }
      data = JSON.parse(data)
      if (!data.name) return
      const tempData = {
        name: data.name,
        sex: data.sex,
        avatar: data.image,
        identity: data.id
      }
      Object.assign(this.info, tempData)
    },
    // 参数检查
    validateForm () {
      if (!this.info.card_number) {
        this.$Message.error('请刷卡')
        return
      }
      if (!this.info.identity) {
        this.$Message.error('请刷身份证')
        return
      }
      if (this.type === 'new') {
        if (!this.info.phone) {
          this.$Message.error('请输入手机号！')
          return
        }
        if (!this.info.code) {
          this.$Message.error('请输入验证码！')
          return
        }
        if (!this.info.pay) {
          this.$Message.error('请确认年费已支付！')
          return
        }
      }
      if (this.type === 'new') this.storeNew()
      else if (this.type === 'bind') this.storeBind()
      else this.storeChange()
    },
    // 开卡
    storeNew () {
      let data = Object.assign({}, this.info)
      data.sex = data.sex === '男' ? 1 : 2
      member.storeNew(data).then(res => {
        let d = res.data
        if (d && d.code === 200) {
          this.$Message.success('开卡成功')
          this.$emit('callback')
        } else {
          this.$Message.error(d.msg || '开卡失败')
        }
      })
    },
    // 绑卡
    storeBind () {
      member.storeBind({
        avatar: this.info.avatar,
        identity: this.info.identity,
        card_number: this.info.card_number
      }).then(res => {
        let d = res.data
        if (d && d.code === 200) {
          this.$Message.success('绑定成功')
          this.$emit('callback')
        } else {
          this.$Message.error(d.msg || '绑定失败')
        }
      })
    },
    // 挂失
    storeChange () {
      member.storeChange({
        identity: this.info.identity,
        card_number: this.info.card_number
      }).then(res => {
        let d = res.data
        if (d && d.code === 200) {
          this.$Message.success('新卡绑定成功')
          this.$emit('callback')
        } else {
          this.$Message.error(d.msg || '新卡绑定失败')
        }
      })
    }
  }
}
</script>

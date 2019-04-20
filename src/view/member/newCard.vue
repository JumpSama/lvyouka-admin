<template>
  <div>{{showText}}</div>
</template>

<script>
import { card } from '@/api/member'
export default {
  name: 'newCard',
  data () {
    return {
      state: false,
      cardNumber: '',
      showText: '请读卡'
    }
  },
  methods: {
    readCard () {
      if (this.state) return
      this.cardNumber = icadapter.ReadCardNo()
      if (this.cardNumber) this.add()
      else this.showText = '未读取到卡片'
    },
    emptyCard () {
      this.state = false
      this.showText = '请读卡'
    },
    add () {
      this.state = true
      this.showText = '录入中...'
      card.add(this.cardNumber).then(res => {
        let d = res.data
        this.state = false
        if (d && d.code === 200) this.showText = '录入成功，请换卡或者关闭'
        else this.showText = d.msg
      })
    }
  }
}
</script>

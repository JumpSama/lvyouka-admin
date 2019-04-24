<template>
  <div style="font-size:18px;">{{showText}}</div>
</template>

<script>
import { card } from '@/api/member'
export default {
  name: 'newCard',
  data () {
    return {
      state: false,
      cardNumber: '',
      showText: '请读卡',
      timeObj: null
    }
  },
  methods: {
    // 开始读卡
    readStart () {
      if (this.timeObj) return
      this.timeObj = setInterval(() => {
        this.readCard()
      }, 2000)
    },
    // 读卡
    readCard () {
      const cardNumber = icadapter.ReadCardNo()
      if (cardNumber) {
        if (cardNumber !== this.cardNumber) {
          this.cardNumber = cardNumber
          this.add(cardNumber)
        }
      } else {
        this.showText = '未读取到卡片'
      }
    },
    emptyCard () {
      this.state = false
      this.showText = '请读卡'
      this.cardNumber = ''
      if (this.timeObj) {
        clearInterval(this.timeObj)
        this.timeObj = null
      }
    },
    add (cardNumber) {
      if (this.state) return
      this.state = true
      this.showText = '录入中...'
      card.add(cardNumber).then(res => {
        let d = res.data
        this.state = false
        if (d && d.code === 200) this.showText = '录入成功（' + cardNumber + '），请换卡或者关闭'
        else this.showText = d.msg
      })
    }
  }
}
</script>

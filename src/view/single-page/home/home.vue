<template>
  <div>
    <Card>
      <Icon type="md-document"/>
      欢迎使用文旅惠民卡后台管理系统
    </Card>
    <br>
    <Row :gutter="20">
      <i-col
        :span="12"
        v-for="(infor, i) in inforCardData"
        :key="i"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card
          v-if="access.includes(i)"
          shadow
          :color="infor.color"
          :icon="infor.icon"
          :icon-size="36"
        >
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { getHomeCount } from '@/api/system'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo
  },
  data () {
    return {
      access: this.$store.state.user.access,
      inforCardData: {
        'member': { title: '会员数量', icon: 'md-people', count: 0, color: '#2d8cf0' },
        'card': { title: '卡片数量', icon: 'md-card', count: 0, color: '#19be6b' },
        'commodity': { title: '商品数量', icon: 'md-pricetag', count: 0, color: '#ff9900' },
        'order': { title: '订单数量', icon: 'md-appstore', count: 0, color: '#ed3f14' }
      }
    }
  },
  mounted () {
    getHomeCount().then(res => {
      let data = res.data.data
      for (let p in data) {
        if (this.inforCardData[p]) this.inforCardData[p].count = data[p]
      }
    })
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>

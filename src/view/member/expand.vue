<template>
  <div>
    <div class="wrap">
      <Row type="flex">
        <i-col span="8">
          <label>性别:</label>
          {{detail.sex == 1 ? '男' : detail.sex == 2 ? '女' : '未知'}}
        </i-col>
        <i-col span="8">
          <label>过期时间:</label>
          {{detail.status == 1 ? detail.overdue : '已过期'}}
        </i-col>
        <i-col span="8">
          <label>注册时间:</label>
          {{detail.created_at}}
        </i-col>
        <i-col span="24" v-if="detail.identity_front">
          <label>身份证正面:</label>
          <img class="card" @click="handleView(detail.identity_front)" :src="detail.identity_front">
        </i-col>
        <i-col span="24" v-if="detail.identity_reverse">
          <label>身份证反面:</label>
          <img class="card" @click="handleView(detail.identity_reverse)" :src="detail.identity_reverse">
        </i-col>
      </Row>
    </div>
    <Modal title="查看图片" v-model="visible">
      <img :src="image" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import { member } from '@/api/member'
export default {
  props: ['id'],
  data () {
    return {
      detail: {},
      image: '',
      visible: false
    }
  },
  methods: {
    handleView (image) {
      this.image = image
      this.visible = true
    }
  },
  created () {
    member.detail(this.id).then(res => {
      if (res.data.code === 200) {
        this.detail = res.data.data
      }
    })
  }
}
</script>

<style lang="less" scoped>
.wrap {
  label {
    line-height: 30px;
    margin-right: 10px;
    font-weight: 600;
    color: #464c5b;
  }
  .card {
    height: 100px;
  }
}
</style>

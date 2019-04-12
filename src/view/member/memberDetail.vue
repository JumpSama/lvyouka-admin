<template>
  <div>
    <div class="wrap">
      <Row type="flex">
        <i-col span="12">
          <label>姓名:</label>
          {{detail.name}}
        </i-col>
      </Row>
      <Row type="flex">
        <i-col span="12">
          <label>性别:</label>
          {{detail.sex == 1 ? '男' : detail.sex == 2 ? '女' : '未知'}}
        </i-col>
      </Row>
      <Row type="flex">
        <i-col span="12">
          <label>手机:</label>
          {{detail.phone}}
        </i-col>
      </Row>
      <Row type="flex">
        <i-col span="12">
          <label>身份证:</label>
          {{detail.identity}}
        </i-col>
      </Row>
      <Row type="flex">
        <i-col span="12">
          <label>会员状态:</label>
          {{detail.status == 1 ? '正常' : '已过期'}}
        </i-col>
      </Row>
      <Row type="flex">
        <i-col span="12">
          <label>过期时间:</label>
          {{detail.status == 1 ? detail.overdue : '已过期'}}
        </i-col>
      </Row>
      <Row type="flex" v-if="detail.avatar">
        <i-col span="12">
          <label>头像:</label>
          <img class="image" @click="handleView(detail.avatar)" :src="detail.avatar">
        </i-col>
      </Row>
      <Row type="flex" v-if="detail.identity_front">
        <i-col span="12">
          <label>身份证正面:</label>
          <img class="image" @click="handleView(detail.identity_front)" :src="detail.identity_front">
        </i-col>
      </Row>
      <Row type="flex" v-if="detail.identity_reverse">
        <i-col span="12">
          <label>身份证反面:</label>
          <img class="image" @click="handleView(detail.identity_reverse)" :src="detail.identity_reverse">
        </i-col>
      </Row>
    </div>
    <Modal title="查看图片" v-model="visible">
      <img :src="image" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      image: '',
      visible: false
    }
  },
  methods: {
    handleView (image) {
      this.image = image
      this.visible = true
    }
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
  .image {
    height: 100px;
  }
}
</style>

<template>
  <div>
    <div class="wrap">
      <Row type="flex">
        <i-col span="24">
          <label>身份证正面:</label>
          <img class="card" @click="handleView(identity_front)" :src="identity_front">
        </i-col>
        <i-col span="24">
          <label>身份证反面:</label>
          <img class="card" @click="handleView(identity_reverse)" :src="identity_reverse">
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
  props: ['identity_front', 'identity_reverse'],
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
  .card {
    height: 100px;
  }
}
</style>

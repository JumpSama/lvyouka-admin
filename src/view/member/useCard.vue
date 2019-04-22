<template>
  <div>
    <Row>
      <i-col :span="8" :offset="8">
        <Card>
          <p slot="title">
            <Icon type="md-card" />
            刷卡
          </p>
          <Button type="primary" long @click="openModal('card')">刷卡</Button>
        </Card>
      </i-col>
    </Row>
    <br>
    <br>
    <Row>
      <i-col :span="8" :offset="8">
        <Card>
          <p slot="title">
            <Icon type="md-qr-scanner" />
            扫描
          </p>
          <Button type="success" long @click="openModal('scan')">扫描</Button>
        </Card>
      </i-col>
    </Row>
    <Modal
      v-model="editModal.state"
      @on-visible-change="editModalVisibleChange"
      :title="editModal.title"
    >
      <getMember ref="editComponents" :type="editModal.type" @callback="editModalCallBack"></getMember>
      <div slot="footer">
        <Row :gutter="16" type="flex" justify="end">
          <Button @click="editModalCancelHandle">取消</Button>
          <Button type="primary" @click="editModalSaveHandle">确认</Button>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
import getMember from './getMember.vue'
export default {
  components: {
    getMember
  },
  data () {
    return {
      editModal: {
        state: false,
        title: '刷卡',
        type: ''
      }
    }
  },
  methods: {
    openModal (type) {
      this.editModal = {
        type,
        state: true,
        title: type === 'card' ? '刷卡' : '扫描'
      }
    },
    // 关闭modal
    editModalCancelHandle () {
      this.editModal.type = ''
      this.editModal.state = false
    },
    // 保存修改
    editModalSaveHandle () {
      this.$refs.editComponents.validateForm()
    },
    // 回调
    editModalCallBack () {
      this.editModalCancelHandle()
    },
    // modal状态切换
    editModalVisibleChange (state) {
      if (!state) this.$refs.editComponents.resetData()
    }
  }
}
</script>

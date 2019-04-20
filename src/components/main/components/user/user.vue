<template>
  <div>
    <div class="user-avator-dropdown">
      <Dropdown @on-click="handleClick">
        <Badge>
          <Avatar :src="avatar"/>&nbsp;
          <span>{{userName}}</span>
        </Badge>
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
        <DropdownMenu slot="list">
          <DropdownItem name="password">修改密码</DropdownItem>
          <DropdownItem name="logout">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <Modal v-model="passwordModal.state" title="修改密码">
      <password @callback="passwordModalCallBack" ref="passwordComponents"/>
      <div slot="footer">
        <Row :gutter="16" type="flex" justify="end">
          <Button @click="passwordModalCancelHandle">取消</Button>
          <Button type="primary" @click="passwordModalSaveHandle">保存</Button>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import avatar from '@/assets/images/avatar.png'
import password from './password.vue'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  components: {
    password
  },
  props: {
    userName: {
      type: String,
      default: ''
    },
    userAvator: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      avatar,
      passwordModal: {
        state: false
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'password':
          this.passwordModal.state = true
          break
      }
    },
    // 关闭modal
    passwordModalCancelHandle () {
      this.passwordModal.state = false
      this.$refs.passwordComponents.$refs.formValidate.resetFields()
    },
    // 保存修改
    passwordModalSaveHandle () {
      this.$refs.passwordComponents.validateForm()
    },
    // 回调
    passwordModalCallBack () {
      this.passwordModalCancelHandle()
    }
  }
}
</script>

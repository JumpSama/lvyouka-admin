<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login-body">
    <Card title="欢迎登录" class="login-card" :bordered="false">
      <div class="login-title uk-text-center">
        <h2 style="margin-top:10px; color:#1E7FB8">文化旅游卡管理系统</h2>
      </div>
      <div class="login-form" style="padding:20px">
        <Form
          ref="formLogin"
          :model="formLogin"
          :rules="ruleLogin"
          @keydown.enter.native="handleSubmit"
        >
          <FormItem prop="userName">
            <Input type="text" v-model="formLogin.userName" placeholder="请输入用户名" size="large">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formLogin.password" placeholder="请输入密码" size="large">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem class="uk-text-center uk-margin-top">
            <Button type="primary" long @click="handleSubmit">登录</Button>
          </FormItem>
        </Form>
        <Spin size="large" fix v-if="loading"></Spin>
      </div>
    </Card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      loading: false,
      formLogin: {
        userName: '',
        password: ''
      },
      ruleLogin: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '密码不能小于6位数',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit ({
      userName = this.formLogin.userName,
      password = this.formLogin.password
    }) {
      this.$refs.formLogin.validate(valid => {
        if (valid) {
          this.loading = true
          this.handleLogin({ userName, password })
            .then(res => {
              this.getUserInfo().then(res => {
                this.$router.push({
                  name: 'home'
                })
              })
            })
            .catch(res => {
              this.loading = false
              this.$Message.error(res || '登录失败')
            })
        }
      })
    }
  }
}
</script>

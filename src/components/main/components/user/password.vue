<template>
  <div>
    <Form :label-width="100" ref="formValidate" :model="params" :rules="ruleValidate">
      <FormItem label="旧密码" prop="oldpassword">
        <Input type="password" v-model="params.oldpassword"/>
      </FormItem>
      <FormItem label="新密码" prop="password">
        <Input type="password" v-model="params.password"/>
      </FormItem>
      <FormItem label="确认新密码" prop="repassword">
        <Input type="password" v-model="params.repassword"/>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { password } from '@/api/user'
export default {
  data () {
    const pwdCheckValidate = (rule, value, callback) => {
      if (value !== this.params.password) {
        return callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      params: {
        oldpassword: '',
        password: '',
        repassword: ''
      },
      ruleValidate: {
        oldpassword: [
          { required: true, message: '请填写旧密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写新密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码最少为6位', trigger: 'blur' },
          {
            type: 'string',
            max: 12,
            message: '密码最大为12位',
            trigger: 'blur'
          }
        ],
        repassword: [
          { required: true, message: '请重复新密码', trigger: 'blur' },
          { required: true, validator: pwdCheckValidate, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validateForm () {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          this.edit()
        }
      })
    },
    edit () {
      password(this.params).then(res => {
        if (res) {
          if (res.data.code === 200) {
            this.$Message.success('密码修改成功')
          } else {
            this.$Message.error('密码修改失败')
          }
          this.$emit('callback')
        }
      })
    }
  }
}
</script>

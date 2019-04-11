<template>
  <div>
    <Form ref="formValidate" :label-width="80" :model="params" :rules="ruleValidate">
      <FormItem label="用户名称" prop="name">
        <Input type="text" v-model="params.name"/>
      </FormItem>
      <FormItem label="用户账号" prop="account">
        <Input type="text" v-model="params.account"/>
      </FormItem>
      <FormItem label="用户角色" prop="role">
        <Select v-model="params.role">
          <Option v-for="(item,i) in roles" :value="+i" :key="i">{{ item }}</Option>
        </Select>
      </FormItem>
      <p style="padding-left: 80px;">新添加用户默认密码为123456</p>
    </Form>
  </div>
</template>

<script>
import { role, user } from '@/api/user'
export default {
  name: 'add',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    const validateAccount = (rule, value, callback) => {
      if (!value) callback(new Error('请填写用户账号'))
      else if (!/^[A-Za-z0-9]+$/.test(value)) callback(new Error('账号只能由字母和数字组成'))
      else callback()
    }
    return {
      roles: [],
      ruleValidate: {
        name: [{ required: true, message: '请填写用户名称', trigger: 'blur' }],
        account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
        role: [{ required: true, message: '请选择用户角色' }]
      }
    }
  },
  methods: {
    validateForm () {
      console.log(this.params)
      this.$refs['formValidate'].validate(valid => {
        if (valid) this.store()
      })
    },
    getRole () {
      role.all().then(res => {
        let d = res.data
        if (d && d.code === 200) this.roles = d.data
      })
    },
    // 添加
    store () {
      user.store(this.params).then(res => {
        let d = res.data
        if (d.code === 200) {
          this.$Message.success(d.msg)
          this.$emit('callback')
        } else {
          this.$Message.error(d.msg)
        }
      })
    }
  },
  mounted () {
    this.getRole()
  }
}
</script>

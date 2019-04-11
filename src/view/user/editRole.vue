<template>
  <div>
    <Form ref="formValidate" :label-width="80" :model="params" :rules="ruleValidate">
      <FormItem label="角色名称" prop="name">
        <Input type="text" v-model="params.name"/>
      </FormItem>
      <FormItem label="权限选择" prop="ids">
        <CheckboxGroup v-model="params.ids">
          <Checkbox v-for="(item,i) in menus" :key="i" :label="+i">{{item}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { role } from '@/api/user'
export default {
  name: 'add',
  props: {
    params: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    const validateMenu = (rule, value, callback) => {
      if (this.params.ids.length > 0) callback()
      else callback(new Error('请选择权限'))
    }
    return {
      menus: [],
      ruleValidate: {
        name: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
        ids: [{ required: true, validator: validateMenu, trigger: 'blur' }]
      }
    }
  },
  methods: {
    validateForm () {
      this.$refs['formValidate'].validate(valid => {
        if (valid) this.store()
      })
    },
    getMenu () {
      role.menu().then(res => {
        let d = res.data
        if (d && d.code === 200) this.menus = d.data
      })
    },
    // 添加
    store () {
      role.store(this.params).then(res => {
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
    this.getMenu()
  }
}
</script>

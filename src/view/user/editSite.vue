<template>
  <div>
    <Form ref="formValidate" :label-width="100" :model="params" :rules="ruleValidate">
      <FormItem label="场所名称" prop="name">
        <Input type="text" v-model="params.name" placeholder="请填写场所名称"/>
      </FormItem>
      <FormItem label="场所项目">
        <Button type="dashed" long @click="handleAdd" icon="md-add">添加项目</Button>
      </FormItem>
      <FormItem v-for="(item, index) in items" :key="index" :label="'项目 ' + (index+1)">
        <Row>
          <i-col span="9">
            <Input type="text" v-model="item.item_name" placeholder="项目名称"/>
          </i-col>
          <i-col span="7" offset="1">
            <Input type="text" v-model="item.item_count" placeholder="使用次数"/>
          </i-col>
          <i-col span="6" offset="1">
            <Button type="error" @click="handleRemove(index)">删除</Button>
          </i-col>
        </Row>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { site } from '@/api/user'
export default {
  name: 'edit',
  props: {
    params: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      items: [],
      ruleValidate: {
        name: [{ required: true, message: '请填写场所名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleAdd () {
      this.items.push({ item_name: '', item_count: '' })
    },
    handleRemove (index) {
      this.items.splice(index, 1)
    },
    validateForm () {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          if (this.items.length < 1) {
            this.$Message.error('请至少添加一个项目')
            return
          }
          for (let i in this.items) {
            let item = this.items[i]
            if (!item.item_name || !item.item_count) {
              this.$Message.error('请将项目信息填写完整')
              return
            }
            if (!/^[1-9]\d*$/.test(item.item_count)) {
              this.$Message.error('请确保项目使用次数为正整数')
              return
            }
          }
          this.store()
        }
      })
    },
    // 添加分类
    store () {
      let data = {}
      Object.assign(data, this.params)
      data.items = JSON.stringify(this.items)
      site.store(data).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.$emit('callback')
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 重置表单
    resetForm () {
      this.items = []
      this.$refs.formValidate.resetFields()
    }
  },
  watch: {
    'params' () {
      if (this.params.items) this.items = this.params.items
    }
  }
}
</script>

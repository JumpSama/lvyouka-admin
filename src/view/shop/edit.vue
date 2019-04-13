<template>
  <div>
    <Form :label-width="80" ref="formValidate" :model="params" :rules="ruleValidate">
      <FormItem label="商品状态" prop="status">
        <RadioGroup v-model="params.status">
          <Radio v-for="(item, i) in status" :key="i" :label="item.value">{{item.name}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="商品名称" prop="name">
        <Input v-model="params.name" placeholder="请输入商品名称"/>
      </FormItem>
      <FormItem label="积分价格" prop="price">
        <Input v-model="params.price" placeholder="请输入积分价格"/>
      </FormItem>
      <FormItem label="商品库存" prop="stock">
        <Input v-model="params.stock" placeholder="请输入商品库存"/>
      </FormItem>
      <FormItem label="商品主图" prop="image">
        <uploadImage v-model="params.image" :dir="dir"/>
      </FormItem>
      <FormItem label="商品图片" prop="banner">
        <uploadImages ref="uploadImages" v-model="params.banner" :dir="dir"></uploadImages>
      </FormItem>
      <FormItem label="商品详情" prop="content" v-if="renderEditor">
        <Editor v-model="params.content"></Editor>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import Editor from '_c/richEditor'
import uploadImage from '_c/upload/uploadImage'
import uploadImages from '_c/upload/uploadImages'
import { commodity } from '@/api/shop'
export default {
  name: 'editCommodity',
  props: {
    params: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    Editor,
    uploadImage,
    uploadImages
  },
  data () {
    const validatePrice = (rule, value, callback) => {
      if (!value) callback(new Error('请填写积分价格'))
      else if (!/^[1-9]\d*|0$/.test(value)) callback(new Error('请正确填写积分价格'))
      else callback()
    }
    const validateStock = (rule, value, callback) => {
      if (!value) callback(new Error('请填写商品库存'))
      else if (!/^[1-9]\d*|0$/.test(value)) callback(new Error('请正确填写商品库存'))
      else callback()
    }
    return {
      dir: 'shop',
      status: [
        { value: 1, name: '上架' },
        { value: 0, name: '下架' }
      ],
      renderEditor: false,
      ruleValidate: {
        status: [{ required: true, message: '请选择商品状态' }],
        name: [{ required: true, message: '请填写商品名称' }],
        price: [{ required: true, validator: validatePrice }],
        stock: [{ required: true, validator: validateStock }],
        image: [{ required: true, message: '请上传商品主图', trigger: 'blur' }],
        banner: [{ required: true, message: '请上传商品轮播图' }],
        content: [{ required: true, message: '请填写内容' }]
      }
    }
  },
  methods: {
    validateForm () {
      this.$refs['formValidate'].validate(valid => {
        if (valid) this.store()
      })
    },
    // 保存
    store () {
      commodity.store(this.params).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.$emit('callback')
        } else this.$Message.error(res.data.msg)
      })
    }
  },
  watch: {
    'params': function () {
      this.renderEditor = false
      this.$nextTick(() => {
        this.renderEditor = true
      })
    }
  }
}
</script>

<template>
  <div>
    <div class="demo-upload-list" v-for="item in uploadList" :key="item.url">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="viewHandle(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="removeHandle(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :headers="headers"
      :name="name"
      :show-upload-list="false"
      :data="params"
      :action="baseURL + url"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png','bmp']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      type="drag"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="modal.visible">
      <img :src="modal.imgSrc" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import config from '@/config'
import { getToken } from '@/libs/util'
export default {
  model: {
    prop: 'imgSrc',
    event: 'input'
  },
  props: {
    maxLen: {
      default: () => 5
    },
    imgSrc: {
      default: () => ''
    },
    name: {
      default: () => 'image'
    },
    url: {
      default: () => 'upload/image'
    },
    dir: {
      default: () => 'images'
    }
  },
  data () {
    return {
      params: {
        dir: this.dir
      },
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      modal: {
        imgSrc: '',
        visible: false
      },
      defaultList: [],
      uploadList: [],
      baseURL: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    }
  },
  methods: {
    viewHandle (url) {
      this.modal.visible = true
      this.modal.imgSrc = url
    },
    removeHandle (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.emitHandle(this.$refs.upload.fileList)
    },
    handleSuccess (res, file, fileList) {
      if (res.code === 200) {
        file.url = res.data.url
        file.name = res.data.url
        this.emitHandle(fileList)
      } else {
        this.$Message.error(res.msg)
      }
    },
    handleFormatError (file) {
      this.$Message.error('文件格式不正确')
    },
    handleMaxSize (file) {
      this.$Message.error('请上传2M以内的图片')
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < this.maxLen
      if (!check) {
        this.$Message.error(`最多上传${this.maxLen}张图片。`)
      }
      return check
    },
    emitHandle (arr) {
      let list = []
      arr.forEach(item => {
        list.push(item.url)
      })
      this.$emit('input', JSON.stringify(list))
    },
    clearImages () {
      this.uploadList = []
      this.$refs.upload.clearFiles()
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
  },
  created () {
    if (this.imgSrc) {
      JSON.parse(this.imgSrc).forEach(item => {
        this.defaultList.push({
          name: item,
          url: item
        })
      })
    }
  }
}
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>

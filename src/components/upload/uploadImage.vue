<template>
  <div>
    <div class="demo-upload-list" v-if="value">
      <img :src="value">
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="viewHandle()"></Icon>
        <Icon type="ios-trash-outline" @click.native="removeHandle()"></Icon>
      </div>
    </div>
    <Upload
      ref="upload"
      class="demo-upload"
      :before-upload="handleBeforeUpload"
      type="drag"
      :show-upload-list="false"
      :headers="headers"
      :name="name"
      :on-success="uploadSuccessHandle"
      :data="params"
      :action="baseUrl + url"
    >
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或拖拽上传文件</p>
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
      value: this.imgSrc,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      params: {
        dir: this.dir
      },
      modal: {
        imgSrc: '',
        visible: false
      },
      uploadList: [],
      baseUrl: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
  },
  methods: {
    viewHandle () {
      this.modal.visible = true
      this.modal.imgSrc = this.value
    },
    removeHandle () {
      this.value = ''
      this.$refs.upload.clearFiles()
    },
    uploadSuccessHandle (res) {
      if (res.code === 200) this.value = res.data.url
      else this.$Message.error(res.msg)
    },
    handleBeforeUpload () {
      if (this.value) {
        this.$Message.warning('最多只能上传一张图片')
        return false
      }
      return true
    }
  },
  watch: {
    value: function () {
      this.$emit('input', this.value)
      if (!this.value) {
        this.$refs.upload.clearFiles()
      }
    },
    imgSrc: function () {
      this.value = this.imgSrc
    }
  }
}
</script>

<style lang="less" scoped>
.demo-upload-list {
  display: inline-block;
  width: 200px;
  height: 126px;
  text-align: center;
  line-height: 126px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  vertical-align: top;
}
.demo-upload {
  display: inline-block;
  width: 200px;
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

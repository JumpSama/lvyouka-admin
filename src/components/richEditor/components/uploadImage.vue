<template>
  <div class="upload-container">
    <Button
      type="primary"
      size="default"
      icon="ios-cloud-upload-outline"
      @click="dialogVisible=true"
    >上传图片</Button>
    <Modal
      v-model="dialogVisible"
      width="50%"
      title="上传图片"
      @on-ok="handleSubmit"
    >
      <div
        class="upload-list"
        v-for="item in uploadList"
        :key="item.name"
      >
        <template v-if="item.status === 'finished'">
          <img :src="item.url">
          <div class="upload-list-cover">
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(item)"
            ></Icon>
          </div>
        </template>
        <template v-else>
          <Progress
            v-if="item.showProgress"
            :percent="item.percentage"
            hide-info
          ></Progress>
        </template>
      </div>
      <Upload
        ref="upload"
        multiple
        type="drag"
        name="image"
        :headers="headers"
        :data="params"
        :show-upload-list="false"
        :format="['jpg','jpeg','png','bmp']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="handleBeforeUpload"
        :action="baseURL + url"
      >
        <div style="padding: 20px 0">
          <Icon
            type="ios-cloud-upload"
            size="52"
            style="color: #3399ff"
          ></Icon>
          <p>点击上传或拖拽图片至此</p>
        </div>
      </Upload>
    </Modal>
  </div>
</template>

<script>
import config from '@/config'
import { getToken } from '@/libs/util'
export default {
  name: 'uploadImagePlugin',
  data () {
    return {
      url: 'upload/image',
      params: {
        dir: 'article'
      },
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      dialogVisible: false,
      uploadList: [],
      baseURL: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    }
  },
  methods: {
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      if (res.code === 200) {
        file.url = res.data.url
        file.name = res.data.url
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
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: `最多上传${this.maxLen}张图片。`
        })
      }
      return check
    },
    handleSubmit () {
      const arr = this.uploadList
      this.uploadList = []
      this.$emit('successUpload', arr)
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
  }
}
</script>

<style lang="less" scoped>
.editor-slide-upload {
  margin-bottom: 20px;

  .el-upload--picture-card {
    width: 100%;
  }
}

.upload-list {
  display: inline-block;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.upload-list img {
  width: 100%;
  height: 100%;
}

.upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.upload-list:hover .upload-list-cover {
  display: block;
}

.upload-list-cover i {
  color: #fff;
  font-size: 40px;
  cursor: pointer;
  margin: 0 2px;
}
</style>

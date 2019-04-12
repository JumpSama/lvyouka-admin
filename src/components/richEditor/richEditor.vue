<template>
<div class='tinymce tinymce-container editor-container'>
  <editor :id='tinymceId' :value="value" :init='init' @onSelectionChange="getContent"></editor>
  <div class="editor-custom-btn-container" v-if="needImage">
    <uploadImage @successUpload="insertImages"></uploadImage>
  </div>
</div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import Editor from '@tinymce/tinymce-vue'
import uploadImage from './components/uploadImage'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/code'
export default {
  name: 'tinymce',
  components: {
    Editor,
    uploadImage
  },
  props: {
    id: {
      type: String,
      default: function () {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String
    },
    needImage: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tinymceHtml: '请输入内容',
      tinymceId: this.id,
      init: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide',
        height: 500,
        plugins: 'lists code',
        toolbar: 'code | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | removeformat',
        branding: false
      }
    }
  },
  mounted () {
    tinymce.init({})
  },
  methods: {
    insertImages (arr) {
      arr.forEach(v => {
        tinymce.activeEditor.insertContent(`<img style="width:100%;" class="wscnph" src="${v.url}" />`)
      })
    },
    getContent () {
      this.$emit('input', tinymce.activeEditor.getContent())
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
}

.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 10px;
  top: 2px;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>

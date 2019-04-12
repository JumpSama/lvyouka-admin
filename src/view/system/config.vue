<template>
  <Card>
    <p slot="title">
      <Icon type="md-settings"></Icon>
      系统设置
    </p>
    <Form>
      <FormItem
        :label="item.name"
        v-for="(item) in configs"
        :key="item.key"
      >
        <Row>
          <i-col span="10">
          <Editor v-if="item.datatype == 'richtext'" v-model="item.value" :needImage="false"></Editor>
          <Input v-else-if="item.datatype == 'text'" type="textarea" :rows="5" v-model="item.value" />
          <Input v-else type="text" v-model="item.value" />
          <p v-if="item.remarks">{{item.remarks}}</p>
          </i-col>
        </Row>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          @click="save()"
        >保存</Button>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
import Editor from '_c/richEditor'
import { config } from '@/api/system'
export default {
  components: {
    Editor
  },
  data () {
    return {
      configs: []
    }
  },
  methods: {
    save () {
      let configs = JSON.stringify(this.configs)
      config.set({ configs }).then(res => {
        let d = res.data
        if (d.code === 200) {
          this.$Message.success(d.msg)
        } else {
          this.$Message.error(d.msg)
        }
      })
    },
    getList () {
      config.list().then(res => {
        let d = res.data
        if (d.code === 200) {
          let data = d.data
          this.configs = data
        }
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

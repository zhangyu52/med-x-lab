<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="plus" style="margin-left: 16px" @click="handleNew">新建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table size="default" :columns="columns" :data="loadData" :rowKey="record => record.id">
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;">详情</a>
        <a-divider type="vertical" />
        <a v-if="record.status == 1">禁用</a>
        <a v-else>启用</a>
        <a-divider type="vertical" />
        <a href="javascript:;">删除</a>
      </span>
      <span slot="createdAt" slot-scope="createdAt">{{ createdAt | fromNow }}</span>
      <span slot="status" slot-scope="status">{{ status == 1 ? '正常' : '禁用' }}</span>
    </s-table>

    <a-modal title="新建设备类型" :width="800" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备类型名称">
          <a-input placeholder="请输入设备类型名称" v-model="mdl.name" id="name" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
          <a-select v-model="mdl.status">
            <a-select-option value="1">正常</a-select-option>
            <a-select-option value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
          <a-input v-model="mdl.describe" placeholder id="describe" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参数选择">
          <a-transfer
            :listStyle="{width: '228px', height: '228px',}"
            :dataSource="mockData"
            :titles="['待选参数', '已选参数']"
            :targetKeys="targetKeys"
            :selectedKeys="selectedKeys"
            :render="item=>item.name"
            @change="handleChange"
            @selectChange="handleSelectChange"
            :disabled="disabled"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { getParameters, addDeviceType, getDeviceTypes } from '@/api/device'
import { STable } from '@/components'
import moment from 'moment'
export default {
  beforeCreate() {
    console.log('beforeCreate()', this.$el, this.$data)
  },
  created() {
    // 已初始化 data 数据，但数据未挂载到模板中
    console.log('created()', this.$el, this.$data)
  },
  beforeMount() {
    // 模板已获取到，但是数据未挂载到模板上
    console.log('beforeMount()', this.$el, this.$data)
  },
  mounted() {
    // 编译完成 ，数据已挂载到模板中
    console.log('mounted()', this.$el, this.$data)
  },
  beforeUpdate() {
    // 当 data 改变后，去更新模板中的数据前调用
    // 注意：浏览器问题，需使用 this.$el.innerHTML 获取更新前的 Dom 模板数据
    console.log('beforeUpdate()', this.$el.innerHTML, this.$data)
  },
  updated() {
    // data 被 Vue 渲染之后的 Dom 数据模板
    console.log('updated()', this.$el.innerHTML, this.$data)
  },
  beforeDestroy() {
    // 销毁实例前调用
    console.log('beforeDestroy()')
  },
  destroyed() {
    // 销毁实例后调用
    console.log('created()')
  },
  data() {
    const mockData = []
    for (let i = 0; i < 20; i++) {
      mockData.push({
        key: i.toString(),
        title: `参数参数参数参数参数${i + 1}`,
        description: `description of content${i + 1}`
      })
    }

    const oriTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key)

    return {
      visible: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      mdl: {},

      mockData: [],
      targetKeys: [],
      selectedKeys: [],
      disabled: false,
      parameters: [],
      loadData: () => {
        return getDeviceTypes().then(res => {
          console.log('getDeviceTypes', res)
          return res.data
        })
      },
      columns: [
        {
          title: '设备类型名称',
          dataIndex: 'name'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: '描述',
          dataIndex: 'desc'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },

  components: {
    STable
  },

  methods: {
    handleNew() {
      this.visible = true
      this.mockData.length = 0
      getParameters().then(res => {
        this.parameters = res.data.data
        this.parameters.map(parameter => {
          this.mockData.push({
            key: parameter.id,
            name: parameter.name,
            title: parameter.desc
          })
        })
        console.log(JSON.stringify(this.mockData))
      })
    },
    handleOk() {
      console.log(JSON.stringify(this.targetKeys))

      this.form.validateFields((err, values) => {
        console.log(JSON.stringify(this.mdl))
        if (!err) {
          console.log(JSON.stringify(this.mdl))

          addDeviceType(this.mdl).then(res => {
            this.visible = false
            this.form.resetFields()
            this.$message.success('设备类型创建成功')
          })
        }
      })
    },
    handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys

      console.log('targetKeys: ', nextTargetKeys)
      console.log('direction: ', direction)
      console.log('moveKeys: ', moveKeys)
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]

      console.log('sourceSelectedKeys: ', sourceSelectedKeys)
      console.log('targetSelectedKeys: ', targetSelectedKeys)
    }
  },
  filters: {
    fromNow(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
</style>
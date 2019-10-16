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

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :rowKey="record => record.id"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;">禁用</a>
        <a-divider type="vertical" />
        <a href="javascript:;">删除</a>
      </span>
      <span slot="status" slot-scope="status">{{ status == 1 ? '正常' : '禁用' }}</span>
    </s-table>

    <a-modal title="新建参数类型" :width="800" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参数名称">
          <a-input  v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入参数名称'}, {validator: validate}], validateTrigger: ['change', 'blur']}
          ]" placeholder="请输入参数名称" id="name"/>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参数单位">
          <a-input placeholder="请输入参数单位" v-model="mdl.unit" id="unit" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="默认间隔时间">
          <a-input placeholder="请输入默认间隔时间" v-model="mdl.interval" id="interval" addonAfter="秒"/>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
          <a-select v-model="mdl.status">
            <a-select-option value="1">正常</a-select-option>
            <a-select-option value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参数描述">
          <a-input v-model="mdl.describe" placeholder id="describe" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { getParameters, addParameter } from '@/api/device'
import { STable } from '@/components'
export default {
  created() {
    getParameters().then(res => {
      this.data = res.data
    })
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      columns: [
        {
          title: '参数名称',
          dataIndex: 'name'
        },
        {
          title: '参数单位',
          dataIndex: 'unit'
        },
        {
          title: '默认间隔时间(秒)',
          dataIndex: 'interval',
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
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
      ],
      mdl: {},
      loadData: () => {
        return getParameters().then(res => {
          return res.data
        })
      }
    }
  },

  components: {
      STable
  },

  methods: {
    handleNew() {
      this.visible = true
    },
    newParameter() {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      })
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          addParameter(this.mdl).then(res => {
              this.visible = false
              this.form.resetFields()
              this.$message.success('参数创建成功');
          })
        }
      })
    },
    validate(rule, value, callback) {
      let exist = false
      getParameters().then(res => {
        res.data.data.map(item => {
          if (value == item.name) {
            exist = true
          }
        })
        if (exist) {
          callback(new Error('同名标识符已存在'))
        }
        callback()
      })
    }
  }
}
</script>

<style scoped>
</style>
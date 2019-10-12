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

    <a-modal title="新建设备" :width="800" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备名称">
          <a-input placeholder="请输入设备名称" v-model="mdl.name" id="name" />
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

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备类型">
          <a-select v-model="mdl.deviceType">
            <a-select-option
              v-for="deviceType in deviceTypes"
              :key="deviceType.id"
            >{{deviceType.name}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { getDeviceTypes, addDevice, getDevices } from '@/api/device'
import { STable } from '@/components'
import moment from 'moment'
export default {
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
      mdl: {},
      deviceTypes: [],
      columns: [
        {
          title: '设备名称',
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
          title: '设备类型',
          dataIndex: 'device_type.name',
          scopedSlots: { customRender: 'device_type.name' }
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
      loadData: () => {
        return getDevices().then(res => {
          console.log('getDeviceTypes', res)
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
      getDeviceTypes().then(res => {
        this.deviceTypes = res.data.data
        console.log(JSON.stringify(this.deviceTypes))
      })
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          addDevice(this.mdl).then(res => {
            this.visible = false
            this.form.resetFields()
            this.$message.success('设备创建成功')
          })
        }
      })
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
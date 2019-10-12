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
      size="default"
      ref="table"
      :columns="columns"
      :data="loadData"
      :rowKey="record => record.id"
      :showPagination="true"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleDetail(record)">详情</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="handleEdit(record)">编辑</a>
            </a-menu-item>
            <a-menu-item>
              <a v-if="record.status" @click="handleToggle(record, false)">禁用</a>
              <a v-else @click="handleToggle(record, true)">启用</a>
            </a-menu-item>
            <a-menu-item :disabled="record.hasUser">
              <span v-if="record.hasUser">删除</span>
              <a v-else @click="handleDelete(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
      <span slot="createdAt" slot-scope="createdAt">{{ createdAt | fromNow }}</span>
      <span slot="status" slot-scope="status">{{ status == 1 ? '正常' : '禁用' }}</span>
    </s-table>

    <a-modal title="新建用户" :width="800" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户登录名">
          <a-input placeholder="请输入用户登录名" v-model="mdl.login_name" id="login_name" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户显示名">
          <a-input placeholder="请输入用户显示名" v-model="mdl.name" id="name" />
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

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户权限组">
          <a-select v-model="mdl.user_group_id">
            <a-select-option v-for="userGroup in userGroups" :key="userGroup.id">{{userGroup.describe}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getUserGroups, addUser, getUsers } from '@/api/user'
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
      userGroups: [],
      columns: [
        {
          title: '用户登录名',
          dataIndex: 'login_name'
        },
        {
          title: '用户显示名',
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
          sorter: true,
          defaultSortOrder: ['ASC', 'DESC', null],
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getUsers(parameter).then(res => {
          return res.data
        })
      },
    }
  },

  components: {
    STable
  },

  methods: {
    handleNew() {
      getUserGroups().then(res => {
        this.userGroups = res.data.data
      })
      this.visible = true
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(JSON.stringify(this.mdl))
          addUser(this.mdl).then(res => {
            this.visible = false
            this.form.resetFields()
            this.$message.success('用户创建成功')
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
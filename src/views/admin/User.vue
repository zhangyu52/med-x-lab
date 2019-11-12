<template>
  <a-card :bordered="false" style="background: #dddddd;">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button
                type="primary"
                icon="plus"
                style="margin-left: 16px"
                @click="handleNewUser"
              >新建账号</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      size="small"
      ref="table"
      :columns="columns"
      :data="loadData"
      :rowKey="record => record.id"
      :showPagination="true"
      bordered style="background: #dddddd;"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="record.status == 1" @click="disableUser(record)">停用</a>
        <a v-else @click="enableUser(record)">激活</a>
        <a-divider type="vertical" />
        <a @click="editUser(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="deleteUser(record)" :disabled="record.status != 0">删除</a>
        <a-divider type="vertical" />
        <a @click="resetPassword(record)">重置密码</a>
      </span>
      <span slot="sex" slot-scope="text">{{text == 1? '男' : '女'}}</span>
      <span slot="enploymentDate" slot-scope="text">{{text | fromNow}}</span>
      <span
        slot="validDate"
        slot-scope="text, record"
      >{{record.validFromDate | fromNow}} ~ {{record.validToDate | fromNow}}</span>
      <span slot="status" slot-scope="status">{{ status | statusFilter }}</span>
    </s-table>
    <add-user-modal ref="addModal" @OK="refreshData()"></add-user-modal>
    <activate-user-modal ref="activateModal" @OK="refreshData()"></activate-user-modal>
    <reset-password-modal ref="resetPasswordModal" @OK="resetPasswordCallback()"></reset-password-modal>
    <edit-user-modal ref="editModal"></edit-user-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getUserGroups, addUser, getUsers, disableUser, deleteUser } from '@/api/user'
import AddUserModal from './modules/AddUserModal'
import ActivateUserModal from './modules/ActivateUserModal'
import ResetPasswordModal from './modules/ResetPasswordModal'
import EditUserModal from './modules/EditUserModal'
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
          title: '用户ID',
          dataIndex: 'id',
          align: 'center'
        },
        {
          title: '用户账号',
          dataIndex: 'userCode',
          align: 'center'
        },
        {
          title: '用户姓名',
          dataIndex: 'userName',
          align: 'center'
        },
        {
          title: '所属部门',
          dataIndex: 'department'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '入职日期',
          dataIndex: 'enploymentDate',
          scopedSlots: { customRender: 'enploymentDate' }
        },
        {
          title: '账号有效期',
          dataIndex: 'validFromDate',
          scopedSlots: { customRender: 'validDate' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '225px',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getUsers(parameter).then(res => {
          return res.data
        })
      }
    }
  },

  components: {
    STable,
    AddUserModal,
    ActivateUserModal,
    ResetPasswordModal,
    EditUserModal
  },

  methods: {
    handleNewUser() {
      this.$refs.addModal.add()
    },
    disableUser(record) {
      disableUser({id: record.id}).then(response => {
        this.$refs.table.refresh()
      })
    },
    enableUser(record) {
      this.$refs.activateModal.add(record)
    },
    editUser(record) {
      this.$refs.editModal.add(record)
    },
    deleteUser(record) {
      deleteUser(record).then(response => {
        console.log(JSON.stringify(response))
        this.$refs.table.refresh()
      })
    },
    resetPassword(record) {
      this.$refs.resetPasswordModal.add(record)
    },
    refreshData() {
      this.$refs.table.refresh()
    },
    resetPasswordCallback() {
      this.$message.success('密码重置成功');
    }
  },
  filters: {
    fromNow(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    statusFilter(status) {
      if (status == 0) return '未激活'
      else if (status == 1) return '激活'
      else if (status == 2) return '停用'
    }
  }
}
</script>

<style scoped>
</style>
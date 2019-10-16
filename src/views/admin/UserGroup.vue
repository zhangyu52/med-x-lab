<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
              <a-button
                type="primary"
                icon="plus"
                style="margin-left: 16px"
                @click="$refs.addModal.add()"
              >新建</a-button>
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
    <add-group-modal ref="addModal" @ok="handleOk"></add-group-modal>
    <detail-group-modal ref="detailModal"></detail-group-modal>
    <edit-group-modal ref="editModal"></edit-group-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getUserGroups, updateUserGroup, deleteUserGroup } from '@/api/user'
import AddGroupModal from './modules/AddGroupModal'
import DetailGroupModal from './modules/DetailGroupModal'
import EditGroupModal from './modules/EditGroupModal'
import moment from 'moment'
export default {
  created() {},
  data() {
    return {
      columns: [
        {
          title: '用户组唯一识别码',
          dataIndex: 'name'
        },
        {
          title: '用户组名称',
          dataIndex: 'describe'
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
        return getUserGroups(parameter).then(res => {
          return res.data
        })
      },
      isDelete: true
    }
  },

  components: {
    STable,
    AddGroupModal,
    DetailGroupModal,
    EditGroupModal
  },

  methods: {
    handleOk() {
      this.$notification.success({
        message: '用户组创建成功',
        description: ``
      })
      this.$refs.table.refresh()
    },
    handleEdit(record) {
      this.$refs.editModal.init(record.id)
    },
    handleDetail(record) {
      this.$refs.detailModal.init(record.id)
    },
    handleToggle(record, status) {
      record.status = status
      updateUserGroup(record).then(res => {
        this.$refs.table.refresh()
      })
    },
    handleDelete(record) {
      deleteUserGroup(record).then(res => {
        this.$refs.table.refresh()
      })
    },
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
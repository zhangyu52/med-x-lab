<template>
  <a-modal
    title="编辑权限组"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item label="拥有权限">
        <a-row :gutter="16" v-for="(permission, index) in permissions" :key="index">
          <a-col :xl="4" :lg="24">{{ permission.name }}：</a-col>
          <a-col :xl="20" :lg="24">
            <a-checkbox
              v-if="permission.actionsOptions.length > 0"
              :indeterminate="permission.indeterminate"
              :checked="permission.checkedAll"
              @change="onChangeCheckAll($event, permission)"
            >全选</a-checkbox>
            <a-checkbox-group
              :options="permission.actionsOptions"
              v-model="permission.selected"
              @change="onChangeCheck(permission)"
            />
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getPermissionsNoPager } from '@/api/permission'
import { getUserGroupItems, updateUserGroupItems } from '@/api/user'
export default {
  created() {
    this.loadPermissions()
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      permissions: [],
      record: {},
      user_group_id: null
    }
  },

  components: {},

  methods: {
    close() {
      this.$emit('close')
      this.visible = false
    },
    init(user_group_id) {
      this.user_group_id = user_group_id
      this.visible = true
      this.permissions.map(permission => {
        permission.checkedAll = false
        permission.indeterminate = false
        permission.selected = []
      })
      getUserGroupItems(user_group_id).then(response => {
        this.record = response.data
        this.record.permissions.map(rec => {
          rec.actionEntitySet.map(entry => {
            this.permissions.find(permission => rec.permissionName == permission.name).selected.push(entry.action)
          })
        })

        this.permissions.forEach(permission => {
          permission.indeterminate =
            !!permission.selected.length && permission.selected.length < permission.actionsOptions.length
          permission.checkedAll = permission.selected.length === permission.actionsOptions.length
        })
      })
    },
    handleCancel() {
      this.close()
    },
    handleOk() {
      this.visible = false
      updateUserGroupItems(this.user_group_id, this.permissions).then(res => {
      })
    },
    loadPermissions() {
      getPermissionsNoPager().then(res => {
        const result = res.data.data
        this.permissions = result.map(permission => {
          permission.checkedAll = false
          permission.selected = []
          permission.indeterminate = false
          permission.actionsOptions = permission.actionData.map(option => {
            return {
              label: option.describe,
              value: option.action
            }
          })
          return permission
        })
      })
    },
    onChangeCheck(permission) {
      permission.indeterminate =
        !!permission.selected.length && permission.selected.length < permission.actionsOptions.length
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },
    onChangeCheckAll(e, permission) {
      Object.assign(permission, {
        selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    }
  }
}
</script>

<style scoped>
</style>
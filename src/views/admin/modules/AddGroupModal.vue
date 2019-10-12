<template>
  <a-modal
    title="新增权限组"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item label="权限组唯一标识码" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入权限组唯一标识码' }, { validator: validate }], validateTrigger: ['change', 'blur']}
          ]"
          name="name"
          placeholder="权限组唯一标识码"
        />
      </a-form-item>
      <a-form-item label="权限组名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'describe',
            {rules: [{ required: true, message: '请输入权限组名称' }]}
          ]"
          name="describe"
          placeholder="权限组名称"
        />
      </a-form-item>
      <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          placeholder="请选择状态"
          v-decorator="[ 'status', {rules: [{ required: true, message: '请选择状态'}]} ]"
        >
          <a-select-option value="1">正常</a-select-option>
          <a-select-option value="0">禁用</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="权限组描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-decorator="[ 'comment' ]" name="comment" placeholder="权限组描述" />
      </a-form-item>

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
import { getUserGroups, addUserGroup } from '@/api/user'
import permission from '../../../store/modules/permission'
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
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },

  components: {},

  methods: {
    close() {
      this.$emit('close')
      this.visible = false
    },
    add() {
      this.visible = true
    },
    handleOk() {
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          addUserGroup(values, this.permissions).then(res => {
            this.form.resetFields()
            this.permissions.map(permission => {
              permission.checkedAll = false
              permission.indeterminate = false
              permission.selected = []
            })
            this.close()
            this.confirmLoading = false
            this.$emit('ok', values)
          })
        }
        this.confirmLoading = false
      })
      this.confirmLoading = false
      // this.close()
    },
    handleCancel() {
      this.form.resetFields()
      this.permissions.map(permission => {
        permission.checkedAll = false
        permission.indeterminate = false
        permission.selected = []
      })
      this.close()
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
    validate(rule, value, callback) {
      if(!(/[a-zA-Z][a-zA-Z0-9_]/).test(value)) {
        callback(new Error('标识符必须为纯英文'))
      }
      let exist = false
      getUserGroups().then(res => {
        res.data.data.map(item => {
          if (value == item.name) {
            exist = true
          }
        })
        if (exist) {
          callback(new Error('同名标识码已存在'))
        }
        callback()
      })
    }
  }
}
</script>

<style scoped>
</style>
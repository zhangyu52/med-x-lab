<template>
  <div>
    <a-modal title="编辑用户账号" :width="900" :visible="visible" @cancel="handleCancel">
      <template slot="footer">
        <a-button key="back" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="submit" @click="handleCancel">取消</a-button>
      </template>
      <a-form :form="form" size="small">
        <a-row>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户账号">
              <span>{{ user.userCode }}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户姓名">
              <span>{{ user.userName }}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="性别">
              <span>{{ user.sex == 1 ? '男' : '女'}}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="所属部门">
              <span>{{ user.department }}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="入职日期">
              <span>{{ user.enploymentDate | fromNow }}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="默认语言">
              <a-select size="small" v-decorator="['mdl.language']">
                <a-select-option value="chinese">中文</a-select-option>
                <a-select-option value="english">English</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="账号有效起始日">
              <span>{{ Date.now() | fromNow }}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol2" :wrapper-col="wrapperCol2" label="账号有效截止日">
              <a-date-picker
                v-decorator="['mdl.validToDate', {rules: [{required: true, message: '请选择账号有效截止日' }]}]"
                size="small"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="初始密码">
              <a-input
                type="password"
                placeholder="请输入初始密码"
                size="small"
                v-decorator="['mdl.password', {rules: [{ required: true, message: '请输入密码' }, {min: 6, message: '密码最小长度是6'}], validateTrigger: ['blur']}]"
                @focus="passwordFocus"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="确认密码">
              <a-input
                type="password"
                placeholder="请输入确认密码"
                size="small"
                v-decorator="['mdl.checkPassword', {rules: [{ required: true, message: '请输入确认密码' }, { validator: passwordValidate }], validateTrigger: ['blur', 'change']}]"
                @focus="checkPasswordFocus"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="权限组">
              <a-select
                mode="multiple"
                placeholder="点击选择权限组"
                v-decorator="['mdl.userGroups', {rules: [{ required: true, message: '至少选择一个权限组' }], validateTrigger: ['blur']}]"
              >
                <a-select-option
                  v-for="userGroup in userGroups"
                  :key="userGroup.name"
                >{{ userGroup.describe }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getUser, activateUser } from '@/api/user'
import { getUserGroups } from '@/api/user'
import moment from 'moment'
import md5 from 'md5'
export default {
  data() {
    return {
      loading: false,
      visible: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      user: {},
      passwordChanged: false,
      userGroups: []
    }
  },

  components: {},

  methods: {
    add(record) {
      getUser(record.id).then(response => {
        this.user = response.data.user[0]
        let user_UserGroups = []
        response.data.user_UserGroups.map(user_UserGroup => {
          user_UserGroups.push(user_UserGroup.user_group.name)
        })
        this.form.setFieldsValue({
          'mdl.language': this.user.language == 1 ? 'chinese' : 'english',
          'mdl.password': 'password',
          'mdl.checkPassword': 'password',
          'mdl.validToDate': moment(this.user.validToDate),
          'mdl.userGroups': user_UserGroups
        })
      })
      getUserGroups().then(res => {
        this.userGroups = res.data.data
      })

      this.visible = true
    },
    close() {
      this.visible = false
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (err) {
          console.log(err)
        }
        if (!err) {
          const activateParams = {}

          if (this.passwordChanged) {
            activateParams.password = md5(values.mdl.password)
          }
          activateParams.language = values.mdl.language
          let now = new Date()
          now.setHours(0)
          now.setMinutes(0)
          now.setSeconds(0)
          now.setMilliseconds(0)
          activateParams.id = this.user.id
          activateParams.validFromDate = now
          activateParams.validToDate = values.mdl.validToDate
            .hour(0)
            .minutes(0)
            .second(0)
            .milliseconds(0)
          activateParams.userGroups = values.mdl.userGroups
          activateParams.status = 1

          activateUser(activateParams).then(response => {
            this.$emit('OK')
            this.close()
          })
        }
      })
    },

    handleCancel() {
      this.close()
    },

    passwordFocus() {
      if (!this.passwordChanged) {
        this.form.setFieldsValue({
          'mdl.password': '',
          'mdl.checkPassword': ''
        })
        this.passwordChanged = true
      }
    },

    checkPasswordFocus() {
      if (!this.passwordChanged) {
        this.form.setFieldsValue({
          'mdl.password': '',
          'mdl.checkPassword': ''
        })
        this.passwordChanged = true
      }
    },

    passwordValidate(rule, value, callback) {
      const password = this.form.getFieldValue('mdl.password')
      if (password != value) {
        callback(new Error('密码不相同'))
      }
      callback()
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
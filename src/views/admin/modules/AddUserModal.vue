<template>
  <a-modal
    title="新建用户账号"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-row>
        <a-col :md="12" :xs="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户账号">
            <a-input
              placeholder="请输入用户账号"
              size="small"
              v-decorator="['mdl.userCode', {rules: [{ required: true, whitespace:true, message: '请输入用户账号' }, {min: 5, message: '账号长度至少为5'}, { validator: userCodeValidate }], validateTrigger: ['change', 'blur']}]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户姓名">
            <a-input
              placeholder="请输入用户姓名"
              size="small"
              v-decorator="['mdl.userName', {rules: [{ required: true, message: '请输入用户姓名' }], validateTrigger: ['change', 'blur']}]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="性别">
            <a-select
              size="small"
              v-decorator="['mdl.sex', {rules: [{ required: true, message: '请选择用户性别' }], validateTrigger: ['blur']}]">
              <a-select-option value="male">男</a-select-option>
              <a-select-option value="female">女</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="所属部门">
            <a-input placeholder="请输入部门名称" 
            v-decorator="['mdl.department', {rules: [{max: 8, message: '长度过长'}], validateTrigger: ['blur']}]" size="small" />
          </a-form-item>
        </a-col>

        <a-col :md="12" :xs="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="入职日期">
            <a-date-picker style="width: 100%"
              v-decorator="['mdl.enploymentDate', {rules: [{required: true, message: '请选择入职日期' }]}]"
              size="small"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="账号有效期">
            <a-range-picker
              :placeholder="['起始日期', '截止日期']"
              v-decorator="['mdl.validDate', {rules: [{required: true, message: '请选择账号有效期' }]}]"
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
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="默认语言">
            <a-select size="small"
            v-decorator="['mdl.language', {initialValue: 'chinese'}]">
              <a-select-option value="chinese">中文</a-select-option>
              <a-select-option value="english">English</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { addUser, getUsers } from '@/api/user'
import moment from 'moment'
import md5 from 'md5'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      expand: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      mdl: {}
    }
  },

  computed: {
    count() {
      return this.expand ? 11 : 7
    }
  },

  components: {},

  methods: {
    add() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if(err) {
          console.log(err)
        }
        if(!err) {
          const userParams = { ...values.mdl }
          userParams.enploymentDate
            .hour(0)
            .minutes(0)
            .second(0)
            .milliseconds(0)
          userParams.validDate[0]
            .hour(0)
            .minutes(0)
            .second(0)
            .milliseconds(0)
          userParams.validDate[1]
            .hour(0)
            .minutes(0)
            .second(0)
            .milliseconds(0)
          userParams.password = md5(userParams.password)
          userParams.checkPassword = md5(userParams.checkPassword)
          addUser(userParams).then(response => {
            console.log(JSON.stringify(response))
            this.$emit('OK')
            this.close()
          })
        
        }
      })
    },

    handleCancel() {
      this.close()
    },

    handleReset() {
      this.form.resetFields()
    },

    userCodeValidate(rule, value, callback) {
      if(!value)
        callback()
      if(!(/[a-zA-Z][a-zA-Z0-9_]/).test(value)) {
        callback(new Error('用户账号必须为英文'))
      }
      let exist = false
      getUsers().then(res => {
        console.log(JSON.stringify(res))
        res.data.data.map(user => {
          if (value == user.userCode) {
            exist = true
          }
        })
        if (exist) {
          callback(new Error('同名账号已存在'))
        }
        callback()
      })
    },

    passwordValidate(rule, value, callback) {
      const password = this.form.getFieldValue('mdl.password')
      if (password != value) {
        callback(new Error('密码不相同'))
      }
      callback()
    }
  }
}
</script>

<style scoped>
</style>
<template>
  <a-modal title="重置密码" :width="900" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <template slot="footer">
      <a-button key="reset" type="primary" @click="handleOk">重置密码</a-button>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
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
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="初始密码">
            <a-input
              type="password"
              placeholder="请输入初始密码"
              size="small"
              v-decorator="['mdl.password', {rules: [{ required: true, message: '请输入密码' }, {min: 6, message: '密码最小长度是6'}, { validator: passwordValidate }], validateTrigger: ['blur', 'change']}]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="确认密码">
            <a-input
              type="password"
              placeholder="请输入确认密码"
              size="small"
              v-decorator="['mdl.checkPassword', {rules: [{ required: true, message: '请输入确认密码' }, {min: 6, message: '密码最小长度是6'}, { validator: checkPasswordValidate }], validateTrigger: ['blur', 'change']}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { getUser, passwordUser } from '@/api/user'
import md5 from 'md5'
export default {
  data() {
    return {
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
      user: {}
    }
  },

  components: {},

  methods: {
    add(record) {
      getUser(record.id).then(response => {
        this.user = response.data.user[0]
        this.form.setFieldsValue({
          'mdl.password': '',
          'mdl.checkPassword': ''
        })
      })

      this.visible = true
    },
    close() {
      this.visible = false
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        this.user.password = md5(values.mdl.password)
        passwordUser(this.user).then(response => {
          console.log(JSON.stringify(response))
          this.close()
          this.$emit('OK')
        })
      })
    },
    handleCancel() {
      this.close()
    },
    passwordValidate(rule, value, callback) {
      const checkPassword = this.form.getFieldValue('mdl.checkPassword')
      if (checkPassword != value) {
        callback(new Error('密码不相同'))
      } else {
        this.form.setFieldsValue({
          'mdl.checkPassword': value
        })
      }
      callback()
    },
    checkPasswordValidate(rule, value, callback) {
      const password = this.form.getFieldValue('mdl.password')
      if (password != value) {
        callback(new Error('密码不相同'))
      } else {
        this.form.setFieldsValue({
          'mdl.password': value
        })
      }
      callback()
    }
  }
}
</script>

<style scoped>
</style>
<template>
  <a-modal title="权限组详情" :width="800" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <a-row :gutter="12" :style="{ marginBottom: '12px' }">
      <a-col
        :span="12"
        v-for="(role, index) in record.permissions"
        :key="index"
        :style="{ marginBottom: '12px' }"
      >
        <a-col :lg="6" :md="24">
          <span>{{ role.permissionName }}：</span>
        </a-col>
        <a-col :lg="18" :md="24" v-if="role.actionEntitySet.length > 0">
          <a-tag
            color="cyan"
            v-for="(action, k) in role.actionEntitySet"
            :key="k"
          >{{ action.describe }}</a-tag>
        </a-col>
        <a-col :lg="18" :md="24" v-else>-</a-col>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { getUserGroupItems } from '@/api/user'
export default {
  data() {
    return {
      visible: false,
      record: {}
    }
  },

  components: {},

  methods: {
    close() {
      this.visible = false
    },
    init(group_id) {
      getUserGroupItems(group_id).then(response => {
        this.record = response.data
      })
      setTimeout(() => {
        this.visible = true
      }, 500)
    },
    handleOk() {
      this.close()
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style scoped>
</style>
<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" style="margin-left: 16px" @click="startTask">启动任务</a-button>
              <a-button style="margin-left: 16px" @click="stopTask">停止任务</a-button>
              <a-button style="margin-left: 16px" @click="getParameters">采集数据</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <div style="margin-left: 10px">
        <div>
          <span style="margin-right: 10px">参数1</span>
          <span>{{ parameters.p1 }}</span>
        </div>
        <div>
          <span style="margin-right: 10px">参数2</span>
          <span>{{ parameters.p2 }}</span>
        </div>
        <div>
          <span style="margin-right: 10px">参数3</span>
          <span>{{ parameters.p3 }}</span>
        </div>
        <div>
          <span style="margin-right: 10px">参数4</span>
          <span>{{ parameters.p4 }}</span>
        </div>
        <div>
          <span style="margin-right: 10px">参数5</span>
          <span>{{ parameters.p5 }}</span>
        </div>
        <div>
          <span style="margin-right: 10px">时间</span>
          <span>{{ parameters.time | fromNow }}</span>
        </div>
        <div style="margin-bottom: 5px">
          <a-input placeholder="参数1" style="width: 200px" v-model="para1In"></a-input>
          <a-button style="margin-left: 16px" @click="setParameter1">设置参数1</a-button>
        </div>
        <div style="margin-bottom: 5px">
          <a-input placeholder="参数2" style="width: 200px" v-model="para2In"></a-input>
          <a-button style="margin-left: 16px" @click="setParameter2">设置参数2</a-button>
        </div>
        <div style="margin-bottom: 5px">
          <a-input placeholder="参数3" style="width: 200px" v-model="para3In"></a-input>
          <a-button style="margin-left: 16px" @click="setParameter3">设置参数3</a-button>
        </div>
        <div style="margin-bottom: 5px">
          <a-input placeholder="参数4" style="width: 200px" v-model="para4In"></a-input>
          <a-button style="margin-left: 16px" @click="setParameter4">设置参数4</a-button>
        </div>
        <div style="margin-bottom: 5px">
          <a-input placeholder="参数5" style="width: 200px" v-model="para5In"></a-input>
          <a-button style="margin-left: 16px" @click="setParameter5">设置参数5</a-button>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { getStartTask, getStopTask, getTaskParameters, updateTaskParameter } from '@/api/task'
import { getDevices } from '@/api/device'
import moment from 'moment'
export default {
  created () {
    getDevices().then(response => {
      console.log(JSON.stringify(response))
      this.device_id = response.data.data[0].id
      this.device_ip_addr = response.data.data[0].ip_addr
      console.log(this.device_id, this.device_ip_addr)
    })
  },
  data () {
    return {
      device_id: '',
      device_ip_addr: '',
      parameters: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, time: 0 },
      intervalId: 0,
      para1In: 0,
      para2In: 0,
      para3In: 0,
      para4In: 0,
      para5In: 0,
    }
  },

  components: {},

  methods: {
    startTask () {
      getStartTask(this.device_id, this.device_ip_addr).then(response => {
        console.log(JSON.stringify(response))
      })

      this.intervalId = setInterval(() => {
        this.getParameters()
      }, 1000)
    },
    stopTask () {
      getStopTask(this.device_id, this.device_ip_addr).then(response => {
        console.log(JSON.stringify(response))
      })

      clearInterval(this.intervalId)
    },
    getParameters () {
      getTaskParameters().then(response => {
        this.parameters.p1 = response.data.status[0][1]
        this.parameters.p2 = response.data.status[1][1]
        this.parameters.p3 = response.data.status[2][1]
        this.parameters.p4 = response.data.status[3][1]
        this.parameters.p5 = response.data.status[4][1]
        this.parameters.time = response.data.status[5][1]
      })
    },
    setParameter1() {
      updateTaskParameter(this.device_ip_addr, 0, this.para1In).then(response => {
        console.log(response)
      })
    },
    setParameter2() {
      updateTaskParameter(this.device_ip_addr, 1, this.para2In).then(response => {
        console.log(response)
      })
    },
    setParameter3() {
      updateTaskParameter(this.device_ip_addr, 2, this.para3In).then(response => {
        console.log(response)
      })
    },
    setParameter4() {
      updateTaskParameter(this.device_ip_addr, 3, this.para4In).then(response => {
        console.log(response)
      })
    },
    setParameter5() {
      updateTaskParameter(this.device_ip_addr, 4, this.para5In).then(response => {
        console.log(response)
      })
    }
  },
  filters: {
    fromNow (date) {
      return moment(Number(date)*1000).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
</style>

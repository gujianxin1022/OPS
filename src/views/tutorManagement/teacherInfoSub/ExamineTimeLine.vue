<template>
  <div class="examine-time-line-wrap">
    <div class="block">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in timeLineData" :key="item.id" :timestamp="DateTimeUtils.dateClockTime(item.createTime)" :color="Filters.timeLineColor(item.type)" placement="top">
          <el-card>
            <h3>{{ Filters.timeLineTitle(item, currentLang) }}</h3>
            <p v-if="Filters.timeLineTitle(item, currentLang) != $t('注册成功')">
              <span class="label">{{$t('Reviewer')}}</span>
              <span class="value">{{ item.createUserName }}</span>
            </p>
            <p v-for="(value, key, index) in JSON.parse(item.info)" :key="index"><span class="label">{{ Filters.timeLineLable(key, item.type, currentLang) }}</span>: <span class="value">{{Filters.timeLineValue( key, value )}}</span></p>
            <p v-if="item.remark !== null"><span class="label">{{$t('student-info-Notes')}}</span>: <span class="value remarkvalue" ref="remarkvalue">{{item.remark}}</span> <span class="read-more" @click="handleReadMore(index)"> <i v-if="item.remark.length>=27" class="color-blue el-icon-arrow-down" ref="upDown"></i></span></p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script>
import { Container } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      timeLineData: []
    }
  },
  computed: {
    tutorId() {
      return this.$route.query.id
    },
    ...mapGetters(['currentLang'])
  },
  created() {
    if (this.tutorId) {
      this.$Api.tutorManagement.getTeacherTimeLineLog(this.tutorId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.timeLineData = data.data
          }
        })
    }
  },
  methods: {
    handleReadMore(index) {
      try {
        let classList = [...this.$refs.remarkvalue[index].classList]
        if (classList.indexOf('remarkvalue') != -1) {
          this.$refs.remarkvalue[index].className = 'value'
          this.$refs.upDown[index].className = 'color-blue el-icon-arrow-up'
        } else {
          this.$refs.remarkvalue[index].className = 'value remarkvalue'
          this.$refs.upDown[index].className = 'color-blue el-icon-arrow-down'
        }
      } catch (error) {

      }

    }
  }
}

</script>
<style lang="scss" scoped>
.examine-time-line-wrap {
  padding-top: 10px;
  width: 100%;
  height: 100%;

  .block {
    width: 100%;
    height: 100%;
    overflow: auto;

    .label {
      display: inline-block;
      width: 70px;
      text-align: justify;
      text-align-last: justify;
      color: #666;
    }

    .value {
      margin-left: 10px;
    }

    .remarkvalue {
      display: inline-block;
      width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .read-more {
      cursor: pointer;
    }

    .color-blue {
      color: #0088ce;
      font-weight: 900;
    }
  }
}

</style>

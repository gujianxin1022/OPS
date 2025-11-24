<template>
  <div class="customer-detail">
    <el-drawer
      title="我是标题"
      :with-header="false"
      :visible.sync="showCustomerDetail"
      :direction="direction"
      :before-close="closeCustomerDetailDialog"
      :size="currentLang == 'en' ? '50%' : '30%'"
    >
      <div class="customer-detail-content-wrap">
        <div class="title">
          <span>{{ parentInfo.parentUserId }}</span>
          <i
            class="icon el-icon-arrow-left"
            @click="pre"
          ></i>
          <i
            class="icon el-icon-arrow-right"
            @click="next"
          ></i>
          <span
            @click="closeCustomerDetailDialog"
            class="close"
          >+</span>
        </div>
        <div
          class="go-detail"
          @click="goDetail"
        ><span>{{$t('View details')}}</span></div>
        <div
          class="customer-detail-info-content"
          :style="customerStyle"
          v-loading="loading"
        >
          <div class="base-info-wrap">
            <div class="base-info-wrap-header">
              <div class="base-info-wrap-header-color-div"></div>
              <div class="base-info-wrap-header-text-div">
                {{$t('parent Profile')}}</div>
            </div>
            <div class="base-info-wrap-content">
              <ul>
                <li><span
                    class="label">{{$t('my-home-1-Country of Residence')}}</span>
                  <span class="value">{{ parentInfo.area }}</span></li>
                <li><span class="label">{{$t('my-home-Sources')}}</span> <span
                    class="value"
                  >{{ Filters.userSource(parentInfo.source, currentLang) }}</span>
                </li>
                <li><span class="label">{{$t('future 1 on 1')}}</span> <span
                    class="value"
                  >{{ parentInfo.waitFor1v1CLass }}</span></li>
              </ul>
              <ul style="position:relative;left: -27px">
                <li><span class="label">{{$t('渠道')}}</span> <span
                    class="value"
                    style="font-size: 12px"
                  >{{ parentInfo.channel }}</span></li>
                <li><span class="label">{{$t('课时余额')}}</span> <span
                    class="value"
                  >{{ parentInfo.parentTotalBalance }}</span></li>
                <li><span class="label">{{$t('future Small Class')}}</span>
                  <span class="value">{{ parentInfo.waitForSmallClass }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="student-info-wrap">
            <div class="base-info-wrap-header">
              <div class="base-info-wrap-header-color-div"></div>
              <div
                class="base-info-wrap-header-text-div"
                style="border:none"
              >{{$t('student Profile')}}</div>
            </div>
            <div
              v-for="(item, index) in parentInfo.userStudentInfoList"
              :key="index"
              class="student-info-wrap-content"
            >
              <div>
                <ul>
                  <li>
                    <span
                      class="label">{{$t('学生名字')}}</span>
                    <el-button
                      @click="goStudentDetail(item.studentUserId,item.realName)"
                      class="value"
                      type="text"
                    >{{ item.realName }}</el-button>
                  <li><span class="label">{{$t('Student Stage')}}</span> <span
                      class="value"
                    >{{ Filters.studentCurrentStage(item.currentStage, currentLang) }}</span>
                  </li>
                  <li><span class="label">{{$t('future 1 on 1')}}</span> <span
                      class="value"
                    >{{ item.waitFor1v1CLass }}</span></li>
                  <li><span class="label">{{$t('future Small Class')}}</span>
                    <span class="value">{{ item.waitForSmallClass }}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    showCustomerDetail: {
      type: Boolean,
      default: false
    },
    customerInfo: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      title: '',
      direction: 'rtl',
      customerStyle: {
        height: `${window.innerHeight - 110 || 220}px`,
      },
      parentInfo: {},
      loading: false
    }
  },
  computed: {
    ...mapGetters(['currentLang']),
    changeId () {
      return this.parentInfo.parentUserId
    }
  },
  watch: {
    showCustomerDetail (newData) {
      if (newData) {
        this.getUserInfo()
      }
    },
    changeId (newData) {
      if (newData) {
        this.getUserInfo()
      }
    }
  },
  methods: {
    closeCustomerDetailDialog () {
      this.$emit('closeCustomerDetailDialog')
    },
    goDetail () {
      this.$emit('closeCustomerDetailDialog')
      this.$router.push(`/studentManagement/parentInfo?parentUserId=${this.parentInfo.parentUserId}`)
    },
    pre () {
      new Promise((reslove, reject) => {
        let flag = this.$emit('preUser')
        if (flag) {
          reslove('')
        } else {
          reject('')
        }
      })
        .then(res => {
          this.getUserInfo()
        })
        .catch(err => {
          this.$notify({
            message: this.$t('Already the first customer on this page'),
            type: 'warning'
          })
        })
    },
    next () {
      new Promise((reslove, reject) => {
        this.$emit('nextUser')
        reslove('')
      })
        .then(res => {
          this.getUserInfo()
        })
        .catch(err => {
          this.$notify({
            message: this.$t('Already the last customer on this page'),
            type: 'warning'
          })
        })
      // this.$emit('nextUser')
      // this.getUserInfo()
    },
    goStudentDetail (studentId, studentName) {
      this.$emit('closeCustomerDetailDialog')
      this.$router.push(`/studentManagement/studentInfo?studentId=${studentId}&studentName=${studentName}`)
    },
    getUserInfo () {
      // this.loading = true
      let { parentUserId } = this.customerInfo
      this.$Api.workBench.getMyCustomerDetailInfo(parentUserId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.parentInfo = data.data
          }
          this.loading = false
        })
      this.title = `${this.$t('my-home-Parent')} ${this.customerInfo.parentUserName}`
    }
  }
}
</script>
<style lang="scss" scoped>
.customer-detail {
  outline: none !important;
}
.icon {
  color: #666666;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 2px;
}
.customer-detail-content-wrap {
  width: 100%;
  height: 100%;
  background-color: #41464f;
  padding: 30px 10px 0 10px;
  .title {
    width: 100%;
    position: relative;
    bottom: -14px;
    span {
      color: #c4c4c5;
      font-weight: 600;
    }
    .close {
      display: flex;
      width: 20px;
      height: 20px;
      position: absolute;
      right: 0;
      top: -30px;
      border-radius: 50%;
      transform: rotate(45deg);
      font-size: 22px;
      cursor: pointer;
    }
  }
  .go-detail {
    width: 100%;
    position: relative;
    margin: 10px 0;
    span {
      position: absolute;
      right: 0;
      color: #c4c4c5;
      font-size: 14px;
      top: -10px;
      cursor: pointer;
    }
    span:hover {
      color: #fff;
    }
  }
  .customer-detail-info-content {
    width: 100%;
    height: 300px;
    overflow: auto;
    background-color: #fff;
    margin-top: 40px;
    border-radius: 6px;
    padding: 20px 0;
    .base-info-wrap {
      width: 100%;
      .base-info-wrap-content {
        display: flex;
      }
    }
  }
}
.base-info-wrap-header {
  width: 100%;
  display: flex;
  .base-info-wrap-header-color-div {
    width: 10px;
    height: 30px;
    background-color: #f90;
  }
  .base-info-wrap-header-text-div {
    width: 90%;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    margin-left: 10px;
    font-size: 14px;
    color: #000;
  }
}
ul {
  flex: 1;
  list-style-type: none;
  align-items: center;
  padding-left: 21px !important;
}
li {
  display: flex;
  margin-bottom: 15px;
}
.student-info-wrap-content {
  > div {
    width: 90% !important;
    border-top: 1px solid #eee;
    margin-left: 20px;
    padding-top: 20px;
    ul {
      width: 50%;
      margin-top: 0;
      padding-left: 0 !important;
    }
  }
}
.label {
  font-size: 12px;
  width: 70px;
  display: inline-block;
  color: #8f8f8f;
  flex: 1;
  white-space: nowrap;
}
.value {
  font-size: 12px;
  width: 50px;
  display: inline-block;
  flex: 1;
  white-space: nowrap;
  padding: 0;
  text-align: left;
}
</style>

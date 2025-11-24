<template>
  <div class="homepage-container">
    <p>
      <img src="@/assets/homepage/bg_text.png" width="741">
    </p>
    <!-- <span><img src="@/assets/homepage/emoji.png" width="229" height="256"></span> -->
    <!-- <span><img src="@/assets/homepage/emoji.png" width="229" height="256"></span> -->
    <!-- 合同模版即将过期提醒弹窗 -->
    <el-dialog :visible.sync="contractTemplateDialog" :title="$t('合同模版即将过期提醒')" width="500px" append-to-body="true">
      <span style="display: inline-block;line-height: 24px;">{{ $t('存在员工合同模版即将失效，为了避免影响教师签约，请及时完成合同模版更新！') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="goContractTemplate">
            {{ $t('立即前往') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'homepage',
  data() {
    return {
      dialogVisible: false,
      contractTemplateDialog: false,
      contractTemplateId: '',
      chatBotArr: [],
      userInfo: JSON.parse(window.localStorage.getItem("userInfo")),
    }
  },

  methods: {
    back() {
      this.$router.go(-1)
    },
    goContractTemplate() {
      this.$router.push({
        path: '/tutorManagement/teacherContractTemplate'
      })
    },
    // 跳转合同模版
    goContractTemplate() {
      this.contractTemplateDialog = false;
      this.$router.push("/tutorManagement/teacherContractTemplate");
      // 已读
      this.$Api.base.fixParentRemark(this.userInfo.id, this.contractTemplateId)
        .then(({ data }) => { });
    },
    // 获取合同模版即将过期提醒
    async getContractTemplateRemind() {
      try {
        const response = await this.$Api.base.getMessageListByType({
          userId: this.userInfo.id,
          role: 5,
          category: 3,
          businessType: 1,
          pageNum: 1,
          pageSize: 30,
        });
        // 获取isRead=1未读数据里的detail 
        const isReadList = response.list.filter((item) => item.isRead === 1);
        const detailList = isReadList.map((item) => {
          return {
            originalData: item,
            parsedDetail: JSON.parse(item.detail)
          }
        })
        for (let item of detailList) {
          if (item.parsedDetail.popup) {
            this.contractTemplateDialog = true;
            this.contractTemplateId = item.originalData.id;
            break;
          }
        }
      } catch (error) { }
    },
  },
  created() {
    this.getContractTemplateRemind();
  },
  
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .homepage-container {
    width: 100%;
    margin: 0 auto;
    padding: 20px 20px;
    position: relative;
    .ai-img {
    transform: scale(0.5); 
    position: absolute;
    right: 20px;
    bottom: 200px;
    width: 100px;
    height: 100px;
    z-index: 1000;
    cursor: pointer;
  }
    p {
        text-align: center;
    }
    span {
        display: block;
        position: absolute;
        right: 20px;
        bottom: -3px;
        
    }
  }
</style>






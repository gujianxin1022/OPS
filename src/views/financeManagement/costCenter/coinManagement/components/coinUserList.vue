<template>
  <div class="handle-by-human-wrap">
    <div class="search-wrap">
      <screen-wrapper @search="search" screenTitle="">
        <screen-item :label="$t('日期')" :part="2" label-width="120">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="applyDate"
            style="width: 192px"
            type="daterange"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            size="small"
            @change="timeChange"
          />
        </screen-item>
        <screen-item :label="$t('家长ID')" label-width="120" :part="4">
          <el-input
            v-model.trim="screenData.parentUserId"
            :placeholder="$t('请输入家长ID')"
            @keyup.enter.native="search"
          />
        </screen-item>
        <screen-item :label="$t('发起申请人员')" label-width="120" :part="4">
          <el-select
            clearable
            filterable
            v-model="screenData.createUserId"
            :placeholder="$t('请选择发起申请人员')"
          >
            <el-option
              v-for="(item, index) in xgAndGwListSet"
              :key="index"
              :label="
                item.nameEn +
                `${item.nameEn && item.nameZh ? '-' : ''}` +
                item.nameZh
              "
              :value="item.id"
            />
          </el-select>
        </screen-item>
        <screen-item :label="$t('成本部门')" label-width="120" :part="4">
          <el-select
            clearable
            v-model="screenData.postId"
            :placeholder="$t('请选择成本部门')"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="currentLang === 'zh' ? item.nameZh : item.nameEn"
              :value="item.id"
            ></el-option>
          </el-select>
        </screen-item>
        <screen-item :label="$t('操作类型')" label-width="120" :part="4">
          <el-select
            clearable
            v-model="screenData.type"
            :placeholder="$t('请选择操作类型')"
          >
            <el-option
              v-for="item in costTypeList"
              :key="item.id"
              :label="currentLang === 'zh' ? item.typeNameZh : item.typeNameEn"
              :value="item.id"
            ></el-option>
          </el-select>
        </screen-item>
        <screen-item :label="$t('原因')" label-width="120" :part="4">
          <el-select
            clearable
            v-model="screenData.reference"
            :placeholder="$t('请选择原因')"
          >
            <el-option
              v-for="item in reasonList"
              :key="item.id"
              :label="currentLang === 'zh' ? item.describeZh : item.describeEn"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </screen-item>
      </screen-wrapper>
    </div>
    <div class="center-wrap">
      <div class="event-btns-wrap">
        <el-button @click="showAddMoreHours">{{
          $t("批量添加积分")
        }}</el-button>
        <el-button @click="showAddHours">{{ $t("添加积分") }}</el-button>
        <el-button
          @click="deductionPointsVisible = true"
          v-if="
            Per.handleButtonPer(
              'financeMT.costCenter.coinManagement.deductionPoints'
            )
          "
          >{{ $t("扣减积分") }}</el-button
        >
      </div>
    </div>
    <div class="table-wrap">
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        v-show="type == 1"
      >
        <el-table-column align="center" :label="$t('序号')" :width="50">
          <template slot-scope="scope">{{
            (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('发起申请时间')">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('家长ID')"
          prop="parentUserName"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: `/studentManagement/parentInfo`,
                query: { parentUserId: scope.row.parentUserId },
              }"
            >
              <el-button type="text">{{ scope.row.parentUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('操作类型')"
          :prop="currentLang === 'zh' ? 'typeZh' : 'typeEh'"
          width="120"
        />
        <el-table-column
          align="center"
          :label="$t('申请积分')"
          prop="coin"
          width="120"
        />
        <el-table-column
          align="center"
          :label="$t('成本部门')"
          :prop="currentLang === 'zh' ? 'postNameZh' : 'postNameEn'"
          width="120"
        />
        <el-table-column align="center" :label="$t('原因')" prop="describes">
          <template slot-scope="scope">
            <span>{{ scope.row.describes }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('发起申请人员')"
          prop="createUserName"
          width="120"
        />
        <el-table-column
          align="center"
          :label="$t('详细原因')"
          prop="remark"
          width="120"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="scope.row.remark"
              :content="scope.row.remark"
            >
              <el-button slot="reference" type="text"
                >{{ scope.row.remark ? scope.row.remark.substr(0, 4) : "" }}...
              </el-button>
            </el-popover>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <div class="dialog-wrap">
      <!-- 批量添加课时 start-->
      <el-dialog
        :before-close="closeAddMoreHours"
        :close-on-click-modal="false"
        :title="
          $t(
            '批量赠送积分（批量操作涉及数据量较大，请谨慎操作，单次最多支持1000条数据）'
          )
        "
        center
        :visible.sync="addMoreHoursDialogFlag"
        v-if="addMoreHoursDialogFlag"
      >
        <div class="more-select">
          <el-form
            :inline="true"
            ref="addMoreHoursForm"
            :rules="ruleMore"
            :model="addMoreHoursForm"
            label-width="116px"
          >
            <el-form-item :label="$t('原因')" prop="reference">
              <el-select
                v-model="addMoreHoursForm.reference"
                :placeholder="$t('请选择')"
              >
                <el-option
                  v-for="item in addReasonList"
                  :key="item.id"
                  :label="
                    currentLang === 'zh' ? item.describeZh : item.describeEn
                  "
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <br />
            <el-form-item :label="$t('区分大小写')" prop="coin">
              <el-checkbox v-model="distinguishCase"></el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('赠送积分')" prop="data">
              <el-input
                style="width: 520px"
                type="textarea"
                :rows="16"
                :placeholder="addMoreHoursFormPlaceholder"
                v-model="addMoreHoursForm.data"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <div class="error-message" v-if="errorNum !== 0">
            共有<span class="error-message-color">{{ errorNum }}</span
            >条数据有问题，请修正后点击确定添加
          </div>
        </div>
        <!-- <div style="border: 1px solid #CBCBCB;height: 200px;width: 100%" contenteditable="true">
        <span contenteditable="true" v-html="addMoreHoursValue">1111</span>
      </div> -->
        <!-- <div class="warning-text">批量操作涉及数据量较大，请谨慎操作</div> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="addMoreHoursDialogFlag = false">
            &nbsp;&nbsp;{{ $t("取消") }}&nbsp;&nbsp;</el-button
          >
          <el-button
            type="primary"
            @click="sureAddMoreHours"
            :loading="addMoreCoinsLoading"
            >{{ $t("确定添加") }}</el-button
          >
        </div>
      </el-dialog>
      <!-- 批量添加课时 end-->
      <!-- 添加课时 start-->
      <el-dialog
        :before-close="closeAddHours"
        :close-on-click-modal="false"
        :title="$t('添加积分')"
        center
        :visible.sync="addHoursDialogFlag"
        v-if="addHoursDialogFlag"
      >
        <el-form
          ref="addHoursForm"
          :rules="rule"
          :model="addHoursForm"
          label-width="152px"
        >
          <el-form-item :label="$t('家长ID')" prop="parentUserId">
            <el-input
              v-model="addHoursForm.parentUserId"
              :placeholder="$t('请输入家长ID')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('积分数量')" prop="coin">
            <el-input-number
              v-model="addHoursForm.coin"
              @change="toInteger"
              :min="0"
              :label="$t('添加积分数')"
            ></el-input-number>
          </el-form-item>
          <el-form-item :label="$t('原因')" prop="reference">
            <el-select
              v-model="addHoursForm.reference"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in addReasonList"
                :key="item.id"
                :label="
                  currentLang === 'zh' ? item.describeZh : item.describeEn
                "
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('区分用户大小写')" prop="coin">
            <el-checkbox v-model="distinguishCase"></el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('详细理由')" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              maxlength="499"
              :placeholder="$t('请输入详细理由')"
              v-model="addHoursForm.remark"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addHoursDialogFlag = false"
            >{{ $t("取消") }}
          </el-button>
          <el-button
            type="primary"
            @click="sureAddHours"
            :loading="addCoinsLoading"
            >{{ $t("确定添加") }}</el-button
          >
        </div>
      </el-dialog>
      <!-- 添加课时 end-->
    </div>
    <DeductionPoints
      :visible.sync="deductionPointsVisible"
      @ok="search"
      v-if="deductionPointsVisible"
    />
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import DeductionPoints from "./DeductionPoints.vue";
import { parentIdValidate } from "@/utils/reg.js";
export default {
  data() {
    var detailLength = (rule, value, callback) => {
      if (value == null || value.length <= 0) {
        return callback(new Error(this.$t("请输入详细原因")));
      } else if (value.length < 9) {
        return callback(new Error(this.$t("最少9个字")));
      } else if (value.length > 499) {
        return callback(new Error(this.$t("最多499字")));
      } else {
        callback();
      }
    };
    let coin = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请输入添加积分数量")));
      } else {
        return callback();
      }
    };
    let parentUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请输入家长用户名")));
      } else {
        return callback();
      }
    };
    let reference = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请选择添加积分原因")));
      } else {
        return callback();
      }
    };
    let references = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请选择添加积分原因")));
      } else {
        return callback();
      }
    };
    let batchData = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("请输入批量数据")));
      } else {
        return callback();
      }
    };
    return {
      deductionPointsVisible: false,
      distinguishCase: true,
      addMoreHoursFormPlaceholder:
        "用户ID,添加积分 \n用户ID,添加积分 \n用户ID,添加积分 \n用户ID,添加积分",
      addCoinsLoading: false,
      addMoreCoinsLoading: false,
      rule: {
        coin: [{ validator: coin, trigger: "blur" }],
        parentUserName: [{ validator: parentUserName, trigger: "blur" }],
        reference: [{ validator: reference, trigger: "blur" }],
        remark: [{ required: true, validator: detailLength, trigger: "blur" }],
      },
      ruleMore: {
        reference: [{ validator: references, trigger: "blur" }],
        data: [{ validator: batchData, trigger: "blur" }],
      },
      total: 0,
      applyDate: "",
      screenData: {
        createUserId: "",
        pageNum: 1,
        pageSize: 50,
        dateType: "",
        startTime: "",
        endTime: "",
        parentUserName: "",
        reference: "",
        postId: "",
        type: "",
      },
      type: 1,
      tableData: [],
      errorNum: 0,
      loading: false,
      addHoursDialogFlag: false,
      addMoreHoursDialogFlag: false,
      showDetail: false,
      addHoursForm: {
        reference: null,
        remark: null,
        coin: null,
        parentUserName: null,
      },
      addMoreHoursForm: {
        reference: "",
        data: "",
      },
      reasonList: [],
      departmentList: [],
      costTypeList: [],
    };
  },
  computed: {
    ...mapState({
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
    }),
    ...mapGetters(["currentLang"]),
    nowUserInfo() {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
    addReasonList() {
      return this.reasonList.filter(
        (v) =>
          v.type === 1 /* 原因类型: 添加 */ &&
          (v.classify === 1 /* 手动 */ || v.classify === 2) /* 手动&自动 */
      );
    },
  },
  watch: {
    addMoreHoursDialogFlag(newData) {
      if (!newData) {
        this.addMoreHoursForm = this.$options.data().addMoreHoursForm;
        this.errorNum = 0;
      }
    },
    addHoursDialogFlag(newData) {
      if (!newData) {
        this.addHoursForm = this.$options.data().addHoursForm;
      }
    },
    currentLang() {
      this.initData();
    },
  },
  components: {
    DeductionPoints,
  },
  methods: {
    initData() {
      this.addMoreHoursFormPlaceholder = this.$t(
        "用户ID,添加积分 \n用户ID,添加积分 \n用户ID,添加积分 \n用户ID,添加积分"
      );
    },
    // 原因
    // findReason(reasonId) {
    //   let result = this.reasonList.find(item => item.id == reasonId)
    //   if (result != undefined) {
    //     return result.describes
    //   } else {
    //     return ''
    //   }
    // },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    closeDetail() {
      this.showDetail = false;
    },
    timeChange() {
      this.screenData.dateType = "";
    },
    changeType(value) {
      this.type = value;
    },
    openDetails(scopeRow) {
      this.showDetail = true;
    },
    search() {
      this.screenData.pageNum = 1;
      this.screenData.pageSize = 50;
      this.getTableData();
    },
    getTableData() {
      if (
        this.screenData &&
        this.screenData.parentUserId &&
        !parentIdValidate(this, this.screenData.parentUserId)
      ) {
        return;
      }
      this.loading = true;
      let {
        pageNum,
        pageSize,
        createUserId,
        dateType,
        startTime,
        endTime,
        parentUserId,
        reference,
        postId,
        type,
      } = this.screenData;
      let params = {
        pageNum,
        pageSize,
        dateType,
        startTime,
        endTime,
        parentUserId,
        createUserId,
        reference,
        postId,
        type,
      };
      if (this.applyDate !== null && this.applyDate.length != 0) {
        params.startTime = moment(
          `${this.applyDate[0]} 00:00:00`
        ).toISOString();
        params.endTime = moment(`${this.applyDate[1]} 23:59:59`).toISOString();
      } else {
        params.startTime = "";
        params.endTime = "";
      }
      this.$Api.financeManagement
        .getCoinUser(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
    showAddMoreHours() {
      this.distinguishCase = true;
      this.addMoreHoursDialogFlag = true;
    },
    showAddHours() {
      this.distinguishCase = true;
      this.addHoursDialogFlag = true;
    },
    closeAddMoreHours() {
      this.addMoreHoursDialogFlag = false;
    },
    closeAddHours() {
      this.addHoursDialogFlag = false;
    },
    sureAddMoreHours() {
      this.$refs["addMoreHoursForm"].validate((valid) => {
        if (valid) {
          let str = this.addMoreHoursForm.data.replace(/，/gi, ",");
          let importData = str.split("\n");
          if (importData.length > 1000) {
            this.$notify({
              message: "单次导入数据最多支持1000条，请重新导入",
              type: "error",
            });
            return;
          }
          let params = [];
          let isSize = this.distinguishCase ? 1 : 0;
          let numValidArray = [];
          let numValid = true;
          let parentUserIdValid = true;
          importData.map((i) => {
            let temp = i.split(",");
            let obj = {
              parentUserId: temp[0],
              coin: parseInt(temp[1]),
              reference: this.addMoreHoursForm.reference,
            };
            numValidArray.push(temp[1]);
            params.push(obj);
          });
          numValidArray.forEach((i) => {
            if (i % 1 !== 0 || i < 1) {
              numValid = false;
            }
          });
          params.forEach((obj) => {
            if (!/^[0-9]*$/.test(obj.parentUserId)) {
              parentUserIdValid = false;
            }
          });
          if (!numValid) {
            this.$notify({
              message: "赠送的积分应为正整数",
              type: "error",
            });
            return;
          }
          if (!parentUserIdValid) {
            this.$notify({
              message: "请输入正确的家长ID格式",
              type: "error",
            });
            return;
          }
          this.addMoreCoinsLoading = true;
          this.$Api.coinManagement
            .postCoinUserBatchRewardCoin(isSize, params)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200 && data.data == null) {
                this.addMoreHoursDialogFlag = false;
                this.$notify({
                  message: "批量添加成功",
                  type: "success",
                });
                this.errorNum = 0;
                this.addMoreHoursForm = this.$options.data().addMoreHoursForm;
                this.getTableData();
              } else {
                this.addMoreCoinsLoading = false;
                if (data.data.length !== 0) {
                  this.$notify({
                    message: "批量添加失败",
                    type: "error",
                  });
                } else {
                  this.$notify({
                    message: data.message,
                    type: "error",
                  });
                }
                this.errorNum = data.data.length;
                data.data.forEach((item) => {
                  importData[item.index] = `${importData[item.index]} (${
                    item.message
                  })`;
                });
                this.addMoreHoursForm.data = importData
                  .join(";")
                  .replace(/\;/g, "\n");
              }
              this.addMoreCoinsLoading = false;
            });
        }
      });
    },
    toInteger() {
      let reg = /^[0-9]+$/;
      if (!reg.test(this.addHoursForm.coin)) {
        this.$notify({
          message: "请输入1-99999的整数",
          type: "warning",
        });
        // 用以在dom渲染挂载后重新触发dom渲染挂载
        this.$nextTick(() => {
          this.addHoursForm.coin = parseInt(this.addHoursForm.coin);
        });
      }
    },
    sureAddHours() {
      this.$refs["addHoursForm"].validate((valid) => {
        if (valid) {
          if (!parentIdValidate(this, this.addHoursForm.parentUserId)) {
            return;
          }
          let isSize = this.distinguishCase ? 1 : 0;
          this.addCoinsLoading = true;
          this.$Api.coinManagement
            .postCoinUserRewardCoin(isSize, this.addHoursForm)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200 && data.data == null) {
                this.$notify({
                  message: "添加积分成功",
                  type: "success",
                });
                this.addHoursDialogFlag = false;
                this.addHoursForm = this.$options.data().addHoursForm;
                this.getTableData();
              } else {
                this.$notify({
                  message: "添加失败，账户不存在",
                  type: "error",
                });
              }
              this.addCoinsLoading = false;
            });
        }
      });
    },
    async getDepartmentList() /* 成本部门 */ {
      const {
        status,
        data: { code, data },
      } = await this.$Api.systemManagement.getJobPositionList();
      if (status !== 200 || code !== 200) return Promise.reject();
      this.departmentList = Object.freeze(
        data.filter((v) => v.pid === 0 /* LINGGO_ACE_ID */)
      );
    },
    async getCostTypeList() /* 操作类型 */ {
      const {
        status,
        data: { code, data },
      } = await this.$Api.financeManagement.getCostTypeList();
      if (status !== 200 || code !== 200) return Promise.reject();
      this.costTypeList = Object.freeze(data);
    },
  },
  created() {
    this.getDepartmentList();
    this.getCostTypeList();

    this.$Api.financeManagement
      .searchReasonList(this.nowUserInfo.id, { coinMark: 1 })
      .then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.reasonList = data.data;
        }
      });
    this.getTableData();
  },
};
</script>
<style lang="scss">
.handle-by-human-wrap {
  .el-dialog__title {
    font-size: 16px !important;
  }
}
</style>
<style lang="scss" scoped>
.handle-by-human-wrap {
  padding: 20px 0 20px 0;

  .detail-wrap {
    width: 100%;
  }

  .detail-reason {
    background-color: #fcc;
    width: 70%;
    margin-left: 40px;
  }

  .detail-top-info {
    width: 100%;
    display: flex;

    ul {
      list-style: none;
      margin-right: 30px;

      li {
        margin: 20px 0;
      }
    }
  }

  .center-wrap {
    margin: 10px 0;
    position: relative;
    width: 100%;
    height: 30px;

    .button-tabs-wrap {
      position: absolute;
      left: 30px;
    }

    .event-btns-wrap {
      position: absolute;
      display: flex;
      right: 30px;
    }
  }

  .table-wrap {
    /*padding: 0 30px;*/
  }

  .more-select {
    margin-bottom: 10px;
  }

  .error-message {
    width: 100%;
    text-align: center;

    .error-message-color {
      color: red;
      font-weight: bold;
      margin: 0 4px;
    }
  }
}
</style>

<template>
  <!-- 根据目标用户属性范围选择 -->
  <div class="add-sale-rule-warp">
    <span class="tips">{{
      $t(
        "代下单同时校验OPS用户条件+C端用户条件;每个条件内部之间为“或”的关系,不同条件之间为“且”的关系。"
      )
    }}</span>
    <br />
    <div class="c-user">
      <span class="mr10 title">{{ $t("C端用户") }}:</span>
      <el-radio-group v-model="formStateOfCUser.ruleType">
        <el-radio :label="0">{{ $t("全部用户") }}</el-radio>
        <el-radio :label="1">{{ $t("按条件筛选") }}</el-radio>
        <el-radio :label="2">{{ $t("自定义上传") }}</el-radio>
      </el-radio-group>
      <div v-show="formStateOfCUser.ruleType === 1">
        <div v-for="(t, index) in cUserConditionList" :key="index">
          <div class="condition-item">
            <el-select
              :style="{ width: isEn ? '180px' : '150px' }"
              v-model="t.conditionCode"
              clearable
              :placeholder="$t('请选择')"
              @change="changeCUserConditionCode(t)"
            >
              <el-option
                v-for="item in getCUserConditionList(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              :style="isEn ? 'width: 130px' : 'width: 100px'"
              v-model="t.conditionOperator"
              clearable
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in getConditionStatus(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- 属性值 -->
            <template>
              <el-select
                v-show="
                  t.conditionCode === C_CONDITION_TYPE.NEW_SIGNING_OR_RENEWAL
                "
                v-model="t.conditionValue"
                clearable
                multiple
                :placeholder="$t('请选择')"
              >
                <el-option
                  v-for="item in getNewSigningOrRenewalList(isEn)"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
            <i @click="addCOption(index)" class="el-icon-plus"></i>
            <i
              @click.prevent="deleteCOption(index)"
              v-if="cUserConditionList.length > 1"
              class="el-icon-minus"
            ></i>
            <template>
              <ChannelCode
                v-if="t.conditionCode === C_CONDITION_TYPE.CHANNEL_CODE"
                :ref="`channelCode${index}`"
                @changeCode="
                  (val) => {
                    t.conditionValue = val;
                  }
                "
              />
            </template>
          </div>
        </div>
      </div>
      <div class="mt10" v-if="formStateOfCUser.ruleType === 2">
        <CustomUpload
          ref="CustomUpload"
          :config="{
            url: '/opsapi/trading/center/sale/rule/upload',
          }"
          @ok="
            (val) => {
              formStateOfCUser.markId = val;
            }
          "
        />
        <span>{{ $t("仅支持xls、xlsx格式,最多1万条") }}</span>
        <el-button type="text">
          <a
            href="https://priv.cdn.lingoace.com/OPS/用户上传模板-Upload template.xlsx"
            >{{ $t("下载模板") }}</a
          >
        </el-button>
        <div
          class="mt10"
          v-show="
            handleType === 'edit' &&
            formStateOfCUser.ruleType === 2 &&
            formStateOfCUser.markId.length
          "
        >
          <span style="color: #969696">file.xlsx</span>
          <el-button type="text" @click="getFile">{{
            $t("下载文件")
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="ops-user">
      <span class="mr10 title">{{ $t("OPS用户") }}:</span>
      <el-radio-group v-model="formStateOPS.ruleType">
        <el-radio :label="0">{{ $t("全部用户") }}</el-radio>
        <el-radio :label="1">{{ $t("按条件筛选") }}</el-radio>
      </el-radio-group>
      <div v-show="formStateOPS.ruleType === 1">
        <div v-for="(t, index) in opsUserConditionList" :key="index">
          <div class="condition-item">
            <el-select
              :style="{ width: isEn ? '180px' : '150px' }"
              v-model="t.conditionCode"
              clearable
              @change="changeConditionCode(t)"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in getOPSConditionList(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              style="width: 100px"
              v-model="t.conditionOperator"
              clearable
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in getConditionStatus(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- 属性值 -->
            <i @click="addOption(index)" class="el-icon-plus"></i>
            <i
              @click.prevent="deleteOption(index)"
              v-if="opsUserConditionList.length > 1"
              class="el-icon-minus"
            ></i>
            <template>
              <SelectDepartment
                v-show="t.conditionCode === OPS_CONDITION_TYPE.JOB_TREE"
                :ref="`department${index}`"
                @changeSelect="
                  (val) => {
                    t.conditionValue = val;
                  }
                "
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  onMounted,
  watch,
  ref,
  reactive,
  computed,
} from "@vue/composition-api";
import {
  getOPSConditionList,
  getConditionStatus,
  getCUserConditionList,
  getNewSigningOrRenewalList,
} from "../dataConfig/constant";
import { OPS_CONDITION_TYPE, C_CONDITION_TYPE } from "../dataConfig/enum";
import FilterBySubject from "@/components/FilterItem/CommodityFilter/FilterBySubject";
import FilterByPayType from "@/components/FilterItem/CommodityFilter/FilterByPayType";
import FilterByUserSourceType from "@/components/FilterItem/UserDimensionFilter/FilterByUserSourceType";
import FilterByAllCourseTree from "@/components/FilterItem/CoursePackageTreeFilter/FilterByAllCourseTree";
import FilterByRegion from "@/components/FilterItem/CommodityFilter/FilterByRegion";
import SelectDepartment from "@/components/SelectDepartment.vue";
import ChannelCode from "./ChannelCode.vue";
import CustomUpload from "@/components/Upload/CustomUpload";
import axios from "axios";

export default {
  components: {
    FilterBySubject,
    FilterByPayType,
    FilterByUserSourceType,
    FilterByAllCourseTree,
    FilterByRegion,
    SelectDepartment,
    ChannelCode,
    CustomUpload,
  },
  props: {},
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    /* ops用户条件 */
    const opsUserConditionList = ref([
      {
        conditionCode: "",
        conditionOperator: "",
        conditionValue: [],
      },
    ]);
    const addOption = (index) => {
      if (opsUserConditionList.value.length >= 30) {
        return root.$message.warning(root.$t("选项最多$个").replace("$", "30"));
      }
      opsUserConditionList.value.splice(index + 1, 0, {
        conditionCode: "",
        conditionOperator: "",
        conditionValue: [],
      });
    };
    const deleteOption = (index) => {
      opsUserConditionList.value.splice(index, 1);
    };
    const changeConditionCode = (t) => {
      if (!t.conditionCode.length) return;
      let item = getOPSConditionList().filter((e) => {
        return e.value === t.conditionCode;
      })[0];
      t.conditionValue = [];
    };
    /* c-用户条件 */
    const cUserConditionList = ref([
      {
        conditionCode: "",
        conditionOperator: "",
        conditionValue: [],
      },
    ]);
    const addCOption = (index) => {
      if (cUserConditionList.value.length >= 30) {
        return root.$message.warning(root.$t("选项最多$个").replace("$", "30"));
      }
      cUserConditionList.value.splice(index + 1, 0, {
        conditionCode: "",
        conditionOperator: "",
        conditionValue: [],
      });
    };
    const deleteCOption = (index) => {
      cUserConditionList.value.splice(index, 1);
    };
    const changeCUserConditionCode = (t) => {
      t.conditionValue = [];
    };

    const formStateOPS = reactive({
      userType: 0,
      ruleType: 0,
    });
    const formStateOfCUser = reactive({
      userType: 1,
      ruleType: 0,
      markId: "",
    });
    watch(
      () => formStateOPS.ruleType,
      () => {
        opsUserConditionList.value = [
          {
            conditionCode: "",
            conditionOperator: "",
            conditionValue: [],
          },
        ];
      }
    );
    watch(
      () => formStateOfCUser.ruleType,
      () => {
        cUserConditionList.value = [
          {
            conditionCode: "",
            conditionOperator: "",
            conditionValue: [],
          },
        ];
      }
    );

    const handleType = ref("");
    onMounted(() => {
      const { type } = root.$route.query;
      handleType.value = type;
    });
    const buildParameters = () => {
      let addSaleRuleDetailReqList = [];
      opsUserConditionList.value.forEach((e) => {
        addSaleRuleDetailReqList.push({
          userType: formStateOPS.userType,
          ruleType: formStateOPS.ruleType,
          opsUserChannel: e.conditionCode,
          typeContain:
            e.conditionOperator === "IN"
              ? 0
              : e.conditionOperator === "NOTIN"
              ? 1
              : null,
          userRuleIdList: e.conditionValue,
        });
      });
      cUserConditionList.value.forEach((e) => {
        addSaleRuleDetailReqList.push({
          userType: formStateOfCUser.userType,
          ruleType: formStateOfCUser.ruleType,
          userChannel: e.conditionCode,
          typeContain:
            e.conditionOperator === "IN"
              ? 0
              : e.conditionOperator === "NOTIN"
              ? 1
              : null,
          userChannelDetail: e.conditionCode === 1 ? e.conditionValue : null,
          channelCode: e.conditionCode === 0 ? e.conditionValue : null,
          markId: formStateOfCUser.markId,
        });
      });
      emit("changeSelect", addSaleRuleDetailReqList);
    };

    const dataEcho = (list) => {
      if (!list || !list.length) return;
      let opsList = [];
      let cList = [];
      list.forEach((e) => {
        if (e.userType === 0) {
          opsList.push(e);
          formStateOPS.ruleType = e.ruleType;
        } else {
          cList.push(e);
          formStateOfCUser.ruleType = e.ruleType;
        }
      });
      setTimeout(() => {
        opsUserConditionList.value = [];
        opsList.forEach((e, i) => {
          opsUserConditionList.value.push({
            conditionCode: e.opsUserChannel,
            conditionOperator: e.typeContain === 0 ? "IN" : "NOTIN",
            conditionValue: e.userRuleIdList,
          });
          let refName = `department${i}`;
          refs[refName][0].defaultNodes = e.userRuleIdList;
          setTimeout(() => {
            refs[refName][0].handleCheckChangeArea();
          }, 500);
        });
        cUserConditionList.value = [];
        cList.forEach((e, i) => {
          cUserConditionList.value.push({
            conditionCode: e.userChannel,
            conditionOperator: e.typeContain === 0 ? "IN" : "NOTIN",
            conditionValue:
              e.userChannel === 1 ? e.userChannelDetail : e.channelCode,
          });
          if (e.userChannel === 0 && e.channelCode?.length) {
            setTimeout(() => {
              let refName = `channelCode${i}`;
              refs[refName][0].initCode(e.channelCode);
            }, 100);
          }
          if (e.ruleType === 2) {
            formStateOfCUser.markId = e.markId;
            refs["CustomUpload"].targetUserGroupId = e.markId;
          }
        });
      }, 500);
      buildParameters();
    };
    const getFile = async () => {
      const { id } = root.$route.query;
      const url = `${process.env.VUE_APP_BASE_API}/opsapi/trading/center/sale/rule/export?ruleId=${id}`;
      axios({
        url: url,
        method: "get",
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Authorization: `Bearer ${
            JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
          }`,
        },
      })
        .then((response) => {
          let blob = new Blob([response.data]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = `file.xls`; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          root.$notify({
            message: root.$t("请查看已下载文件《file.xlsx》"),
            type: "success",
          });
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .finally();
    };
    return {
      isEn,
      opsUserConditionList,
      cUserConditionList,
      addOption,
      addCOption,
      deleteOption,
      deleteCOption,
      changeConditionCode,
      changeCUserConditionCode,
      getOPSConditionList,
      getConditionStatus,
      getCUserConditionList,
      getNewSigningOrRenewalList,
      OPS_CONDITION_TYPE,
      C_CONDITION_TYPE,
      formStateOPS,
      formStateOfCUser,
      buildParameters,
      dataEcho,
      getFile,
      handleType,
    };
  },
};
</script>
<style lang="scss" scoped>
.add-sale-rule-warp {
  .title {
    font-weight: 700;
    color: #666666;
  }
  .condition-item {
    margin-bottom: 20px;
    i {
      font-weight: 700;
      cursor: pointer;
      font-size: 16px;
      margin-left: 5px;
    }
  }
}
</style>

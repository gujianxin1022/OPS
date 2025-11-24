<template>
  <div>
    <el-select
      class="chooseTmStyle"
      ref="personSelect"
      v-model="rangeVal"
      multiple
      collapse-tags
      clearable
      filterable
      v-if="Teaching"
      :placeholder="$t('请选择')"
      @change="change_stuVal"
    >
      <el-option
        v-for="item in rangeData"
        :key="item.id"
        :label="item.label"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <div
      v-else
      class="tree_class"
      :style="{
        width:
          currentLang === 'en'
            ? isShowLACCSelect &&
              (hasLAPermission || hasCCPermission || hasTeachTubePermission)
              ? '600px'
              : '470px'
            : isShowLACCSelect &&
              (hasLAPermission || hasCCPermission || hasTeachTubePermission)
            ? '520px'
            : '400px',
      }"
    >
      <!-- LA/CC/教管 下拉筛选 -->
      <!-- 1.教管 2.学管 3.顾问 -->
      <el-select
        v-if="
          isShowLACCSelect &&
          (hasCCPermission || hasLAPermission || hasTeachTubePermission)
        "
        size="mini"
        :placeholder="$t('请选择')"
        v-model="selectLACCVal"
        @change="onChangeTopType"
        :style="{ width: currentLang === 'en' ? '120px' : '110px' }"
      >
        <el-option
          v-if="hasTeachTubePermission"
          key="1"
          :label="$t('按教管筛选')"
          value="1"
        >
        </el-option>
        <el-option
          v-if="hasLAPermission"
          key="2"
          :label="$t('按学管筛选')"
          value="2"
        >
        </el-option>
        <el-option
          v-if="hasCCPermission"
          key="3"
          :label="$t('按顾问筛选')"
          value="3"
        >
        </el-option>
      </el-select>
      <!-- 按人选/按组选  -->
      <el-select
        size="mini"
        :class="{
          chooseStyle:
            isShowLACCSelect &&
            (hasCCPermission || hasLAPermission || hasTeachTubePermission),
        }"
        v-model="chooseVal"
        :placeholder="$t('请选择')"
        @change="checkClickAdd"
        :style="{ width: currentLang === 'en' ? '150px' : '90px' }"
      >
        <el-option
          v-for="item in chooseData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <template v-if="chooseVal == 1">
        <el-select
          class="chooseStyle"
          ref="personSelect"
          v-model="rangeVal"
          multiple
          collapse-tags
          clearable
          filterable
          :placeholder="$t('请选择')"
          @change="change_stuVal"
        >
          <el-option
            v-for="item in rangeData"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </template>
      <el-cascader
        v-model="selectedRangeOptions"
        class="chooseStyle"
        ref="cascader"
        :placeholder="$t('请选择')"
        v-else
        :options="rangeData"
        :props="options"
        collapse-tags
        clearable
        filterable
        @change="getCheckedNodes"
      ></el-cascader>
    </div>
  </div>
</template>
<script>
import { getStorage } from "@/utils/handleStorage";
import {
  getGropData,
  getStudentSData,
  getTeachingTmData,
} from "../../../api/tree_search/index";
import { mapGetters } from "vuex";
export default {
  name: "commonTree",
  props: [
    "Teaching",
    "isShowLACCSelect",
    "hasLAPermission",
    "hasCCPermission",
    "hasTeachTubePermission",
    "selectedRangeData",
    "defaultNotSelected",
  ],
  data() {
    return {
      options: {
        children: "children",
        label: "label",
        value: "id",
        multiple: true,
      },
      isDisabled: true,
      chooseVal: "1",
      chooseData: [
        {
          value: "0",
          label: this.$t("按组选"),
        },
        {
          value: "1",
          label: this.$t("按人选"),
        },
      ],
      rangeVal: [],
      rangeData: [],
      isMounted: true,
      funcCodeGroup: "200503",
      selectLACCVal: null,
      selectedRangeOptions: [],
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    currentLang() {
      this.chooseData = [
        {
          value: "0",
          label: this.$t("按组选"),
        },
        {
          value: "1",
          label: this.$t("按人选"),
        },
      ];
    },
    selectedRangeData: {
      handler(val) {
        this.changeRangeVal(val.rangeType);
        this.setDefaultRangeData();
      },
      deep: true,
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.Teaching) {
      this.getUsersData();
    } else {
      if (
        !this.selectedRangeData?.rangeType &&
        this.selectedRangeData?.rangeType !== "0"
      ) {
        this.getStuData();
      }
    }
    if (this.isShowLACCSelect) {
      this.getLACCOptionByPermission();
    }
    this.$eventBus.$on("clearFilter", () => {
      this.resetData();
    });
    if (this.selectedRangeData && this.selectedRangeData.rangeType?.length) {
      this.setDefaultRangeData();
    }
  },
  methods: {
    resetData() {
      this.rangeVal = "";
      this.selectedRangeOptions = [];
      this.$emit("get_seleParams", null, "clear", null, this.chooseVal);
    },
    /**
     * 根据权限调整默认选中
     */
    getLACCOptionByPermission() {
      // 1.教管 2.学管 3.顾问
      if (this.hasTeachTubePermission) {
        this.selectLACCVal = "1";
      } else if (
        !this.hasTeachTubePermission &&
        this.hasLAPermission &&
        !this.hasCCPermission
      ) {
        this.selectLACCVal = "2";
      } else if (
        !this.hasTeachTubePermission &&
        this.hasCCPermission
      ) {
        this.selectLACCVal = "3";
      }
      this.$emit("get_seleParams", null, "init", this.selectLACCVal);
    },
    getUsersData() {
      getTeachingTmData().then((res) => {
        let resData = res.data.data;
        resData.map((item) => {
          item.id = item.userId;
          item.label = `${item.username} — ${item.postNameZh}`;
        });
        this.rangeData = res.data.data;
        if (this.isMounted) {
          const userId = JSON.parse(getStorage("userInfo")).id;
          let arrayVal = resData.filter((item) => item.userId === userId);
          this.$set(this.rangeVal, 0, arrayVal[0].userId);
          this.isMounted = false;
        }
        this.change_stuVal(this.rangeVal);
      });
    },
    getStuData() {
      getStudentSData(JSON.parse(getStorage("userInfo")).id).then((res) => {
        let resData = res.data.data;
        resData.map((item) => {
          item.id = item.userId;
          item.label = `${item.username} — ${item.postNameZh}`;
        });
        this.rangeData = res.data.data;
        if (this.isMounted) {
          this.isMounted = false;
          if (this.defaultNotSelected) return;
          const userId = JSON.parse(getStorage("userInfo")).id;
          let arrayVal = resData.find((item) => item.userId === userId);
          if (arrayVal) this.$set(this.rangeVal, 0, arrayVal.userId);
        }
        this.change_stuVal(this.rangeVal);
      });
    },
    checkClickAdd(val) {
      if (this.Teaching) {
      } else {
        this.changeRangeVal(val);
      }
      this.$emit(
        "get_seleParams",
        val,
        "clear",
        this.selectLACCVal,
        this.chooseVal
      );
    },

    changeRangeVal(val) {
      const userId = JSON.parse(getStorage("userInfo")).id;
      if (val === "0") {
        this.selectedRangeOptions = [];
        getGropData(userId).then((res) => {
          this.rangeData = res.data.data;
        });
      } else if (val === "1") {
        this.rangeVal = [];
        this.getStuData();
      } else {
        this.rangeData = [];
      }
    },

    onChangeTopType() {
      this.$emit("get_seleParams", null, null, this.selectLACCVal);
    },

    change_stuVal(val) {
      let valName = "userIdList";
      this.$emit(
        "get_seleParams",
        val,
        valName,
        this.selectLACCVal,
        this.chooseVal
      );
    },
    getCheckedNodes(val) {
      if (!val) return;
      const checkedNodes = this.$refs.cascader
        .getCheckedNodes()
        .map((t) => t.value);
      let valName = "postIdList";
      this.$emit(
        "get_seleParams",
        checkedNodes,
        valName,
        this.selectLACCVal,
        this.chooseVal,
        val
      );
    },
    setDefaultRangeData() {
      const userId = JSON.parse(getStorage("userInfo")).id;
      const { rangeType, rangeValue } = this.selectedRangeData;
      this.chooseVal = rangeType;
      if (rangeType === "1") {
        getStudentSData(JSON.parse(getStorage("userInfo")).id).then((res) => {
          this.rangeData = (res?.data?.data || []).map((t) => {
            return {
              id: t.userId,
              label: `${t.username} — ${t.postNameZh}`,
            };
          });
          if (!rangeValue?.length) {
            const userId = JSON.parse(getStorage("userInfo")).id;
            let arrayVal = this.rangeData.find((item) => item.id === userId);
            if (arrayVal) this.$set(this.rangeVal, 0, arrayVal?.id);
          } else {
            if (Array.isArray(rangeValue)) {
              this.rangeVal = rangeValue;
            } else {
              const arr = rangeValue?.split(",").map((t) => +t);
              this.rangeVal = arr?.every((t) => t === 0) ? [] : arr;
            }
          }
          this.change_stuVal(this.rangeVal);
        });
      } else {
        getGropData(userId)
          .then(({ data }) => {
            if (data.code !== 200) return Promise.reject();
            this.rangeData = data?.data;
            this.selectedRangeOptions = rangeValue;
          })
          .catch(() => {
            this.rangeData = [];
            this.selectedRangeOptions = [];
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tree_class {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  ::v-deep .el-tag.el-tag--info {
    max-width: 130px;
    overflow: hidden;
  }
  ::v-deep .el-input__inner {
    border: none;
  }
  .chooseStyle {
    border-left: 1px solid #dcdfe6;
    width: 300px;
  }
}

::v-deep .chooseTmStyle .el-input__inner {
  width: 220px;
}
</style>

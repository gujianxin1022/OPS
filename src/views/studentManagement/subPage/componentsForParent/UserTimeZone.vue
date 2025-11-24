<template>
  <div class="user-time-zone-warp">
    <div v-show="!showEdit">
      <span class="value">
        <span v-if="zoneId">
          {{ filterZoneName(zoneId, isEn) }}
        </span>
        <span v-else> - </span>
        <i
          v-if="Per.handleButtonPer('teach.studentMT.parentInfo.editTimeZone')"
          @click="showEdit = true"
          class="el-icon-edit-outline"
        ></i
      ></span>
    </div>
    <div v-show="showEdit">
      <el-select
        v-model="zoneId"
        filterable
        clearable
        :collapse-tags="true"
        :placeholder="$t('请选择')"
      >
        <el-option-group
          v-for="group in timeZoneList"
          :key="group.label"
          :label=$t(group.label)
        >
          <el-option
            v-for="item in group.options"
            :key="item.zoneId"
            :label="`(UTC${moment().tz(item.zoneId).format('Z')}) ${
              isEn ? item.en : item.zh
            }`"
            :value="item.zoneId"
          >
          </el-option>
        </el-option-group>
      </el-select>
      <template>
        <el-tooltip
          v-if="!zoneId"
          class="item"
          effect="dark"
          :content="$t('请选择用户时区')"
          placement="top"
        >
          <i style="color: #67c23a" class="el-icon-check"></i>
        </el-tooltip>
        <i
          v-else
          slot="reference"
          @click="handleSubmit"
          style="color: #67c23a"
          class="el-icon-check"
        ></i>
      </template>

      <i class="el-icon-close" style="color: #f56c6c" @click="close" />
    </div>
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  computed,
  ref,
  watch,
} from "@vue/composition-api";
import moment from "moment-timezone";
import { timeZoneList, filterZoneName } from "@/utils/timeZone";
export default {
  props: {
    timeZone: {
      type: String,
      default: "",
    },
    parentId: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const zoneId = ref("");
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const showEdit = ref(false);
    const close = () => {
      showEdit.value = false;
      zoneId.value = props.timeZone;
    };
    const handleSubmit = async () => {
      try {
        const params = {
          timeZone: zoneId.value,
          parentUserId: props.parentId,
        };
        await root.$Api.studentManagement.reqUpdateParentTimezone(params);
        showEdit.value = false;
        root.$notify({
          type: "success",
          message: root.$t("操作成功"),
        });
        emit("updateParentInfo", zoneId.value);
      } finally {
      }
    };
    onMounted(() => {
      zoneId.value = props.timeZone;
    });
    return {
      zoneId,
      timeZoneList,
      isEn,
      moment,
      showEdit,
      filterZoneName,
      close,
      handleSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-time-zone-warp {
  i {
    cursor: pointer;
    margin: 0 5px;
  }
  .value {
    display: inline-block;
    line-height: 20px;
  }
}
</style>

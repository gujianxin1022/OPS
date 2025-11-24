<template>
  <div class="search-parent-id-warp">
    <div class="input-box">
      <img :src="tigger" alt="" />
      <el-input
        autofocus
        @keyup.enter.native="search"
        :placeholder="$t('请输入家长用户名/手机号/邮箱')"
        v-model="userName"
        class="input-with-select"
      >
        <el-button
          slot="append"
          @click="search"
          :icon="loading ? 'el-icon-loading' : 'el-icon-search'"
        ></el-button>
      </el-input>
    </div>
    <div class="result" v-show="result && result.length">
      <span>
        {{ result }}
      </span>
      <i class="el-icon-document-copy" @click="onCopyLink(result)"></i>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch } from "@vue/composition-api";
import { copyLink } from "@/utils/file";
import tigger from "@/assets/tigger.png";
export default {
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const userName = ref("");
    const result = ref("");
    const loading = ref(false);
    const search = async () => {
      if (!userName.value.length) return;
      try {
        loading.value = true;
        const res =
          await root.$Api.systemManagement.reqParentIDByUserNameOrPhone({
            userNameOrPhone: userName.value,
          });
        if (!res) {
          result.value = "";
          return root.$notify({
            message: root.$t("未查询到相关家长ID"),
            type: "error",
          });
        }
        result.value = res ? `${res}` : "";
      } finally {
        loading.value = false;
      }
    };
    const onCopyLink = async (link) => {
      await copyLink(link)
        .then(
          () => {
            root.$notify({
              message: root.$t("复制成功"),
              type: "success",
            });
          },
          () => {
            root.$notify({
              message: root.$t("复制失败"),
              type: "error",
            });
          }
        )
        .finally(() => {});
    };
    return {
      userName,
      result,
      tigger,
      loading,
      search,
      onCopyLink,
    };
  },
};
</script>
<style scoped lang="scss">
.search-parent-id-warp {
  padding-top: 250px;
  .input-box {
    width: 596px;
    height: 52px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    margin: 0 auto;
    border-radius: 24px;
    position: relative;
    img {
      position: absolute;
      width: 40px;
      top: 1px;
      left: 10px;
    }
  }
  .input-box:hover {
    box-shadow: 0 3px 8px #7580e5;
    img {
      position: absolute;
      width: 40px;
      top: -24px;
      left: 45px;
    }
  }
  .result {
    width: 596px;
    margin: 0 auto;
    margin-top: 40px;
    font-size: 18px;
    color: #666666;
    padding-left: 20px;
    .el-icon-document-copy {
      cursor: pointer;
      margin-left: 10px;
    }
    .el-icon-document-copy:hover {
      cursor: pointer;
      color: #7580e5;
    }
  }
}
</style>
<style lang="scss">
.search-parent-id-warp {
  .input-box {
    .el-input {
      border-radius: 24px;
      height: 100%;
      .el-input__inner {
        height: 100% !important;
        border-radius: 24px 0 0 24px;
        border: none;
        font-size: 20px;
      }
      .el-input-group__append {
        border: none;
        border-radius: 0 24px 24px 0;
        background: #fff;
        font-size: 20px;
        color: #7580e5;
      }
      .el-input-group__append:hover {
        font-size: 24px;
      }
    }
  }
}
</style>

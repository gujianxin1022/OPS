<template>
  <div class="channel-code-warp mt5">
    <div class="mt5" v-for="(item, index) in codeList" :key="index">
      <span v-for="i in countNum" :key="index + i">
        <el-input
          @input="toUpperCase(item[i], index, i)"
          v-model="item[i]"
          clearable
          class="input"
        ></el-input
        ><span v-show="i !== 4"> — </span>
      </span>
      <i @click="addOption(index)" class="el-icon-circle-plus-outline"></i>
      <i
        @click.prevent="deleteOption(index)"
        v-if="codeList.length > 1"
        class="el-icon-remove-outline"
      ></i>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
export default {
  setup(props, { root, refs, emit }) {
    const codeList = ref([[]]);
    const addOption = (index) => {
      if (codeList.value.length >= 10) {
        return root.$message.warning(root.$t("选项最多$个").replace("$", "10"));
      }
      codeList.value.splice(index + 1, 0, []);
    };
    const countNum = [0, 1, 2, 3, 4];
    const deleteOption = (index) => {
      codeList.value.splice(index, 1);
      emitChange()
    };
    const toUpperCase = (val, index, _index) => {
      codeList.value[index][_index] = val
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();
      emitChange();
    };
    const emitChange = () => {
      let codeArr = [];
      codeList.value.forEach((e) => {
        codeArr.push(e.join("-").replace(/-+$/, ""));
      });
      emit("changeCode", codeArr);
    };
    const initCode = (list) => {
      codeList.value = [];
      list.forEach((e, i) => {
        root.$set(codeList.value, i, e.split("-"));
      });
      console.log(codeList.value);
    };
    return {
      countNum,
      codeList,
      addOption,
      deleteOption,
      toUpperCase,
      initCode,
    };
  },
};
</script>
<style lang="scss">
.channel-code-warp {
  .input {
    width: 80px;
    .el-input__inner {
      padding-left: 5px !important;
      padding-right: 3px !important;
      background: rgb(234, 247, 234);
    }
  }
  i {
    cursor: pointer;
  }
}
</style>

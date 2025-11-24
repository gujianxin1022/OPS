<template>
  <!-- 根据老师教管筛选-->
  <div>
    <el-select
      v-model="key"
      filterable
      clearable
      :collapse-tags="true"
      :placeholder="$t('请选择')"
      @change="changeSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="$t(item.username)"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { onMounted, ref } from "@vue/composition-api";
export default {
  props: {
    isShowAll: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { root, emit }) {
    const { id } = JSON.parse(localStorage.getItem("userInfo"));
    const options = ref([]);
    const key = ref("");
    const reqList = async () => {
      root.$Api.systemManagement
        .getThisRoleUserList({
          roleId: root.Constants.teacherMtCode,
          pageNum: 1,
          pageSize: 1000,
        })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            options.value = props.isShowAll
              ? [
                  {
                    username: "全部",
                    id: "",
                  },
                  ...data.data.list,
                ]
              : [...data.data.list];
            const isIncludesLoginUser = options.value.some((e) => {
              return e.id === id;
            });
            if (isIncludesLoginUser) {
              key.value = id;
              changeSelect(id);
            }
          }
        });
    };
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    onMounted(() => {
      reqList();
    });
    return {
      options,
      key,
      changeSelect,
    };
  },
};
</script>

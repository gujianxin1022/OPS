
<template>
  <div>
    <div
      class="block"
      v-loading="loading"
    >
      <el-cascader
        v-model="value"
        :options="options"
        @change="handleChange"
        :placeholder="$t('请选择')"
        :props="defaultProps"
      >
        <template slot-scope="{ data }">
          <span>{{ data.name }}</span>
          <el-tag
            v-if="data.trialLesson===1"
            type="success"
          >{{$t('试听')}}</el-tag>
        </template>
      </el-cascader>
    </div>
  </div>
</template>
<script>
import { getCourseProgressTree } from "@/api/studentManagement";
import { mapGetters } from "vuex";
export default {
  name: "courseProgress",
  props: ["packageId", "packageTreeId", "lessonId"],
  data () {
    return {
      value: [],
      options: [],
      defaultProps: {
        label: "name",
        value: "id",
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  mounted () {
    this.loading = true
    this.reqCourseProgress().finally(() => {
      this.loading = false
    })
  },
  methods: {
    handleChange (value) {
      this.$emit("select", value);
    },
    // 获取课程包下树结构
    async reqCourseProgress () {
      const {
        status,
        data: { code, data },
      } = await getCourseProgressTree(this.packageId);
      if (status !== 200 || code !== 200) return Promise.reject();
      if (this.currentLang === "en") {
        data.treeList.forEach((e) => {
          e.name = e.nameEn;
        });
      }
      this.options = data.treeList || [];
      /* if 学生有进度则请求学情回显进度 else 手动选择 */
      if (this.packageTreeId && this.lessonId) {
        await this.reqTreeIds();
      }
      return Promise.resolve()
    },
    // 获取版本级别全链路id集合
    async reqTreeIds () {
      const {
        status,
        data: { code, data },
      } = await this.$Api.task.reqTreeIdsByPackageId({
        packageId: this.packageId,
        packageTreeId: this.packageTreeId,
        lessonIdList: [this.lessonId],
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      if (data && data.length > 0 && data[0]) {
        const item = data[0];
        const ids = [
          item.packageTreeId,
          item.levelId,
          item.unitId,
          item.lessonId,
        ];
        this.$emit("select", ids);
        this.value = ids;
      } else {
        this.$message.error(this.$t("课程进度选择有误，请重新选择~"));
        this.$emit("select", []);
      }
    },
  },
};
</script>
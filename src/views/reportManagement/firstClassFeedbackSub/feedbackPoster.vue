<template>
  <div style="padding-top: 4px">
    <el-button
      type="primary"
      size="small"
      class="createBtn mb10"
      @click="createLink"
      >{{ $t("生成H5短链") }}</el-button
    >
    <div>
      <iframe
        frameborder="0"
        scrolling="auto"
        style="width: 100%; height: 1100px"
        :src="reportUrl"
      />
    </div>
  </div>
</template>

<script>
import { getTrialClassReportUrl } from "@/api/unitReportManagement/";
export default {
  props: {
    lang: {
      type: "String",
      default: "CN",
    },
    reportId: {
      type: "String",
      default: "",
    },
    pageData:{
      type: Object,
      default: {},
    }
  },
  data() {
    return {
      reportUrl: null,
    };
  },
  name: "feedbackPoster",
  watch: {
    lang(val) {
      this.getReportUrl();
    },
  },
  mounted() {
    this.getReportUrl();
  },
  methods: {
    createLink() {
      this.$emit("createLink", this.reportUrl);
    },
    async getReportUrl() {
      let language;
      switch (this.lang) {
        case "EN":
          language = "en";
          break;
        case "TN":
          language = "tn";
          break;
        case "IN":
          language = "in";
          break;
        case "FR":
          language = "fr";
          break;
        default:
          language = "zh";
      }
      // let {studentname,courseEditionId,startTime,endTime,lessonNo,courseLevel,teachername}=this.$route.query;
      let{studentRealName,courseEditionId,startTime,endTime,lessonNo,courseLevel,tutorRealName}=this.pageData

      const {
        status,
        data: { code, data },
      } = await getTrialClassReportUrl(this.reportId);
      if (status !== 200 || code !== 200) return Promise.reject();
      // this.reportUrl = `${data}&language=${language}&device=phone`;
      this.reportUrl = `${data}&language=${language}&device=phone&studentname=${studentRealName}&courseEditionId=${courseEditionId}&startTime=${startTime}&endTime=${endTime}&lessonNo=${lessonNo}&courseLevel=${courseLevel}&teachername=${tutorRealName}`;
    },
  },
};
</script>

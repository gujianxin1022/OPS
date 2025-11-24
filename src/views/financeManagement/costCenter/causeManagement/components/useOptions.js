import {
  computed,
  getCurrentInstance,
  markRaw,
  onMounted,
  onUnmounted,
  reactive,
} from "@vue/composition-api";
import { getJobPositionList } from "@/api/systemManagement";
import {
  getCostList as getCostListApi,
  getCostTypeList as getCostTypeListApi,
} from "@/api/financeManagement";

let requestStatus = 0; /* 0: 未请求 || 失败； 1: 请求中 || 请求结束； */

const options = reactive({
  departmentList: [],
  costList: [],
  costTypeList: [],
});

export const useOptions = () => {
  const {
    proxy: {
      $store: {
        state: { app },
      },
    },
  } = getCurrentInstance();

  const departmentList = computed(() =>
    markRaw(
      options.departmentList.map((v) => ({
        label: app.currentLang === "zh" ? v.nameZh : v.nameEn,
        value: v.id,
        nameZh: v.nameZh,
        nameEn: v.nameEn,
      }))
    )
  );

  const costList = computed(() => {
    const loop = (data) =>
      data.map((v) => ({
        label: app.currentLang === "zh" ? v.costNameZh : v.costNameEn,
        value: v.id,
        nameZh: v.costNameZh,
        nameEn: v.costNameEn,
        children:
          v.financeCostResultResps?.length && loop(v.financeCostResultResps),
      }));
    return markRaw(loop(options.costList));
  });

  const costTypeList = computed(() =>
    markRaw(
      options.costTypeList.map((v) => ({
        label: app.currentLang === "zh" ? v.typeNameZh : v.typeNameEn,
        value: v.id,
      }))
    )
  );

  const getDepartmentList = async () => {
    const {
      status,
      data: { code, data },
    } = await getJobPositionList();
    if (status !== 200 || code !== 200) return Promise.reject();
    options.departmentList = markRaw(
      data.filter((v) => v.pid === 4 /* LINGGO_ACE_ID */)
    );
  };

  const getCostList = async () => {
    const {
      status,
      data: { code, data },
    } = await getCostListApi();
    if (status !== 200 || code !== 200) return Promise.reject();
    options.costList = markRaw(data);
  };

  const getCostTypeList = async () => {
    const {
      status,
      data: { code, data },
    } = await getCostTypeListApi();
    if (status !== 200 || code !== 200) return Promise.reject();
    options.costTypeList = markRaw(data);
  };

  onMounted(() => {
    if (requestStatus) return;
    requestStatus = 1;
    try {
      Promise.all([getDepartmentList(), getCostList(), getCostTypeList()]);
    } catch {
      requestStatus = 0;
    }
  });

  onUnmounted(() => void (requestStatus = 0));

  return {
    costList,
    departmentList,
    costTypeList,
  };
};

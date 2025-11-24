import { ref } from "@vue/composition-api";
/* 试一下,vue3新概念响应状态替代vuex */
export const withNewSaleRule = ref(false);/* 用于创建新的任务模板后刷新任务模板列表,同级页面状态响应 */

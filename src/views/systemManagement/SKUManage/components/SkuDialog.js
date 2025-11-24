import i18n from "@/assets/locales/index";
import { getStorage } from "@/utils/handleStorage";
import { createForm, onFormUnmount, onFieldMount } from "@formily/core";
import * as Constants from "@/utils/constants";
const {
  validityTypeList,
  subscribeCycleList,
  studyLengthList,
  expireTypeList,
  promotionTagList,
} = Constants.default;
const isEn = getStorage("localeLanguage") === "en";
const _createForm = () =>
  createForm({
    effects() {
      onFormUnmount(() => (form = _createForm()));
    },
  });
export let form = _createForm();

export const schema = (props, isEn, root) => {
  function handleAgreementList(agreementList) {
    props.agreementList.forEach((e) => {
      e.value = e.id;
      e.label = isEn ? e.titleEn : e.titleCh;
    });
  }
  handleAgreementList(props.agreementList);
  const cantEdit = props.type === "查看";
  return cantEdit
    ? {
        type: "object",
        properties: {
          grid: {
            type: "void",
            "x-component": "FormGrid",
            "x-component-props": {
              minColumns: 0,
              maxColumns: 6,
            },
            properties: {
              spuId: {
                type: "string",
                default: props.spuInfo.spuId,
              },
              name: {
                type: "void",
                properties: {
                  nameCn: {
                    type: "string",
                    title: i18n.t("SKU中文名称"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: cantEdit,
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  descriptionCn: {
                    type: "string",
                    title: i18n.t("SKU中文描述"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input.TextArea",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: cantEdit,
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  seat1: {
                    type: "void",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  nameEn: {
                    type: "string",
                    title: i18n.t("SKU英文名称"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: cantEdit,
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  descriptionEn: {
                    type: "string",
                    title: i18n.t("SKU英文描述"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input.TextArea",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: cantEdit,
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  seat2: {
                    type: "void",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  nameFra: {
                    type: "string",
                    title: i18n.t("SKU法文名称"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: cantEdit,
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  descriptionFra: {
                    type: "string",
                    title: i18n.t("SKU法文描述"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input.TextArea",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: cantEdit,
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  seat3: {
                    type: "void",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                },
              },
              line1: {
                type: "void",
                "x-decorator": "FormItem",
                "x-component": "el-divider",
                "x-decorator-props": {
                  gridSpan: 6,
                },
              },
              config: {
                type: "void",
                properties: {
                  amount: {
                    type: "number",
                    title: i18n.t("课时数量"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: props.type === "编辑" || cantEdit,
                    },
                    default: 1,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  validityTime: {
                    type: "string",
                    title: i18n.t("有效期"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: cantEdit,
                    },
                    default: 1,
                  },
                  validityType: {
                    type: "string",
                    "x-decorator": "FormItem",
                    enum: validityTypeList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      disabled: cantEdit,
                      "popper-append-to-body": false,
                      style: "padding-top:41px",
                    },
                    default: 0,
                  },
                  studyLength: {
                    type: "string",
                    title: i18n.t("建议学习时长"),
                    "x-decorator": "FormItem",
                    enum: studyLengthList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      disabled: cantEdit,
                      "popper-append-to-body": false,
                    },
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  supportSubscribe: {
                    title: i18n.t("是否支持订阅"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("不支持"),
                        value: 0,
                      },
                      {
                        label: i18n.t("支持"),
                        value: 1,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                    "x-component-props": {
                      disabled: cantEdit,
                    },
                  },
                  subscribeCycle: {
                    type: "string",
                    title: i18n.t("订阅周期"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: cantEdit,
                    },
                    default: 0,
                  },
                  subscribeCycleUnit: {
                    type: "string",
                    "x-decorator": "FormItem",
                    enum: subscribeCycleList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      disabled: cantEdit,
                      "popper-append-to-body": false,
                      style: "padding-top:41px",
                    },
                    default: 0,
                  },
                  agreementId: {
                    type: "string",
                    title: i18n.t("支付条款协议"),
                    "x-decorator": "FormItem",
                    enum: props.agreementList,
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      disabled: cantEdit,
                      "popper-append-to-body": false,
                    },
                    // default: props.agreementList[0].value,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  coinMallShow: {
                    title: i18n.t("是否显示在积分商城"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("隐藏"),
                        value: 0,
                      },
                      {
                        label: i18n.t("显示"),
                        value: 1,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                    "x-component-props": {
                      disabled: cantEdit,
                    },
                  },
                  coinExchangeAmount: {
                    type: "string",
                    title: i18n.t("所需积分"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: cantEdit,
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  seat4: {
                    type: "void",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  // converCnUrl: {
                  //   type: "string",
                  //   title: i18n.t("积分展示图(中)"),
                  //   "x-decorator": "FormItem",
                  //   "x-component": "UploadImage",
                  //   "x-component-props": {
                  //     style: "color:#7580E5;cursor: pointer;",
                  //   },
                  //   "x-component-props": {
                  //     disabled: cantEdit,
                  //     imgUrl: props.skuDetail.converCnUrl,
                  //     isReUpload:
                  //       form.getValuesIn("converCnUrl")?.length > 0 ||
                  //       props.skuDetail.converCnUrl?.length > 0,
                  //   },
                  //   "x-decorator-props": {
                  //     gridSpan: 2,
                  //     tooltipLayout: "text",
                  //     tooltip: i18n.t("图片格式：JPG/PNG/JPEG; 大小不超过3MB"),
                  //   },
                  // },
                  // converEnUrl: {
                  //   type: "string",
                  //   title: i18n.t("积分展示图(英)"),
                  //   "x-decorator": "FormItem",
                  //   "x-component": "UploadImage",
                  //   "x-component-props": {
                  //     style: "color:#7580E5;cursor: pointer;",
                  //   },
                  //   "x-component-props": {
                  //     disabled: cantEdit,
                  //     imgUrl: props.skuDetail.converEnUrl,
                  //     isReUpload:
                  //       form.getValuesIn("converEnUrl")?.length > 0 ||
                  //       props.skuDetail.converEnUrl?.length > 0,
                  //   },
                  //   "x-decorator-props": {
                  //     gridSpan: 2,
                  //     tooltipLayout: "text",
                  //     tooltip: i18n.t("图片格式：JPG/PNG/JPEG; 大小不超过3MB"),
                  //   },
                  // },
                  // converFraUrl: {
                  //   type: "string",
                  //   title: i18n.t("积分展示图(法)"),
                  //   "x-decorator": "FormItem",
                  //   "x-component": "UploadImage",
                  //   "x-component-props": {
                  //     style: "color:#7580E5;cursor: pointer;",
                  //   },
                  //   "x-component-props": {
                  //     disabled: cantEdit,
                  //     imgUrl: props.skuDetail.converFraUrl,
                  //     isReUpload:
                  //       form.getValuesIn("converFraUrl")?.length > 0 ||
                  //       props.skuDetail.converFraUrl?.length > 0,
                  //   },
                  //   "x-decorator-props": {
                  //     gridSpan: 2,
                  //     tooltipLayout: "text",
                  //     tooltip: i18n.t("图片格式：JPG/PNG/JPEG; 大小不超过3MB"),
                  //   },
                  // },
                  status: {
                    title: i18n.t("是否上架"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("下架"),
                        value: 0,
                      },
                      {
                        label: i18n.t("上架"),
                        value: 1,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                    "x-component-props": {
                      disabled: cantEdit,
                    },
                  },
                  appShow: {
                    title: i18n.t("是否在商城显示"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("隐藏"),
                        value: 0,
                      },
                      {
                        label: i18n.t("显示"),
                        value: 1,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                    "x-component-props": {
                      disabled: cantEdit,
                    },
                  },
                  expireType: {
                    type: "string",
                    title: i18n.t("有效期计算方式"),
                    "x-decorator": "FormItem",
                    enum: expireTypeList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      disabled: cantEdit,
                    },
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  buyMultiple: {
                    title: i18n.t("该sku是否可以购买多个"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("是"),
                        value: 1,
                      },
                      {
                        label: i18n.t("否"),
                        value: 0,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                    "x-component-props": {
                      disabled: cantEdit,
                    },
                  },
                  upgradeSkuIdList: {
                    type: "string",
                    title: i18n.t("可升舱为的sku"),
                    "x-decorator": "FormItem",
                    "x-component": "RelatedSkuList",
                    "x-component-props": {
                      disabled: cantEdit,
                    },
                    default: [],
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  upgradeValidityTime: {
                    type: "string",
                    title: i18n.t("可升舱的时间窗口"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      disabled: cantEdit,
                    },
                    default: 0,
                  },
                  upgradeValidityType: {
                    type: "string",
                    "x-decorator": "FormItem",
                    enum: validityTypeList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      disabled: cantEdit,
                      "popper-append-to-body": false,
                      style: "padding-top:41px",
                    },
                    default: 0,
                  },
                },
              },
              line2: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "el-divider",
                "x-decorator-props": {
                  gridSpan: 6,
                },
              },
              currencyTotalPriceList: {
                type: "string",
                "x-decorator": "FormItem",
                "x-component": "SkuDetailPriceList",
                "x-component-props": {
                  style: "color:#7580E5;cursor: pointer;",
                },
                "x-component-props": {
                  disabled: cantEdit,
                  currencyList:
                    props.skuDetail.currencyTotalPriceList ||
                    props.currencyList,
                  fixedPriceList: props.spuInfo.costList || null,
                  type: props.type,
                  amount: form.getValuesIn("amount"),
                },
                "x-decorator-props": {
                  gridSpan: 6,
                },
              },
              promotionTag: {
                type: "string",
                title: i18n.t("促销标签"),
                "x-decorator": "FormItem",
                enum: promotionTagList(isEn),
                "x-component": "Select",
                "x-component-props": {
                  placeholder: i18n.t("请选择"),
                  disabled: cantEdit,
                  "popper-append-to-body": false,
                },
                default: "",
                "x-decorator-props": {
                  gridSpan: 2,
                },
              },
            },
          },
        },
      }
    : {
        type: "object",
        properties: {
          grid: {
            type: "void",
            "x-component": "FormGrid",
            "x-component-props": {
              minColumns: 0,
              maxColumns: 6,
            },
            properties: {
              spuId: {
                type: "string",
                default: props.spuInfo.spuId,
              },
              name: {
                type: "void",
                properties: {
                  nameCn: {
                    type: "string",
                    title: i18n.t("SKU中文名称"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  descriptionCn: {
                    type: "string",
                    title: i18n.t("SKU中文描述"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input.TextArea",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  seat1: {
                    type: "void",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  nameEn: {
                    type: "string",
                    title: i18n.t("SKU英文名称"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  descriptionEn: {
                    type: "string",
                    title: i18n.t("SKU英文描述"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input.TextArea",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  seat2: {
                    type: "void",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  nameFra: {
                    type: "string",
                    title: i18n.t("SKU法文名称"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  descriptionFra: {
                    type: "string",
                    title: i18n.t("SKU法文描述"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input.TextArea",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  seat3: {
                    type: "void",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                },
              },
              line1: {
                type: "void",
                "x-decorator": "FormItem",
                "x-component": "el-divider",
                "x-decorator-props": {
                  gridSpan: 6,
                },
              },
              config: {
                type: "void",
                properties: {
                  amount: {
                    type: "number",
                    title: i18n.t("课时数量"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: props.type === "编辑",
                      "@change": (val) => {
                        root.$store.commit(
                          "SET_SKU_AMOUNT",
                          form.getValuesIn("amount")
                        );
                      },
                    },
                    default: 1,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  validityTime: {
                    type: "string",
                    title: i18n.t("有效期"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      disabled: props.type === "编辑",
                    },
                    default: 1,
                  },
                  validityType: {
                    type: "string",
                    "x-decorator": "FormItem",
                    enum: validityTypeList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      style: "padding-top:41px",
                      disabled: props.type === "编辑",
                    },
                    default: 0,
                  },
                  studyLength: {
                    type: "string",
                    title: i18n.t("建议学习时长"),
                    "x-decorator": "FormItem",
                    enum: studyLengthList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                    },
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  supportSubscribe: {
                    title: i18n.t("是否支持订阅"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("不支持"),
                        value: 0,
                      },
                      {
                        label: i18n.t("支持"),
                        value: 1,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 1,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                    "x-reactions": [
                      {
                        target: "coinMallShow",
                        when: "{{$self.value==1}}",
                        fulfill: {
                          state: {
                            disabled: true,
                          },
                        },
                        otherwise: {
                          state: {
                            disabled: false,
                          },
                        },
                      },
                      {
                        target: "subscribeCycleUnit",
                        when: "{{$self.value==0}}",
                        fulfill: {
                          state: {
                            disabled: true,
                          },
                        },
                        otherwise: {
                          state: {
                            disabled: false,
                          },
                        },
                      },
                    ],
                    "x-component-props": {
                      disabled: props.type === "编辑" || cantEdit,
                      "@change": (val) => {
                        if (val === 0) {
                          form.setValuesIn("subscribeCycle", null);
                          form.setValuesIn("subscribeCycleUnit", null);
                        }
                        if (val === 1) {
                          /* 支持订阅，操作积分表单 */
                          form.setValuesIn("coinExchangeAmount", null);
                        }
                      },
                    },
                  },
                  editStatus: {
                    type: "string",
                    default: props.type,
                    "x-reactions": [
                      {
                        target: "subscribeCycle",
                        when: "{{$self.value ==='编辑'}}",
                        fulfill: {
                          state: {
                            disabled: true,
                          },
                        },
                        otherwise: {
                          state: {
                            disabled: false,
                          },
                        },
                      },
                      {
                        target: "subscribeCycleUnit",
                        when: "{{$self.value=='编辑'}}",
                        fulfill: {
                          state: {
                            disabled: true,
                          },
                        },
                        otherwise: {
                          state: {
                            disabled: false,
                          },
                        },
                      },
                    ],
                  },
                  subscribeCycle: {
                    type: "string",
                    title: i18n.t("订阅周期"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                    },
                    default: 0,
                    "x-reactions": {
                      dependencies: ["supportSubscribe"],
                      when: "{{$deps[0]==0}}",
                      fulfill: {
                        state: {
                          disabled: true,
                        },
                      },
                      otherwise: {
                        state: {
                          disabled: false,
                        },
                      },
                    },
                  },
                  subscribeCycleUnit: {
                    type: "string",
                    "x-decorator": "FormItem",
                    enum: subscribeCycleList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      style: "padding-top:41px",
                    },
                    default: 0,
                  },
                  agreementId: {
                    type: "string",
                    title: i18n.t("支付条款协议"),
                    "x-decorator": "FormItem",
                    enum: props.agreementList,
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      disabled: props.type === "编辑",
                    },
                    // default: props.agreementList[0].value,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  coinMallShow: {
                    title: i18n.t("是否显示在积分商城"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("隐藏"),
                        value: 0,
                      },
                      {
                        label: i18n.t("显示"),
                        value: 1,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                    "x-reactions": [
                      {
                        target: "supportSubscribe",
                        when: "{{$self.value==1}}",
                        fulfill: {
                          state: {
                            disabled: true,
                          },
                        },
                        otherwise: {
                          state: {
                            disabled: false,
                          },
                        },
                      },
                      {
                        target: "coinExchangeAmount",
                        when: "{{$self.value==0}}",
                        fulfill: {
                          state: {
                            disabled: true,
                          },
                        },
                        otherwise: {
                          state: {
                            disabled: false,
                          },
                        },
                      },
                      {
                        target: "converCnUrl",
                        when: "{{$self.value==0}}",
                        fulfill: {
                          state: {
                            display: "none",
                          },
                        },
                        otherwise: {
                          state: {
                            display: "visible",
                          },
                        },
                      },
                      {
                        target: "converEnUrl",
                        when: "{{$self.value==0}}",
                        fulfill: {
                          state: {
                            display: "none",
                          },
                        },
                        otherwise: {
                          state: {
                            display: "visible",
                          },
                        },
                      },
                      {
                        target: "converFraUrl",
                        when: "{{$self.value==0}}",
                        fulfill: {
                          state: {
                            display: "none",
                          },
                        },
                        otherwise: {
                          state: {
                            display: "visible",
                          },
                        },
                      },
                    ],
                    "x-component-props": {
                      "@change": (val) => {
                        if (val === 0) {
                          form.setValuesIn("coinExchangeAmount", null);
                        }
                        if (val === 1) {
                          form.setValuesIn("subscribeCycle", null);
                          form.setValuesIn("subscribeCycleUnit", null);
                        }
                      },
                    },
                  },
                  coinExchangeAmount: {
                    type: "string",
                    title: i18n.t("所需积分"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                    },
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  seat4: {
                    type: "void",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  // converCnUrl: {
                  //   type: "string",
                  //   title: i18n.t("积分展示图(中)"),
                  //   "x-decorator": "FormItem",
                  //   "x-component": "UploadImage",
                  //   "x-component-props": {
                  //     style: "color:#7580E5;cursor: pointer;",
                  //   },
                  //   "x-component-props": {
                  //     imgUrl: props.skuDetail.converCnUrl,
                  //     isReUpload:
                  //       form.getValuesIn("converCnUrl")?.length > 0 ||
                  //       props.skuDetail.converCnUrl?.length > 0,
                  //     "@change": (src) => {
                  //       form.setValuesIn("converCnUrl", src);
                  //     },
                  //   },
                  //   "x-decorator-props": {
                  //     gridSpan: 2,
                  //     tooltipLayout: "text",
                  //     tooltip: i18n.t("图片格式：JPG/PNG/JPEG; 大小不超过3MB"),
                  //   },
                  // },
                  // converEnUrl: {
                  //   type: "string",
                  //   title: i18n.t("积分展示图(英)"),
                  //   "x-decorator": "FormItem",
                  //   "x-component": "UploadImage",
                  //   "x-component-props": {
                  //     style: "color:#7580E5;cursor: pointer;",
                  //   },
                  //   "x-component-props": {
                  //     imgUrl: props.skuDetail.converEnUrl,
                  //     isReUpload:
                  //       form.getValuesIn("converEnUrl")?.length > 0 ||
                  //       props.skuDetail.converEnUrl?.length > 0,
                  //     "@change": (src) => {
                  //       form.setValuesIn(".converEnUrl", src);
                  //     },
                  //   },
                  //   "x-decorator-props": {
                  //     gridSpan: 2,
                  //     tooltipLayout: "text",
                  //     tooltip: i18n.t("图片格式：JPG/PNG/JPEG; 大小不超过3MB"),
                  //   },
                  // },
                  // converFraUrl: {
                  //   type: "string",
                  //   title: i18n.t("积分展示图(法)"),
                  //   "x-decorator": "FormItem",
                  //   "x-component": "UploadImage",
                  //   "x-component-props": {
                  //     style: "color:#7580E5;cursor: pointer;",
                  //   },
                  //   "x-component-props": {
                  //     imgUrl: props.skuDetail.converFraUrl,
                  //     isReUpload:
                  //       form.getValuesIn("converFraUrl")?.length > 0 ||
                  //       props.skuDetail.converFraUrl?.length > 0,
                  //     "@change": (src) => {
                  //       form.setValuesIn("converFraUrl", src);
                  //     },
                  //   },
                  //   "x-decorator-props": {
                  //     gridSpan: 2,
                  //     tooltipLayout: "text",
                  //     tooltip: i18n.t("图片格式：JPG/PNG/JPEG; 大小不超过3MB"),
                  //   },
                  // },
                  status: {
                    title: i18n.t("是否上架"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("下架"),
                        value: 0,
                      },
                      {
                        label: i18n.t("上架"),
                        value: 1,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  appShow: {
                    title: i18n.t("是否在商城显示"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("隐藏"),
                        value: 0,
                      },
                      {
                        label: i18n.t("显示"),
                        value: 1,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  expireType: {
                    type: "string",
                    title: i18n.t("有效期计算方式"),
                    "x-decorator": "FormItem",
                    enum: expireTypeList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                    },
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  buyMultiple: {
                    title: i18n.t("该sku是否可以购买多个"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("是"),
                        value: 1,
                      },
                      {
                        label: i18n.t("否"),
                        value: 0,
                      },
                    ],
                    "x-component-props": {
                      "@change": (val) => {
                        if (val === 1) {
                          form.setValuesIn("upgradeSkuIdList", []);
                          form.setValuesIn("upgradeValidityType", 0);
                          form.setValuesIn("upgradeValidityTime", 0);
                        }
                      },
                    },
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    default: 0,
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                  },
                  upgradeSkuIdList: {
                    type: "string",
                    title: i18n.t("可升舱为的sku"),
                    "x-decorator": "FormItem",
                    "x-component": "RelatedSkuList",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      type: props.type,
                      skuId: props.skuId,
                      skuIDlist: props.skuDetail.upgradeSkuIdList,
                      "@change": (skuIDlist) => {
                        form.setValuesIn("upgradeSkuIdList", skuIDlist);
                      },
                    },
                    default: [],
                    "x-decorator-props": {
                      gridSpan: 2,
                    },
                    "x-reactions": {
                      dependencies: ["buyMultiple"],
                      when: "{{$deps[0]==1}}",
                      fulfill: {
                        state: {
                          disabled: true,
                        },
                      },
                      otherwise: {
                        state: {
                          disabled: false,
                        },
                      },
                    },
                  },
                  upgradeValidityTime: {
                    type: "string",
                    title: i18n.t("可升舱的时间窗口"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "InputNumber",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      min: 0,
                    },
                    default: 0,
                    "x-reactions": {
                      dependencies: ["buyMultiple"],
                      when: "{{$deps[0]==1}}",
                      fulfill: {
                        state: {
                          disabled: true,
                        },
                      },
                      otherwise: {
                        state: {
                          disabled: false,
                        },
                      },
                    },
                  },
                  upgradeValidityType: {
                    type: "string",
                    "x-decorator": "FormItem",
                    enum: validityTypeList(isEn),
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      style: "padding-top:41px",
                    },
                    default: 0,
                    "x-reactions": {
                      dependencies: ["buyMultiple"],
                      when: "{{$deps[0]==1}}",
                      fulfill: {
                        state: {
                          disabled: true,
                        },
                      },
                      otherwise: {
                        state: {
                          disabled: false,
                        },
                      },
                    },
                  },
                },
              },
              line2: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "el-divider",
                "x-decorator-props": {
                  gridSpan: 6,
                },
              },
              currencyTotalPriceList: {
                type: "string",
                "x-decorator": "FormItem",
                "x-component": "SkuDetailPriceList",
                "x-component-props": {
                  style: "color:#7580E5;cursor: pointer;",
                },
                "x-component-props": {
                  currencyList:
                    props.skuDetail.currencyTotalPriceList ||
                    props.currencyList,
                  fixedPriceList: props.spuInfo.costList || null,
                  type: props.type,
                  amount: form.getValuesIn("amount"),
                  supportSubscribe: props.skuDetail.supportSubscribe,
                  "@change": (list) => {
                    form.setValuesIn("currencyTotalPriceList", list);
                  },
                },
                "x-decorator-props": {
                  gridSpan: 6,
                },
              },
              promotionTag: {
                type: "string",
                title: i18n.t("促销标签"),
                "x-decorator": "FormItem",
                enum: promotionTagList(isEn),
                "x-component": "Select",
                "x-component-props": {
                  placeholder: i18n.t("请选择"),
                  "popper-append-to-body": false,
                },
                default: "",
                "x-decorator-props": {
                  gridSpan: 2,
                },
              },
            },
          },
        },
      };
};

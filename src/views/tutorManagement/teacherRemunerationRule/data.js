import i18n from "@/assets/locales/index";
import moment from "moment";
export const ruleStatus = [
    {
        label:i18n.t("生效中"),
        value:0
    },
    {
        label:i18n.t("待生效"),
        value:2
    },
    {
        label:i18n.t("已失效"),
        value:1
    }
]
export const ruleType = [
    {
        label:i18n.t("基本课酬"),
        value:1
    },
    {
        label:i18n.t("请假"),
        value:2
    },
    //TODO: 扣款
    // {
    //     label:i18n.t("扣款"),
    //     value:3
    // },
    {
        label:i18n.t("试听课转化奖励"),
        value:4
    },
    {
        label:i18n.t("全勤奖励"),
        value:5
    },
    {
        label:i18n.t("等级额外奖励"),
        value:6
    }
]
export const ruleColumns = (currencyList) => [
    {
        prop: "ruleName",
        label: i18n.t("规则名称"),
        render: (h, { row }) => {
            return <span class="text-wrap">{row.ruleName}</span>
        }
    },
    {
        prop: "ruleType",
        label: i18n.t("规则类型"),
        render: (h, { row }) => {
            return ruleType.find(item => item.value === row.ruleType)?.label;
        }
    },
    {
        prop: "salaryCurrency",
        label: i18n.t("币种"),
        render: (h, { row }) => {
            const currency = currencyList?.find(item => item.id === row.salaryCurrency);
            return (currency?.currencyZh + '(' + currency?.currency + ')') || row.salaryCurrency;
        }
    },
    {
        prop: "ruleStatus",
        label: i18n.t("状态"),
        render: (h, {row}) => {
            const status = [
                i18n.t("生效中"),
                i18n.t("已失效"),
                i18n.t("待生效")
            ]
            return status[row.ruleStatus];
        }
    },
    {
        prop: "effectiveTime",
        label: i18n.t("生效时间"),
        render: (h, { row }) => {
            return moment(row.effectiveTime).format("YYYY-MM-DD HH:mm:ss");
        }
    },
    {
        prop: "expireTime",
        label: i18n.t("失效时间"),
        render: (h, { row }) => {
            return moment(row.expireTime).format("YYYY-MM-DD HH:mm:ss");
        }
    },
    {
        prop: "createUserName",
        label: i18n.t("创建人"),
    },
    {
        prop: "createTime",
        label: i18n.t("创建时间"),
        render: (h, { row }) => {
            return moment(row.createTime).format("YYYY-MM-DD HH:mm:ss");
        }
    }
]
export const courseRuleDetailColumns = (openRuleDetailDialog) => [
    {
        prop: "packageName",
        label: i18n.t("课包"),
    },
    {
        prop: "packageTreeCount",
        label: i18n.t("课程树"),
        render: (h, { row }) => {
            return <el-popover placement="top" trigger="hover" width="150">
                <div style="max-height: 200px; overflow-y: auto;">
                    {row.packageTreeNameList.map(item => (
                        <span style="display: block;" key={item}>{item}</span>
                    ))}
                </div>
                <span slot="reference">{row.packageTreeCount + '个'}</span>
            </el-popover>
        }
    },
    {
        prop: "ruleName",
        label: i18n.t("关联规则"),
        render: (h, { row }) => {
            return <span style="color: #409EFF; cursor: pointer;" onClick={() => {
                openRuleDetailDialog(row);
            }}>{row.ruleName}</span>
        }   
    },  
    {
        prop: "ruleStatus",
        label: i18n.t("状态"),
        render: (h, { row }) => {
            return ruleStatus.find(item => item.value === row.ruleStatus)?.label;
        }
    },
    {
        prop: "createRealName",
        label: i18n.t("创建人"),
    },
    {
        prop: "correlationTime",
        label: i18n.t("关联时间"),
        render: (h, { row }) => {
            return moment(row.correlationTime).format("YYYY-MM-DD HH:mm:ss");
        }
    }
]
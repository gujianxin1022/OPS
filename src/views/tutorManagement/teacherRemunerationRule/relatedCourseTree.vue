<template>
    <el-dialog :visible="visible" :title="$t('关联课包')" width="500px" @close="handleCancel">
        <section class="tree-container">
            <el-tree
                :load="loadNode"
                :props="defaultProps"
                ref="treeRef"
                :node-key="nodeKey"
                lazy
                show-checkbox
                :default-expanded-keys="expandedKeys"
                :default-checked-keys="defaultCheckedKeys"
            >
            </el-tree>
        </section>
        <template #footer>
            <el-button @click="handleCancel">{{ $t("取消") }}</el-button>
            <el-button type="primary" @click="handleConfirm" :disabled="activeType === 1">{{ $t("确定") }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
import { computed, reactive, ref, onMounted , watch, nextTick} from "@vue/composition-api";
export default {
    name: "relatedCourseTree",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        rulesData: {
            type: Object,
            default: () => ({}),
        },
        subjectType: {
            type: String,
            default: ""
        },
        salaryLabel: {
            type: String,
            default: ""
        },
        activeType: {
            type: Number,
            default: 0
        },
        ruleId: {
            type: String,
        },
        ruleInfo: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props, { root, emit}) {
        const nodeKey = ref('id');
        let expandedKeys = ref([]);
        let defaultCheckedKeys = ref([]);
        const defaultProps = {
            id: "id",
            children: "children",
            label: "label",
            packageId: "packageId",
            packageTreeId: "packageTreeId",
            parentId: "parentId",
            courseRootId: "courseRootId",
            typeCode: "typeCode",
            isLeaf: "isLeaf",
            disabled: "disabled"
        };
        const treeRef = ref(null);
        const formatCheckedNodes = async() => {
            let count = 0;
            const checkedNodes = treeRef.value.getCheckedNodes(false,true);
            const packageMap = new Map();
            checkedNodes.forEach(node => {
                if(node.isLeaf){
                    if(!packageMap.has(node.parentId)){
                        packageMap.set(node.parentId, {
                            packageId: node.parentId,
                            nodes: [],
                        });
                    }
                    packageMap.get(node.parentId).nodes.push({
                        packageTreeId: node.packageTreeId,
                        courseRootId: node.courseRootId,
                    });
                    ++count;
                }else{
                    if(!packageMap.has(node.packageId)){
                        packageMap.set(node.packageId, {
                            packageId: node.packageId,
                            packageType: node.typeCode,
                            nodes: [],
                        });
                    }else{
                        packageMap.get(node.packageId).packageType = node.typeCode;
                    }
                }
            });
            const promiseList = [];
            packageMap.forEach(async item => {
                if(item.nodes.length === 0){
                    const promise = getChildrenData(item.packageId).then(res => {
                        count += res.length;
                        item.nodes = res.map(item => {
                            return {
                                packageTreeId: item.packageTreeId,
                                courseRootId: item.courseRootId,
                            }   
                        });
                    });
                    promiseList.push(promise);
                }
            });
            await Promise.all(promiseList); 
            console.log("count111",count);
            return [count,Array.from(packageMap.values())];
        };
        const handleCancel = () => {
            emit("cancel");
        };
        const handleConfirm = async() => {
            const checkedNodes = await formatCheckedNodes();
            console.log("checkedNodes",checkedNodes);
            emit("confirm",checkedNodes);
        };
        const currentLang = computed(() => root.$store.getters.currentLang);
        const loadNode = async(node, resolve) => {
            if (node.level === 0) {
                const rootData = await getRootData();
                resolve(rootData);
            } else {
                const childrenData = await getChildrenData(node.data.packageId);
                resolve(childrenData);
            }
        };
        const getRootData =  async()=>{
            let rootData = [];
            const res = await root.$Api.tutorManagement.getAllPackageList({
                subjectType: props.subjectType,
                salaryLabel: Number(props.salaryLabel),
                ruleType: props.ruleInfo.ruleType,
                effectiveTime: props.ruleInfo.effectiveTime,
                expireTime: props.ruleInfo.expireTime,
            });
            rootData = res.map(item=>{
                return {
                    id: item.packageId,
                    label: item.coursePackageNameList[currentLang.value === "en" ? 1 : 0].name,
                    packageId: item.packageId,
                    typeCode: item.typeCode,
                    disabled: props.ruleId && (props.activeType === 1 || item.isEnable === 0),
                    isLeaf: false
                }
            });
            return rootData;
        }
        const getChildrenData = async(packageId)=>{
            let childrenData = [];
            const res = await root.$Api.tutorManagement.getTreeList({
                subjectType: props.subjectType,
                salaryLabel: Number(props.salaryLabel),
                packageId: packageId,
                ruleType: props.ruleInfo.ruleType,
                effectiveTime: props.ruleInfo.effectiveTime,
                expireTime: props.ruleInfo.expireTime,
            });
            childrenData = res.map(item=>{
                return {
                    id: packageId + "_" + item.packageTreeId,
                    label: currentLang.value === "en" ? item.editionNameOpsEn : item.editionNameOpsZh,
                    packageTreeId: item.packageTreeId,
                    parentId: packageId,
                    courseRootId: item.courseRootId,
                    disabled: props.ruleId && (props.activeType === 1 || item.isEnable === 0),
                    isLeaf: true
                }
            });
            console.log("childrenData",childrenData);
            return childrenData;
        }
        const setChecked = async (packageInfoList) => {
            if(!packageInfoList || packageInfoList.length === 0){
                return;
            }
            expandedKeys.value = [];
            defaultCheckedKeys.value = [];
            for(const item of packageInfoList){
                expandedKeys.value.push(item.packageId);
                item.nodes.forEach(element => {
                    defaultCheckedKeys.value.push(item.packageId + "_" + element.packageTreeId);
                });
            }
        }
        const getBindPackageByRule = async(ruleId) => {
            const res = await root.$Api.tutorManagement.getBindPackageByRule({ruleId});
            setChecked(res?.packageInfoList);
        }
        watch(() => props.ruleId,(newVal) => {
            if(newVal){
                getBindPackageByRule(newVal);
            }
        },{immediate: true});
        onMounted(() => {
            
        });
        return {
            nodeKey,
            defaultProps,
            loadNode,
            handleCancel,
            handleConfirm,
            treeRef,
            expandedKeys,
            defaultCheckedKeys,
        };
    },
};
</script>

<style lang="scss" scoped>
.tree-container {
    border: 1px solid #E5E5E5;
    border-radius: 4px;
    padding: 10px;
    height: 500px;
    overflow-y:scroll
}
</style>
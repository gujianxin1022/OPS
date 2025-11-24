<script>
import { computed, onMounted, unref, ref } from "@vue/composition-api";
import ClassTimeExpires from "./components/ClassTimeExpires";
import ClassHourFlow from "./components/ClassHourFlow";
import ClassHourDistribution from "./components/ClassHourDistribution";
import RemainingClassHoursDetails from "./components/RemainingClassHoursDetails";
import HandlePermission from "@/utils/handlePermission";
const { handleButtonPer } = HandlePermission;
export default {
  name: "detail",
  components: {
    ClassHourFlow,
    ClassHourDistribution,
    RemainingClassHoursDetails,
    ClassTimeExpires,
  },
  props: {
    parentId: {
      type: String,
      default: void 0,
    },
    parentUserName: {
      type: String,
      default: void 0,
    },
  },
  setup(props, { root }) {
    const isZh = computed(() => root.$store.state.app.currentLang === "zh");
    const refreshKey = ref(0);
    const productList = ref([]);
    const loading = ref(false);
    const activeProductTab = ref();
    const activeClassHourTab = ref("classHourDistribution");
    const getParentProductList = async () => {
      loading.value = true;
      const {
        status,
        data: { code, data },
      } = await root.$Api.studentManagement.getParentProductList(
        props.parentId
      );
      loading.value = false;
      if (status !== 200 || code !== 200) return Promise.reject();
      loading.value = false;
      data?.forEach(
        (item) => (item.coursePackageId = String(item.coursePackageId))
      );
      productList.value = data ?? [];
      if (unref(activeProductTab) !== void 0) return;
      if (data?.length) activeProductTab.value = data[0].coursePackageId;
    };

    const onPackageTabClick = (val) => {
      activeProductTab.value = val.name;
      activeClassHourTab.value = "classHourDistribution";
    };

    const onClassHourTabClick = (val) => {
      activeClassHourTab.value = val.name;
    };
    onMounted(getParentProductList);

    return () => {
      return (
        <div>
          <el-tabs
            v-loading={unref(loading)}
            value={unref(activeProductTab)}
            on={{ "tab-click": (val) => onPackageTabClick(val) }}
          >
            {unref(productList).map((productItem) => (
              <el-tab-pane
                key={productItem.coursePackageId}
                name={productItem.coursePackageId}
                label={`${
                  productItem[
                    unref(isZh) ? "coursePackageName" : "coursePackageNameEn"
                  ]
                } (${productItem.totalRemainingAmount}${root.$t("课时")})`}
              >
                {productItem.coursePackageId === unref(activeProductTab) && (
                  <div class="package-item" key={unref(refreshKey)}>
                    <el-tabs
                      value={unref(activeClassHourTab)}
                      on={{ "tab-click": (val) => onClassHourTabClick(val) }}
                    >
                      <el-tab-pane
                        key="classHourDistribution"
                        name="classHourDistribution"
                        label={root.$t("课时分布")}
                      >
                        {activeClassHourTab.value !==
                        "classHourDistribution" ? (
                          ""
                        ) : (
                          <ClassHourDistribution
                            coursePackageId={unref(activeProductTab)}
                            parentUserId={props.parentId}
                            parentUserName={props.parentUserName}
                            on={{ refresh: () => (refreshKey.value += 1) }}
                          />
                        )}
                      </el-tab-pane>
                      <el-tab-pane
                        key="remainingClassHoursDetails"
                        name="remainingClassHoursDetails"
                        label={root.$t("剩余课时明细")}
                      >
                        {activeClassHourTab.value !==
                        "remainingClassHoursDetails" ? (
                          ""
                        ) : (
                          <RemainingClassHoursDetails
                            coursePackageId={unref(activeProductTab)}
                            parentUserId={props.parentId}
                          />
                        )}
                      </el-tab-pane>
                      <el-tab-pane
                        key="classHourFlow"
                        name="classHourFlow"
                        label={root.$t("课时流水")}
                      >
                        {activeClassHourTab.value !== "classHourFlow" ? (
                          ""
                        ) : (
                          <ClassHourFlow
                            coursePackageId={unref(activeProductTab)}
                            parentUserId={props.parentId}
                          />
                        )}
                      </el-tab-pane>
                      <el-tab-pane
                        key="classTimeExpires"
                        name="classTimeExpires"
                        label={root.$t("失效课时")}
                      >
                        {activeClassHourTab.value !== "classTimeExpires" ? (
                          ""
                        ) : (
                          <ClassTimeExpires
                            coursePackageId={unref(activeProductTab)}
                            parentUserId={props.parentId}
                          />
                        )}
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                )}
              </el-tab-pane>
            ))}
          </el-tabs>
        </div>
      );
    };
  },
};
</script>

<style lang="scss" scoped>
.package-item {
  margin-top: 10px;
  ::v-deep .el-tabs__active-bar {
    width: 0px !important;
  }
}
</style>

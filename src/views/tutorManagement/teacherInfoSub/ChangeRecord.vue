<template>
  <div class="examine-time-line-wrap">
    <div class="block" v-if="timeLineData.length !== 0">
      <el-timeline>
        <el-timeline-item
          v-for="item in timeLineData"
          :key="item.id"
          :timestamp="DateTimeUtils.dateClockTime(item.createTime)"
          :color="Filters.timeLineColor(item.type)"
          placement="top"
        >
          <el-card>
            <h3>{{ item.type | tutorSysLogsType }}</h3>
            <p>
              <span class="label">{{ $t("修改人") }}：</span>
              <span class="value">{{
                item.infop ? item.infop.userName : ""
              }}</span>
            </p>
            <p>
              <span class="label">{{ $t("修改内容") }}：</span>
              <template>
                <div v-if="item.type === 12 && item.infop" class="value mt10">
                  <div>
                    <span>{{ $t("时间范围") }}：</span>
                    <span
                      >{{
                        DateTimeUtils.dateClockTime(
                          JSON.parse(item.infop.updateContent).startTime
                        )
                      }}~{{
                        DateTimeUtils.dateClockTime(
                          JSON.parse(item.infop.updateContent).endTime
                        )
                      }}</span
                    >
                  </div>

                  <div style="margin-left: 72px; line-height: 30px">
                    <div
                      v-if="
                        JSON.parse(item.infop.updateContent).slotTimeMon.length
                      "
                    >
                      {{ $t("周一") }}：{{
                        JSON.parse(item.infop.updateContent).slotTimeMon.join(
                          "；"
                        )
                      }}
                    </div>
                    <div
                      v-if="
                        JSON.parse(item.infop.updateContent).slotTimeTue.length
                      "
                    >
                      {{ $t("周二") }}：{{
                        JSON.parse(item.infop.updateContent).slotTimeTue.join(
                          "；"
                        )
                      }}
                    </div>
                    <div
                      v-if="
                        JSON.parse(item.infop.updateContent).slotTimeWed.length
                      "
                    >
                      {{ $t("周三") }}：{{
                        JSON.parse(item.infop.updateContent).slotTimeWed.join(
                          "；"
                        )
                      }}
                    </div>
                    <div
                      v-if="
                        JSON.parse(item.infop.updateContent).slotTimeThu.length
                      "
                    >
                      {{ $t("周四") }}：{{
                        JSON.parse(item.infop.updateContent).slotTimeThu.join(
                          "；"
                        )
                      }}
                    </div>
                    <div
                      v-if="
                        JSON.parse(item.infop.updateContent).slotTimeFri.length
                      "
                    >
                      {{ $t("周五") }}：{{
                        JSON.parse(item.infop.updateContent).slotTimeFri.join(
                          "；"
                        )
                      }}
                    </div>
                    <div
                      v-if="
                        JSON.parse(item.infop.updateContent).slotTimeSat.length
                      "
                    >
                      {{ $t("周六") }}：{{
                        JSON.parse(item.infop.updateContent).slotTimeSat.join(
                          "；"
                        )
                      }}
                    </div>
                    <div
                      v-if="
                        JSON.parse(item.infop.updateContent).slotTimeSun.length
                      "
                    >
                      {{ $t("周日") }}：{{
                        JSON.parse(item.infop.updateContent).slotTimeSun.join(
                          "；"
                        )
                      }}
                    </div>
                  </div>
                  <div>
                    <span>{{ $t("Slot类型") }}：</span>
                    <span>{{
                      $t(
                        slotsTypeMap[
                          JSON.parse(item.infop.updateContent).slotType
                        ]
                      )
                    }}</span>
                  </div>
                </div>
                <span v-else class="value">{{
                  item.infop ? item.infop.updateContent : ""
                }}</span>
              </template>
            </p>
            <p>
              <span class="label">{{ $t("修改理由") }}：</span>
              <span class="value">{{
                item.infop ? item.infop.reason : ""
              }}</span>
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div v-else class="no-data">{{ $t("暂无记录") }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      timeLineData: [],
      slotsTypeMap: {
        1: "仅试听",
        2: "仅正式",
        3: "全部可教（试听/正式）",
      },
    };
  },
  methods: {
    getData() {
      this.$Api.tutorManagement
        .getTutorSysLogsList({ tutorUserId: this.$route.query.id })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.timeLineData = data.data;
            this.timeLineData.forEach(
              (item) => (item.infop = JSON.parse(item.info))
            );
          }
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
<style lang="scss" scoped>
.examine-time-line-wrap {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .block {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .no-data {
    width: 100%;
    text-align: center;
    color: #cccccc;
    box-sizing: border-box;
    padding-top: 30px;
  }
}
.quality-check-card {
  .el-card__body {
    display: grip;
    grid-template-columns: 100px 1fr;
    grid-template-rows: 1fr;
    gap: 10px;
  }
}
</style>

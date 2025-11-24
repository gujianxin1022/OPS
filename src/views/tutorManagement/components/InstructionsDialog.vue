<template>
  <div class="my-slot-settings">
    <div class="text-wrap" style="height: 80vh;overflow-y: scroll;" v-html="currentLang === 'en' ? renderEn : renderZh" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["currentLang"]),
    renderZh() {
      return `
        <el-card class="section">
          <h2 class="title">1. Slots 类型说明</h2>
          <h3><i class="el-icon-setting"></i>（1）设置 Slots 类型</h3>
          <p>您可为指定老师的每个时间段设置教学类型：</p>
          <ul>
            <li><strong>仅试听：</strong>仅可预约试听课</li>
            <li><strong>仅正式：</strong>仅可预约正式课</li>
            <li><strong>全部可教：</strong>Slots 的默认状态，用户可预约试听或正式课</li>
            <li>若将已设置为“仅试听”或“仅正式”的时间段改为“全部可教”，则系统将移除该时间段的自定义类型标记，恢复为默认状态。</li>
          </ul>

          <h3><i class="el-icon-view"></i>（2）查看 Slots 类型</h3>
          <ul>
            <li>页面按“周”维度展示已设置为“仅试听”或“仅正式”的时间段，未展示的时间段,默认视为“全部可教”</li>
            <li>您可以在“教师页面-教师课表”查看单一老师全部Slots设置情况。</li>
          </ul>

          <h3><i class="el-icon-document"></i>（3）查看操作日志</h3>
          <ul>
            <li>批量设置后可以在本页面“设置记录”处查看“单一设置”和“批量设置”记录。</li>
            <li>教师页面-修改记录也可以从教师维度查看所有修改记录</li>
          </ul>
        </el-card>

        <el-card class="section">
          <h2 class="title">2. 时间显示规则</h2>
          <p>页面显示为每半小时的开始时间，例如：</p>
          <ul>
            <li>“19:00” 表示 19:00 ~ 19:30</li>
            <li>“19:00 ~ 20:00” 表示以下时间段的合集: 19:00 ~ 19:30、19:30 ~ 20:00、20:00 ~ 20:30</li>
          </ul>
        </el-card>

        <el-card class="section">
          <h2 class="title">3. 约课白名单规则</h2>
          <ul>
            <li>每位老师有独立的家长白名单</li>
            <li>白名单中的家长在预约该老师课程时，将跳过以下限制校验：
              <ul>
                <li>Slots 类型（试听/正式）</li>
                <li>老师的可教状态</li>
              </ul>
            </li>
          </ul>
          <ul>
            <li>例外：若老师设置为“全部不可教”，则所有家长均不可预约（白名单家长也不可约）。</li>
            <li>在教师课表可以查看老师的约课白名单家长</li>
            <li>在家长页面可以查看约课白名单教师</li>
          </ul>
        </el-card>

        <el-card class="section">
          <h2 class="title">4. 白名单添加规则</h2>
          <h3><i class="el-icon-upload2"></i>（1）系统自动添加</h3>
          <p>系统自动添加：当为老师设置“仅试听”时间段时，系统将自动将符合以下任一条件的家长加入该老师的白名单（仅对所设置的时段生效）：</p>
          <ul>
            <li><strong>中文学科：</strong>从操作时间开始，过去 90 天内，与该老师完成过 ≥1 节 1V1 正式课（含异常课）的家长</li>
            <li><strong>英文学科：</strong>从操作时间开始，过去 30 天内，与该老师完成过 ≥2 节 1V1 正式课（含异常课）的家长</li>
          </ul>

          <h3><i class="el-icon-edit-outline"></i>（2）手动添加</h3>
          <p>可在“教师页面-教师课表”设置老师的白名单家长list</p>
        </el-card>
        <el-card class="section">
          <h2 class="title">5. 约课校验</h2>
          <p>1V1约课/预占、求课、代课与小班课排课，均无法使用与课程类型不匹配的老师Slots（白名单家长除外）</p>
        </el-card>
      `;
    },
    renderEn() {
      return `
        <el-card class="section">
          <h2 class="title">1. Slot Type Settings</h2>
          <h3><i class="el-icon-setting"></i> (1) Setting Slot Types</h3>
          <p>You can assign a specific teaching type to each time slot for an individual teacher:</p>
          <ul>
            <li><strong>Trial only:</strong> Only trial classes can be booked in this time slot.</li>
            <li><strong>Formal only:</strong> Only formal classes can be booked.</li>
            <li><strong>All available(default):</strong> Both trial and formal classes can be booked.</li>
             <li>If a slot previously marked as Trial only or Formal only is changed to All available, the custom setting will be removed and the slot will revert to its default state.</li>
          </ul>

          <h3><i class="el-icon-view"></i> (2) Viewing Slot Types</h3>
          <ul>
            <li>The schedule view displays only the slots that are set to Trial only or Formal only, based on a weekly view.
Any time slot not shown is treated as “All available” by default.</li>
            <li>You can view a teacher’s full slot setup under Teacher Page > Schedule.</li>
          </ul>

          <h3><i class="el-icon-document"></i> (3) Operation Logs</h3>
          <ul>
            <li>After making bulk changes, you can review both single and bulk update records in the Setting Records section.</li>
            <li>You can also check a teacher’s complete modification history under Teacher Page > Edit Logs.</li>
          </ul>
        </el-card>

        <el-card class="section">
          <h2 class="title">2. Time Display Format</h2>
          <p>Time on the schedule is shown based on 30-minute increments. For example:</p>
          <ul>
            <li>“19:00” = 19:00 to 19:30</li>
            <li>“19:00 ~ 20:00” includes: 19:00–19:30, 19:30–20:00, 20:00–20:30</li>
          </ul>
        </el-card>

        <el-card class="section">
          <h2 class="title">3. Booking allowlist Rules</h2>
          <ul>
            <li>Each teacher has their own parent allowlist.</li>
            <li>Parents on the allowlist can book the teacher’s available slots without restriction, meaning the system will skip validations for:
              <ul>
                <li>Slot type (Trial/Formal)</li>
                <li>Teacher’s teaching status</li>
              </ul>
            </li>
          </ul>
          <ul>
            Exception: If a teacher is set to Unavailable, no parent (including those on the allowlist) can book them.
            You can view:
            <li>allowlisted parents for a teacher under Teacher Page > Schedule</li>
            <li>allowlisted teachers for a parent under Parent Page</li>
          </ul>
        </el-card>

        <el-card class="section">
          <h2 class="title">4. allowlist Auto-Add Rules</h2>
          <h3><i class="el-icon-upload2"></i> (1) System Auto-Add</h3>
          <p>When a time slot is set to Trial only, the system will automatically add parents to that teacher’s allowlist for the selected time period, if they meet one of the following conditions:</p>
          <ul>
            <li><strong>Chinese Subject:</strong> The parent has completed at least 1 1-on-1 formal class (including exceptional sessions) with the teacher in the past 90 days</li>
            <li><strong>English Subject:</strong> The parent has completed at least 2 1-on-1 formal classes (including exceptional sessions) with the teacher in the past 30 days</li>
          </ul>

          <h3><i class="el-icon-edit-outline"></i> (2) Manual Management</h3>
          <p>You can also manually manage the allowlist for each teacher via Teacher Page > Schedule.</p>
        </el-card>

        <el-card class="section">
          <h2 class="title">5. Booking Validation</h2>
          <p>For 1-on-1 bookings, pre-booking, course requests, substitute teaching, and small group class scheduling, teacher slots that do not match the course type cannot be used — except for parents on the teacher’s allowlist.</p>
        </el-card>
      `;
    },
  },
};
</script>

<style lang="scss">
.my-slot-settings {
  .title {
    color: #7e8ae7;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 12px;
  }

  .sub-title {
    color: #7e8ae7;
    font-weight: 500;
    margin: 12px 0 4px;
  }

  ul li strong {
    color: #7e8ae7;
  }

  .el-icon-setting,
  .el-icon-view,
  .el-icon-document,
  .el-icon-upload2,
  .el-icon-edit-outline {
    color: #7e8ae7;
  }
}
</style>

import moment from "moment-timezone";
import axios from "axios";

export let timeZoneList = [];

let allTimeZoneList = [];
import { sortBy } from "lodash-es";

const reqTimeZoneList = async () => {
  await Promise.all([
    axios.get(
      "https://cdn.lingo-ace.com/publicFiles/source/TimeZone_Common.json"
    ),
    axios.get("https://cdn.lingo-ace.com/publicFiles/source/TimeZone.json"),
  ])
    .then((res) => {
      let commonList = res[0].data;
      res[1].data.forEach((e) => {
        e.labelValue = moment().tz(e.zoneId)._offset;
      });
      allTimeZoneList = sortBy(res[1].data, "labelValue");
      timeZoneList = [
        {
          label: "常用时区",
          options: commonList,
        },
        {
          label: "全部时区",
          options: allTimeZoneList,
        },
      ];
    })
    .catch((err) => {
      timeZoneList = [];
    });

  axios.get("https://cdn.lingo-ace.com/publicFiles/source/TimeZone.json");
};

reqTimeZoneList();

export const filterZoneName = (zoneId, isEn) => {
  let name = "";
  if (!zoneId) return;
  allTimeZoneList.some((e) => {
    if (e.zoneId === zoneId) {
      name = isEn ? e.en : e.zh;
    }
    return e.zoneId === zoneId;
  });
  return `(UTC${moment().tz(zoneId).format("Z")}) ${name}`;
};
export const toUserTimeZoneTime = (zoneId, utc) => {
  /* utc转用户当地时间 */
  return moment.tz(utc, zoneId).format("YYYY-MM-DD HH:mm");
};

export const toUserTimeZoneTime2 = (zoneId, utc) => {
  /* utc转用户当地时间 */
  return moment.tz(utc, zoneId).format("YYYY-MM-DD (dddd) HH:mm");
};

export const getTimeDifference = (userTimezone) => {
  let currentTimeAddress = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = moment.tz(currentTimeAddress);
  const userTime = moment.tz(userTimezone);
  const diff = currentTime.utcOffset() - userTime.utcOffset();
  return diff / 60;
};

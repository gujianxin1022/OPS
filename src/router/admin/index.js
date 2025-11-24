import classManagement from "./classManagement/";
import appealManagement from "./appealManagement/";
import studentManagement from "./studentManagement/";
import financeManagement from "./financeManagement/";
import tutorManagement from "./tutorManagement/";
import groupManagement from "./groupManagement";
import reportManagement from "./reportManagement";
import teacherManagement from "./teacherManagement";
import systemManagement from "./systemManagement";
import operateManagement from "./operateManagement";
import myWorkbench from "./myWorkbench";
import homepage from "./homepage";
import dataManagement from "./dataManagement";
import dealsManagement from "./dealsManagement";
import notificationManagement from "./notificationManagement";
import taskManagement from "./taskManagement";
import imManagement from "./im";
import tianmaoManagement from "./tianmaoManagement";
import ruleManagement from "./ruleManagement";

const routes = [].concat(
  classManagement,
  appealManagement,
  studentManagement,
  financeManagement,
  tutorManagement,
  groupManagement,
  reportManagement,
  teacherManagement,
  systemManagement,
  operateManagement,
  myWorkbench,
  homepage,
  dataManagement,
  dealsManagement,
  notificationManagement,
  taskManagement,
  imManagement,
  tianmaoManagement,
  ruleManagement
);

export default routes;

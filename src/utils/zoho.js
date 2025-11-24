let isInit = false;
let initEmail = "";
let initUserName = "";
const defaultEmail = "CN-CS-team@pplingo.com";
const defaultUserName = "Visitor";
const pathArr = ["/login"];

const isPage = (path, type) => {
  if (type === 1) return pathArr.includes(path);
  if (type === 2) return pathArr.includes(path) || isPageHash();
  return false;
};
const isPageHash = () => {
  const hash = window.location.hash;
  let res = false;
  pathArr.forEach((item) => {
    if (hash.includes(item)) res = true;
  });

  return res;
};
const handleShow = (path, type) => {
  if (!window.$zoho) return;

  if (isPage(path, type)) {
    $zoho.salesiq?.floatbutton?.visible("hide");
    $zoho.salesiq?.floatwindow?.visible("hide");
  } else {
    $zoho.salesiq?.floatbutton?.visible("show");
  }
};

const init = (path) => {
  JSON.parse(localStorage.userInfo);
  let info = JSON.parse(localStorage.userInfo) || {};
  let email = info.email || defaultEmail;
  let userName = info.username || defaultUserName;
  handleShow(path, 1);
  // 非登录页 && 已初始化 && 当前账户与初始化账户不一致
  if (
    !isPage(path, 1) &&
    isInit &&
    (userName !== initUserName || email !== initEmail)
  ) {
    if (!$zoho.salesiq.visitor) return;
    $zoho.salesiq.visitor.name(userName);
    $zoho.salesiq.visitor.email(email);
    initEmail = email;
  }

  // 登录页 || 已执行
  if (isPage(path, 1) || isInit) return;

  isInit = true;

  window.$zoho = window.$zoho || {};
  $zoho.salesiq = $zoho.salesiq || {
    widgetcode:
      "d35bfc4ef37a4a9b1b5facbd18f8939f8a559d3e4e5c0fe8aedfa1209ef81edc",
    values: {},
    ready: function () {},
  };
  var d = document;
  var s = d.createElement("script");
  s.type = "text/javascript";
  s.id = "zsiqscript";
  s.defer = true;
  s.src = "https://salesiq.zoho.com/widget";
  var t = d.getElementsByTagName("script")[0];
  t.parentNode.insertBefore(s, t);

  $zoho.salesiq.ready = function () {
    let num = 0;
    let initIframe = function () {
      handleShow(path, 2);
      $zoho.salesiq.visitor.name(userName);
      initUserName = userName;
      if (document.getElementById("siqiframe")) {
        let iframeDOM = document.getElementById("siqiframe").contentDocument;
        let hideEmail = function (params) {
          let _dom = iframeDOM.getElementById("visemail");
          if (_dom) {
            iframeDOM.getElementById("visemail").style.display = "none";
            $zoho.salesiq.visitor.email(email);
            initEmail = email;
          }
        };
        iframeDOM.addEventListener("DOMNodeInserted", function (e) {
          hideEmail();
          handleShow(path, 2);
        });
        iframeDOM.addEventListener("DOMNodeRemoved", function (e) {
          hideEmail();
          handleShow(path, 2);
        });
      } else {
        setTimeout(() => {
          if (num < 100) {
            num++;
            initIframe();
          }
        }, 500);
      }
    };
    initIframe();
  };
};

export default {
  init,
};

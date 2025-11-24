import Vue from "vue";

Vue.directive("insert-params-input", {
  bind(el, binding, vnode, oldvnode) {
    try {
      const element =
        el.getElementsByTagName("textarea")[0] ||
        el.getElementsByTagName("input")[0];
      element?.addEventListener("input", function (e) {
        const val = e.target.value;
        if (val.includes("#")) {
          const elTop = element.getBoundingClientRect().top;
          const elLeft = element.getBoundingClientRect().left;
          const fixedDom =
            binding.arg === "url"
              ? document.getElementById("insert-url-params-container")
              : document.getElementById("insert-params-container");
          if (!fixedDom) {
            return;
          }
          fixedDom.style.display = "block";
          fixedDom.style.position = "fixed";
          fixedDom.style.top = elTop + 20 + "px";
          fixedDom.style.left = elLeft + 20 + "px";
          fixedDom.style.zIndex = 999;
          fixedDom.onclick = function (_e) {
            _e = _e || window.event;
            const inserTarget = _e.target || _e.srcElement;
            if (inserTarget.tagName.toLowerCase() === "li") {
              let val = e.target.value;
              val = val.replaceAll("#", "${" + inserTarget.innerText + "}");
              e.target.value = val;
              fixedDom.style.display = "none";
              element.dispatchEvent(new CustomEvent("change"));
            }
          };
          element?.addEventListener("keydown", function (e) {
            if (e.keyCode === 8) {
              fixedDom.style.display = "none";
            }
          });
          document.addEventListener("scroll", () => {
            const elTop = element.getBoundingClientRect().top;
            fixedDom.style.top = elTop + 20 + "px";
          });
          document.addEventListener("click", () => {
            fixedDom.style.display = "none";
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
});

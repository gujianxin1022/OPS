export const formatterCountryList = function (countryList) {
  const list = {
    常用: [
      {
        code: "SG",
        nameZh: "新加坡",
        nameEn: "Singapore",
        tel: "+65",
        pyName: "xjp",
      },
      {
        code: "US",
        nameZh: "美国",
        nameEn: "UnitedStatesofAmerica",
        tel: "+1",
        pyName: "mg",
      },
      {
        code: "CA",
        nameZh: "加拿大",
        nameEn: "Canada",
        tel: "+1",
        pyName: "jnd",
      },
      {
        code: "AU",
        nameZh: "澳大利亚",
        nameEn: "Australia",
        tel: "+61",
        pyName: "adly",
      },
      {
        code: "ID",
        nameZh: "印度尼西亚",
        nameEn: "Indonesia",
        tel: "+62",
        pyName: "ydnxy",
      },
      {
        code: "MY",
        nameZh: "马来西亚",
        nameEn: "Malaysia",
        tel: "+60",
        pyName: "mlxy",
      },
      {
        code: "JP",
        nameZh: "日本",
        nameEn: "Japan",
        tel: "+81",
        pyName: "rb",
      },
      {
        code: "KR",
        nameZh: "韩国",
        nameEn: "Korea",
        tel: "+82",
        pyName: "hg",
      },
    ],
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    G: [],
    H: [],
    I: [],
    J: [],
    K: [],
    L: [],
    M: [],
    N: [],
    O: [],
    P: [],
    Q: [],
    R: [],
    S: [],
    T: [],
    U: [],
    V: [],
    W: [],
    X: [],
    Y: [],
    Z: [],
  };
  countryList.map((item) => {
    const key = item.pyName[0].toLocaleUpperCase();
    list[key].push(item);
  });
  const _list = {};
  for (let key in list) {
    if (list[key].length) {
      _list[key] = list[key];
    }
  }
  return _list;
};

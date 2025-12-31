import { string } from "node_modules/fabric/dist/src/util";
import { Button } from "antd";
import { debug } from "console";

const Screenshot = () => {
  const handleOutOf = () => {
    //fisher yates:从数组的末尾开始，逐个向前随机选择一个元素并与当前位置的元素交换。
    const ary = [4, 5, 7, 2, 3, 23, 45];
    const myarray = [...ary];
    for (let i = myarray.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [myarray[i], myarray[j]] = [myarray[j], myarray[i]];
    }
    console.log(myarray, "乱序");
  };
  const handleUrl = () => {
    //1.?号后面的参数 2.拼接到一块，3.返回一个对象
    const url = "https://map.baidu.com?formId=1077&flag&hello%3D%E4%B8%96%E7%95%8C%26test%3Daa";
    const paramsArray = url.split("?")[1] || "";
    const newParams = decodeURIComponent(paramsArray);
    const newArray = newParams.split("&");
    const obj: { [key: string]: [value: string] } = {};
    const makeParams = () => {
      newArray.map((item) => {
        if (item.includes("=")) {
          const [key, value] = item.split("=");
          if (key) {
            obj[key] = value || "";
          }
        } else {
          obj[item] = true;
        }
      });
      return obj;
    };
    console.log(makeParams(), "最新");
  };
  const handleDeepClone = () => {
    //浅拷贝
    const testObj = {
      a: "a",
      b: {
        c: "er",
        d: "ed",
        f: {
          m: "ww",
          g: "ss",
        },
      },
    };
    // const shallow1 = Object.assign({}, testObj)
    // shallow1.b.f.m = '更新'
    // shallow1.a = 'z'
    const shallow2 = { ...testObj };
    shallow2.b.f.m = "更新";
    shallow2.a = "z";
    console.log(testObj.a, shallow2.a, testObj.b.f.m, shallow2.b.f.m, "对比");
    const deep1 = JSON.parse(JSON.stringify(testObj));
    deep1.b.f.m = "深度更新";
    console.log(testObj.b.f.m, deep1.b.f.m, "深度对比");
  };

  const handleArray = () => {};
  const handleJson = () => {};

  return (
    <div style={{ padding: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <Button onClick={handleArray}>实现类数组转数组</Button>
      <Button onClick={handleJson}>实现 DOM转JSON</Button>
      <Button onClick={handleArray}>实现 JSON转DOM</Button>
      <Button onClick={handleArray}>实现 树转数组</Button>
      <Button onClick={handleArray}>实现 数组转树</Button>
      <Button onClick={handleArray}>实现 数组打平</Button>
      <Button onClick={handleArray}>实现 对象打平</Button>
      <Button onClick={handleArray}>函数的节流和防抖</Button>
      <Button onClick={handleArray}>柯里化函数</Button>
      <Button onClick={handleArray}>链式处理</Button>
      <Button onClick={handleDeepClone}>手写拷贝</Button>
      <Button onClick={handleUrl}>url解析</Button>
      <Button onClick={handleOutOf}>乱序输出</Button>
    </div>
  );
};
export default Screenshot;

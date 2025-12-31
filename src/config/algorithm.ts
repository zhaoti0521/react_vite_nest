import { TreeNode, TreeNode1 } from "./data";
export default class Algorithm {
  getname(a: number, b: number): number {
    return parseFloat((a + b).toFixed(1));
  }
  treeChangeName(tree: TreeNode[]): TreeNode1[] {
    let newArray = [];
    newArray = tree.map((item: TreeNode) => {
      return {
        title: item.label,
        name: item.name,
        child: item.child.length !== 0 ? this.treeChangeName(item.child) : [],
      };
    });
    return newArray;
  }
  changeStr(str: string): string {
    let newstr = "";
    // newstr = str.split("").reverse().join("");
    newstr = str.replace(/你好/g, " is true:");
    return newstr;
  }
  concatNumber(a: string, b: string, flag: boolean): string | bigint {
    let newnum = null;
    newnum = BigInt(a) + BigInt(b);
    return flag ? newnum.toString() : newnum;
  }

  deep<T>(obj: T): T {
    if (!obj || typeof obj !== "object") return obj;
    const newObj = (Array.isArray(obj) ? [] : {}) as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = typeof obj[key] === "object" ? this.deep(obj[key]) : obj[key];
      }
    }
    return newObj;
  }
  // thoree(fn, delay){
  //   let time = Date.now();
  //   return function(){
  //     let new = Date.now();
  //     let _this = this;
  //     let _args = arguments;
  //     if(new - time >= delay){
  //       new = Date.now();
  //       fn.apply(_this,_args);
  //     }
  //   }
  // }
  // debounce(fn: unknown, delay: number) {
  //   let timer: string | number | NodeJS.Timeout | null | undefined = null;
  //   return function () {
  //     const _this = this;
  //     const _args = arguments;
  //     if (timer) {
  //       clearTimeout(timer);
  //       timer = null;
  //     }
  //     timer = setTimeout(() => {
  //       fn.apply(_this, _args);
  //     }, delay);
  //   };
  // }
}

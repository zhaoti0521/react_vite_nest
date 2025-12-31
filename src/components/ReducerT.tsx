export const DemoUseReducer = () => {
  /* number为更新后的state值, dispatchNumbner 为当前的派发函数 */
  const [number, dispatchNumbner] = useReducer((state, action) => {
    const { payload, name } = action; /* return的值为新的state */
    switch (name) {
      case "a":
        return state + 1;
      case "b":
        return state - 1;
      case "c":
        return payload;
    }
    return state;
  }, 0);
  return (
    <div>
           当前值：{number}    {/* 派发更新 */}     
      <button onClick={() => dispatchNumbner({ name: "a" })}>增加</button>     
      <button onClick={() => dispatchNumbner({ name: "b" })}>减少</button>     
      <button onClick={() => dispatchNumbner({ name: "c", payload: 666 })}>赋值</button>   {" "}
      {/* 把dispatch 和 state 传递给⼦组件 */}
      <MyChildren dispatch={dispatchNumbner} State={{ number }} /> {" "}
    </div>
  );
};

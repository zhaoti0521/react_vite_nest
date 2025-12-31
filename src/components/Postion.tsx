import { useLayoutEffect, useRef, useState } from "react";

// 定义一个接口来描述坐标对象的类型
interface Position {
  x: number;
  y: number;
}

// 假设 animate 函数用于移动元素，添加类型注解
function animate(element: HTMLElement | null, position: Position): void {
  if (element) {
    element.style.transform = `translate(${position.x}px, ${position.y}px)`;
  }
}

// 假设 getPosition 函数用于获取目标位置，添加返回值类型注解
function getPosition(): Position {
  return {
    x: 100,
    y: 200,
  };
}

const DemoUseLayoutEffect: React.FC = () => {
  const [move, setMove] = useState(false);
  // 使用 useRef 时指定其类型为 HTMLElement
  const target = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    /*我们需要在 dom 绘制之前，移动 dom 到指定位置*/
    const position: Position = getPosition(); /* 获取要移动的 x,y 坐标 */
    animate(target.current, position);
  }, [move]);

  return (
    <div>
      <span ref={target} className="animate">
        移动元素
      </span>
      <button
        onClick={() => {
          setMove(true);
        }}
      >
        move
      </button>
    </div>
  );
};

export default DemoUseLayoutEffect;

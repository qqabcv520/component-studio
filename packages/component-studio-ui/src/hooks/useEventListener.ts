// 下面使我们编写的自定义 hook
import { RefObject, useEffect, useRef } from 'react';

export function useEventListener<K extends keyof HTMLElementEventMap>(
  elementRef: RefObject<HTMLElement | undefined | null>,
  eventName: K,
  listener: (ev: HTMLElementEventMap[K]) => any,
) {
  // 创建一个 ref 来存储处理程序
  const saveHandler = useRef(listener);

  // 如果 handler 变化了，就更新 ref.current 的值。
  // 这个让我们下面的 effect 永远获取到最新的 handler
  useEffect(() => {
    saveHandler.current = listener;
  }, [listener]);

  useEffect(
    () => {
      // 确保元素支持 addEventListener
      const isSupported = elementRef.current?.addEventListener;
      if (!isSupported) return () => {};

      // 创建事件监听调用存储在 ref 的处理方法
      const eventListener: (ev: HTMLElementEventMap[K]) => any = (event) =>
        saveHandler.current?.(event);

      // 添加事件监听
      elementRef.current?.addEventListener<K>(eventName, eventListener);

      // 清除的时候移除事件监听
      return () => {
        elementRef.current?.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, elementRef.current], // 如果 eventName 或 elementRef 变化，就再次运行
  );
  return elementRef;
}

import React, {
  ReactDOM,
  ReactNode,
  Ref,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './index.less';
import { useEventListener } from '@/hooks/useEventListener';

export interface EditingProps {
  target: ReactNode;
}

function useDraggable<T extends HTMLElement>() {
  const [moving, setMoving] = useState(false);
  const dragRef = useRef<T>(null);
  // useEffect(() => {
  //
  // }, []);

  function onMouseDown(e: MouseEvent) {
    console.log('onMouseDown', e);
  }
  function onMouseMove(e: MouseEvent) {
    console.log('onMouseMove', e);
  }
  function onMouseUp(e: MouseEvent) {
    console.log('onMouseUp', e);
  }
  useEventListener(dragRef, 'mousedown', onMouseDown);
  // useEventListener(dragRef, 'mousemove', onMouseMove);
  // useEventListener(dragRef, 'mouseup', onMouseUp);

  return dragRef;
}

export const Editing: React.FC<EditingProps> = (props) => {
  console.log('Editing');
  const dragRef = useDraggable<HTMLDivElement>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  return <div ref={wrapperRef}>{props.children}</div>;
};

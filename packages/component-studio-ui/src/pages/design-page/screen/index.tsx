import React, { createRef, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { EditingWidget } from '@/models/design';
import styles from './index.less';

export interface ScreenProps {
  editingWidgets: EditingWidget[];
  propMap: {
    [key: string]: unknown;
  };
}

function matchWidget(parents: Array<RefObject<Element | Text | null>>, target: HTMLElement | null) {
  let tempNode = target;
  const parentSet = new Set(parents.map((value) => value.current));
  while (tempNode != null && !parentSet.has(tempNode)) {
    tempNode = tempNode.parentElement;
  }
  return tempNode;
}

export const Screen: React.FC<ScreenProps> = ({ editingWidgets, propMap }) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [refSet, setRefSet] = useState<Array<RefObject<Element | Text | null>>>([]);
  const coverRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setTarget(e.target as HTMLElement);
  }, []);

  const wrapper = matchWidget(refSet, target);

  const { left = 0, top = 0, height = 0, width = 0 } = wrapper?.getBoundingClientRect() ?? {};
  const { left: screenLeft = 0, top: screenTop = 0 } =
    screenRef.current?.getBoundingClientRect() ?? {};
  const style = {
    left: `${left - screenLeft}px`,
    top: `${top - screenTop}px`,
    height: `${height}px`,
    width: `${width}px`,
  };

  useEffect(() => {
    const elementAndRef = editingWidgets.map((editingWidget) => {
      const ref = createRef<Element | Text | null>();
      const widgetProps = editingWidget.props.reduce((pre, curr) => {
        return {
          ...pre,
          [curr.propName]: propMap[curr.propKey],
        };
      }, Object.create(null));
      return {
        ref,
        element: (
          <editingWidget.widgetType key={editingWidget.id} wrapperRef={ref} {...widgetProps} />
        ),
      };
    });
    setElements(elementAndRef.map((value) => value.element));
    setRefSet(elementAndRef.map((value) => value.ref));
  }, [editingWidgets]);

  return (
    <div ref={screenRef} className={styles.screen} onMouseDown={onMouseDown}>
      <div>{elements}</div>
      <div ref={coverRef} className={styles.cover} style={style} />
    </div>
  );
};

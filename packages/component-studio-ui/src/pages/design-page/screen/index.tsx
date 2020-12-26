import React, { Component, createRef, useCallback, useMemo, useRef, useState } from 'react';
import { EditingWidget, EditingWidgetRef } from '@/models/design';
import styles from './index.less';

export interface ScreenProps {
  editingWidgets: EditingWidget[];
  onSelectWidget: (selectWidgetRef: EditingWidgetRef | null) => void;
  propMap: {
    [key: string]: unknown;
  };
}

function matchWidget(editingWidgetRefs: Array<EditingWidgetRef>, target: HTMLElement | null) {
  let tempNode = target;
  const nodeMap = editingWidgetRefs.reduce((previousValue, currentValue) => {
    previousValue.set(currentValue.wrapperRef.current, currentValue);
    return previousValue;
  }, new Map<Element | null, EditingWidgetRef>());
  while (tempNode != null && !nodeMap.has(tempNode)) {
    tempNode = tempNode.parentElement;
  }
  if (tempNode == null) {
    return null;
  }
  return nodeMap.get(tempNode) ?? null;
}

export const Screen: React.FC<ScreenProps> = ({ editingWidgets, propMap, onSelectWidget }) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const { editingWidgetRef, elements } = useMemo(() => {
    const elementAndRef = editingWidgets.map((editingWidget) => {
      const wrapperRef = createRef<Element | null>();
      const instanceRef = createRef<Component>();
      const widgetProps = editingWidget.props.reduce((pre, curr) => {
        return {
          ...pre,
          [curr.propName]: propMap[curr.propKey],
        };
      }, Object.create(null));
      return {
        wrapperRef,
        instanceRef,
        editingWidget,
        element: (
          <editingWidget.widgetType
            key={editingWidget.id}
            ref={instanceRef}
            wrapperRef={wrapperRef}
            {...widgetProps}
          />
        ),
      };
    });
    return {
      elements: elementAndRef.map((value) => value.element),
      editingWidgetRef: elementAndRef.map(({ element, ...otherProp }) => otherProp),
    };
  }, [editingWidgets]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const t = e.target as HTMLElement;
      setTarget(t);
      const targetWidget = matchWidget(editingWidgetRef, t);
      onSelectWidget(targetWidget);
    },
    [editingWidgetRef],
  );

  const targetWidget = matchWidget(editingWidgetRef, target);

  const { left = 0, top = 0, height = 0, width = 0 } =
    targetWidget?.wrapperRef.current?.getBoundingClientRect() ?? {};
  const { left: screenLeft = 0, top: screenTop = 0 } =
    screenRef.current?.getBoundingClientRect() ?? {};
  const style = {
    left: `${left - screenLeft}px`,
    top: `${top - screenTop}px`,
    height: `${height}px`,
    width: `${width}px`,
  };
  return (
    <div ref={screenRef} className={styles.screen} onMouseDown={onMouseDown}>
      <div>{elements}</div>
      <div ref={coverRef} className={styles.cover} style={style} />
    </div>
  );
};

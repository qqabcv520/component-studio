import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EditingWidget, SetEditingWidgetInstancePayload } from '@/models/design';
import { WidgetComponent } from 'component-studio-core';
import styles from './index.less';

export interface ScreenProps {
  editingWidgets: EditingWidget[];
  onSelectWidget: (selectWidgetId: string | null) => void;
  setEditingWidgetRef: (payload: SetEditingWidgetInstancePayload) => void;
  editingWidgetInstanceMap: { [id: string]: WidgetComponent };
  propMap: { [key: string]: unknown };
}

export const Screen: React.FC<ScreenProps> = ({
  editingWidgets,
  propMap,
  setEditingWidgetRef,
  editingWidgetInstanceMap,
  onSelectWidget,
}) => {
  const [target, setTarget] = useState<Element | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const elements = useEditingWidget(editingWidgets, propMap, setEditingWidgetRef);

  const { instance: selectedWidget = null, id = null } =
    useSelectedWidget(editingWidgetInstanceMap, target) || {};

  const { left = 0, top = 0, height = 0, width = 0 } =
    selectedWidget?.wrapperRef?.getBoundingClientRect() ?? {};
  const { left: screenLeft = 0, top: screenTop = 0 } =
    screenRef.current?.getBoundingClientRect() ?? {};
  const style = {
    left: `${left - screenLeft}px`,
    top: `${top - screenTop}px`,
    height: `${height}px`,
    width: `${width}px`,
  };

  useEffect(() => {
    // 可以拿到最新selectedWidget
    console.log(id);
    onSelectWidget(id);
  }, [selectedWidget]);

  const onMouseDown = useCallback((e: React.MouseEvent<Element, MouseEvent>) => {
    setTarget(e.target as Element);
  }, []);

  return (
    <div ref={screenRef} className={styles.screen} onMouseDown={onMouseDown}>
      <div>{elements}</div>
      <div ref={coverRef} className={styles.cover} style={style} />
    </div>
  );
};

function useEditingWidget(
  editingWidgets: EditingWidget[],
  propMap: { [key: string]: unknown },
  setEditingWidgetRef: (payload: SetEditingWidgetInstancePayload) => void,
): JSX.Element[] {
  return useMemo(() => {
    const instanceWidgets = editingWidgets.map((editingWidget) => {
      const localEditingWidget = editingWidget;
      const widgetProps = editingWidget.props.reduce((pre, curr) => {
        return {
          ...pre,
          [curr.propName]: propMap[curr.propKey],
        };
      }, Object.create(null));
      return {
        editingWidget: localEditingWidget,
        element: (
          <editingWidget.widgetType
            key={editingWidget.id}
            ref={(ref: WidgetComponent) => {
              setEditingWidgetRef({
                id: editingWidget.id,
                instance: ref,
              });
            }}
            {...widgetProps}
          />
        ),
      };
    });
    return instanceWidgets.map((value) => value.element);
  }, [editingWidgets, propMap]);
}

function useSelectedWidget(
  editingWidgetInstanceMap: { [id: string]: WidgetComponent },
  target: Element | null,
): { id: string; instance: WidgetComponent } | null {
  return useMemo(() => {
    const editingWidgetInstances = Object.entries(editingWidgetInstanceMap);
    let tempNode = target;
    const nodeMap = editingWidgetInstances.reduce((previousValue, currentValue) => {
      previousValue.set(currentValue[1].wrapperRef, {
        id: currentValue[0],
        instance: currentValue[1],
      });
      return previousValue;
    }, new Map<Element | null | undefined, { id: string; instance: WidgetComponent }>());
    while (tempNode != null && !nodeMap.has(tempNode)) {
      tempNode = tempNode.parentElement;
    }
    if (tempNode == null) {
      return null;
    }
    return nodeMap.get(tempNode) ?? null;
  }, [editingWidgetInstanceMap, target]);
}

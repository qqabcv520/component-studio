import React, { useCallback, useMemo, useRef } from 'react';
import { SetEditingWidgetInstancePayload } from '@/models/design';
import { WidgetComponent } from 'component-studio-core';
import { EditingWidgetTree } from '@/utils/type';
import styles from './index.less';

export interface ScreenProps {
  editingWidgetTree: EditingWidgetTree[];
  selectedWidgetId: string | null;
  onSelectWidget: (selectWidgetId: string | null) => void;
  setEditingWidgetRef: (payload: SetEditingWidgetInstancePayload) => void;
  editingWidgetInstanceMap: { [id: string]: WidgetComponent };
  propMap: { [key: string]: unknown };
}

export const Screen: React.FC<ScreenProps> = ({
  editingWidgetTree,
  selectedWidgetId,
  propMap,
  setEditingWidgetRef,
  editingWidgetInstanceMap,
  onSelectWidget,
}) => {
  // const [target, setTarget] = useState<Element | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const elements = useEditingWidget(editingWidgetTree, propMap, setEditingWidgetRef);

  const style = useMemo( () => {
    const selectedEditingWidgetInstance = selectedWidgetId ? editingWidgetInstanceMap[selectedWidgetId] : null;
    const { left = 0, top = 0, height = 0, width = 0 } =
    selectedEditingWidgetInstance?.wrapperRef?.getBoundingClientRect() ?? {};
    const { left: screenLeft = 0, top: screenTop = 0 } =
    screenRef.current?.getBoundingClientRect() ?? {};
    return {
      left: `${left - screenLeft}px`,
      top: `${top - screenTop}px`,
      height: `${height}px`,
      width: `${width}px`,
    };
    }, [selectedWidgetId, editingWidgetInstanceMap]
  );

  const onMouseDown = useCallback((e: React.MouseEvent<Element, MouseEvent>) => {
    const target = e.target as Element;
    const { id = null } = getSelectedWidget(editingWidgetInstanceMap, target) ?? {};
    onSelectWidget(id)
  }, [editingWidgetInstanceMap, onSelectWidget]);

  return (
    <div ref={screenRef} className={styles.screen} onMouseDown={onMouseDown}>
      <div>{elements}</div>
      <div ref={coverRef} className={styles.cover} style={style} />
    </div>
  );
};

function recursiveEditingWidgetTree(
  editingWidgetTree: EditingWidgetTree[],
  propMap: { [key: string]: unknown },
  setEditingWidgetRef: (payload: SetEditingWidgetInstancePayload) => void,
) {
  return editingWidgetTree.map((editingWidget) => {
    const widgetProps = editingWidget.props.reduce((pre, curr) => {
      return {
        ...pre,
        [curr.propName]: propMap[curr.propKey],
      };
    }, Object.create(null));
    return (
      <editingWidget.widgetType
        key={editingWidget.id}
        ref={(ref: WidgetComponent) => {
          setEditingWidgetRef({
            id: editingWidget.id,
            instance: ref,
          });
        }}
        {...widgetProps}
      >
        {recursiveEditingWidgetTree(editingWidget.children, propMap, setEditingWidgetRef)}
      </editingWidget.widgetType>
    );
  });
}

function useEditingWidget(
  editingWidgetTree: EditingWidgetTree[],
  propMap: { [key: string]: unknown },
  setEditingWidgetRef: (payload: SetEditingWidgetInstancePayload) => void,
): JSX.Element[] {
  return useMemo(() => {
    const a = recursiveEditingWidgetTree(editingWidgetTree, propMap, setEditingWidgetRef);
    return a;
  }, [editingWidgetTree, propMap]);
}

function getSelectedWidget(
  editingWidgetInstanceMap: { [id: string]: WidgetComponent },
  target: Element | null,
): { id: string; instance: WidgetComponent } | null {
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
}

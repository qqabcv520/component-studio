import React, {
  Component,
  createRef,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { EditingWidget } from '@/models/design';
import styles from './index.less';

export interface ScreenProps {
  editingWidgets: EditingWidget[];
  propMap: {
    [key: string]: unknown;
  };
  setEditingWidgetRef: (editingWidgetId: EditingWidget, instance: Component) => void;
}

function matchWidget(parents: Array<RefObject<Element | Text | null>>, target: HTMLElement | null) {
  let tempNode = target;
  const parentSet = new Set(parents.map((value) => value.current));
  while (tempNode != null && !parentSet.has(tempNode)) {
    tempNode = tempNode.parentElement;
  }
  return tempNode;
}

export const Screen: React.FC<ScreenProps> = ({ editingWidgets, propMap, setEditingWidgetRef }) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [wrapperRefSet, setWrapperRefSet] = useState<Array<RefObject<Element | Text | null>>>([]);
  const coverRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setTarget(e.target as HTMLElement);
  }, []);

  const wrapper = matchWidget(wrapperRefSet, target);

  const { left = 0, top = 0, height = 0, width = 0 } = wrapper?.getBoundingClientRect() ?? {};
  const { left: screenLeft = 0, top: screenTop = 0 } =
    screenRef.current?.getBoundingClientRect() ?? {};
  const style = {
    left: `${left - screenLeft}px`,
    top: `${top - screenTop}px`,
    height: `${height}px`,
    width: `${width}px`,
  };
  createRef();

  useEffect(() => {
    const elementAndRef = editingWidgets.map((editingWidget) => {
      const wrapperRef = createRef<Element | Text | null>();
      const widgetProps = editingWidget.props.reduce((pre, curr) => {
        return {
          ...pre,
          [curr.propName]: propMap[curr.propKey],
        };
      }, Object.create(null));
      return {
        wrapperRef,
        element: (
          <editingWidget.widgetType
            key={editingWidget.id}
            ref={(ref: Component) => setEditingWidgetRef(editingWidget, ref)}
            wrapperRef={wrapperRef}
            {...widgetProps}
          />
        ),
      };
    });
    setElements(elementAndRef.map((value) => value.element));
    setWrapperRefSet(elementAndRef.map((value) => value.wrapperRef));
  }, [editingWidgets]);

  return (
    <div ref={screenRef} className={styles.screen} onMouseDown={onMouseDown}>
      <div>{elements}</div>
      <div ref={coverRef} className={styles.cover} style={style} />
    </div>
  );
};

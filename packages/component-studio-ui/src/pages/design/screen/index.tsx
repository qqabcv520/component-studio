import React, {
  ComponentClass,
  createRef,
  FunctionComponent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './index.less';

export interface EditableProps {
  className?: string;
  target?: HTMLElement;
}

// export const Editable: React.FC<EditableProps> = props => {
//
//   console.log(props.target);
//   const { left, top, height, width } = props.target?.getBoundingClientRect() ?? {};
//
//   const style = {
//     left: left + 'px',
//     top: top + 'px',
//     height: height + 'px',
//     width: width + 'px',
//   }
//
//   return (
//     <div ref={ref} className={classnames(styles.cover)} style={style}>
//       {props.children}
//     </div>
//   );
// }

export interface ScreenProps {
  editingWidget: Array<
    | FunctionComponent<unknown & { wrapperRef?: MutableRefObject<Element | Text | null> }>
    | ComponentClass<unknown & { wrapperRef?: MutableRefObject<Element | Text | null> }>
  >;
}

export const Screen: React.FC<ScreenProps> = (props) => {
  const [target, setTarget] = useState<HTMLElement>();
  const [elements, setElements] = useState<JSX.Element[]>();
  const coverRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setTarget(e.target as HTMLElement);
  }, []);

  const { left = 0, top = 0, height = 0, width = 0 } = target?.getBoundingClientRect() ?? {};
  const { left: screenLeft = 0, top: screenTop = 0 } =
    screenRef.current?.getBoundingClientRect() ?? {};
  // console.log(left, top, screenLeft, screenTop);
  const style = {
    left: `${left - screenLeft}px`,
    top: `${top - screenTop}px`,
    height: `${height}px`,
    width: `${width}px`,
  };

  useEffect(() => {
    const elementAndRef = props.editingWidget.map((Comp) => {
      const ref = createRef<Element | Text | null>();
      return {
        ref,
        element: <Comp wrapperRef={ref} />,
      };
    });
    setElements(elementAndRef.map((value) => value.element));
    // const refSet = new Set(elementAndRef.map((value) =>  value.ref));
  }, [props.editingWidget]);

  return (
    <div ref={screenRef} className={styles.screen} onMouseDown={onMouseDown}>
      <div>{elements}</div>
      <div ref={coverRef} className={styles.cover} style={style} />
    </div>
  );
};

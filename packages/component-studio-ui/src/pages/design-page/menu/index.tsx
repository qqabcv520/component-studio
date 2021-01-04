import React, { memo, useCallback } from 'react';
import { EditingWidgetModel, EditingWidgetProp } from '@/models/design';
import styles from './index.less';

export interface MenuBlockProps {
  prop: EditingWidgetProp;
  propMap: { [id: string]: unknown };
  setProp: (key: string, value: any) => void;
}

const MenuBlock = memo<MenuBlockProps>(({ prop, propMap, setProp }) => {
  const onChange = useCallback(
    (value) => {
      setProp(prop.propKey, value);
    },
    [propMap, prop],
  );

  return <div className={styles.menuBlock}>
    <div>{prop.propName}: </div>
    <prop.propType.Parser value={propMap[prop.propKey]} onChange={onChange} />
  </div>;
});

export interface MenuProps {
  selectedWidget: EditingWidgetModel | null;
  propMap: { [id: string]: unknown };
  setProp: (key: string, value: any) => void;
}

export const Menu = memo<MenuProps>(({ selectedWidget, propMap, setProp }) => {
  return (
    <div className={styles.menu}>
      {selectedWidget?.props.map((prop) => (
        <MenuBlock key={prop.propKey} prop={prop} propMap={propMap} setProp={setProp} />
      ))}
    </div>
  );
});

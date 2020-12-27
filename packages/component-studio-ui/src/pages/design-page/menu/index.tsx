import React, { FC } from 'react';
import { EditingWidget } from '@/models/design';
import styles from './index.less';

export interface MenuProps {
  selectedWidget: EditingWidget | null;
}

export const Menu: FC<MenuProps> = ({ selectedWidget }) => {
  return (
    <div className={styles.menu}>
      {selectedWidget?.props.map((prop) => prop.propKey)}
      {selectedWidget?.id}
    </div>
  );
};

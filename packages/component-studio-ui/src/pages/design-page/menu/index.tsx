import React, { FC } from 'react';
import { EditingWidgetRef } from '@/models/design';
import styles from './index.less';

export interface MenuProps {
  selectedWidgetRef: EditingWidgetRef | null;
}

export const Menu: FC<MenuProps> = () => {
  return <div className={styles.menu} />;
};

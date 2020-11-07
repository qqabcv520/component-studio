import React from 'react';
import styles from './index.less';

export interface ScreenProps {}

export const Screen: React.FC<ScreenProps> = (props) => {
  return <div className={styles.screen}></div>;
};

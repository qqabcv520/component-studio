import React from 'react';
import '../../accets/style/index.less';
import styles from './index.less';
import { Toolbar } from './toolbar';
import { Header } from './header';
import { Screen } from './screen';
import { Menu } from './menu';

export default () => {
  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.body}>
        <Toolbar />
        <Screen />
        <Menu />
      </div>
    </div>
  );
};

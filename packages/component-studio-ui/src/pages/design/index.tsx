import React from 'react';
import '../../accets/style/index.less';
import styles from './index.less';
import { Toolbar } from './toolbar';
import { Header } from './header';
import { Screen } from './screen';
import { Menu } from './menu';

export default () => {
  const editingWidget = [
    <input type="text" key={0} />,
    <input type="checkbox" key={1} />,
    <input type="radio" key={2} />,
    <span key={3}> 123 </span>,
    <span key={4}> 456 </span>,
  ];
  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.body}>
        <Toolbar />
        <Screen editingWidget={editingWidget} />
        <Menu />
      </div>
    </div>
  );
};

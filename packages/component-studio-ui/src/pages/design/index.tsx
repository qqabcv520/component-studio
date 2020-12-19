import React, { ComponentClass, FC, FunctionComponent } from 'react';
import '../../accets/style/index.less';
import { componentWrapper, WrapperRefProps } from 'component-studio-core/src/interface/component';
import styles from './index.less';
import { Toolbar } from './toolbar';
import { Header } from './header';
import { Screen } from './screen';
import { Menu } from './menu';

export interface OtherComponentProps {
  content: string;
}

export const OtherComponent: FC<OtherComponentProps> = (props: any) => {
  return (
    <div>
      <h1>{props.content}123456</h1>
      456789
    </div>
  );
};

const Test = componentWrapper(OtherComponent);

export default () => {
  const editingWidget: Array<
    FunctionComponent<any & WrapperRefProps> | ComponentClass<any & WrapperRefProps>
  > = [Test];
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

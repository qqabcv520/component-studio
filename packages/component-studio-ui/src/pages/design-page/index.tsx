import React, { FC, useCallback } from 'react';
import '../../accets/style/index.less';
import { connect, ConnectProps } from 'umi';
import { DesignState } from '@/models/design';
import { WidgetInfo } from 'component-studio-core';
import styles from './index.less';
import { Toolbar } from './toolbar';
import { Header } from './header';
import { Screen } from './screen';
import { Menu } from './menu';

const DesignPage: FC<ConnectProps & DesignState> = ({
  widgets,
  editingWidgets,
  propMap,
  dispatch,
}) => {
  const onWidgetAdd = useCallback(
    (widget: WidgetInfo) => {
      if (dispatch) {
        dispatch<WidgetInfo>({
          type: 'design/newEditingWidget',
          payload: widget,
        });
      }
    },
    [dispatch],
  );

  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.body}>
        <Toolbar widgets={widgets} onWidgetAdd={onWidgetAdd} />
        <Screen editingWidgets={editingWidgets} propMap={propMap} />
        <Menu />
      </div>
    </div>
  );
};

export default connect(({ design }: { design: DesignState }) => design)(DesignPage);

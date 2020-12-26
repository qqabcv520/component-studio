import React, { FC, useCallback } from 'react';
import '../../accets/style/index.less';
import { connect, ConnectProps } from 'umi';
import { DesignState, EditingWidgetRef } from '@/models/design';
import { WidgetInfo } from 'component-studio-core';
import styles from './index.less';
import { Toolbar } from './toolbar';
import { Header } from './header';
import { Screen } from './screen';
import { Menu } from './menu';

const DesignPage: FC<ConnectProps & DesignState> = ({
  widgets,
  editingWidgetMap,
  propMap,
  selectedWidgetRef,
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
  const onSelectWidget = useCallback(
    (selectWidgetRef: EditingWidgetRef | null) => {
      console.log(selectWidgetRef);
    },
    [dispatch],
  );
  const editingWidgets = Object.values(editingWidgetMap);
  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.body}>
        <Toolbar widgets={widgets} onWidgetAdd={onWidgetAdd} />
        <Screen editingWidgets={editingWidgets} onSelectWidget={onSelectWidget} propMap={propMap} />
        <Menu selectedWidgetRef={selectedWidgetRef} />
      </div>
    </div>
  );
};

export default connect(({ design }: { design: DesignState }) => design)(DesignPage);

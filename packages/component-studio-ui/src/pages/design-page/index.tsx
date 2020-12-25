import React, { Component, FC, useCallback } from 'react';
import '../../accets/style/index.less';
import { connect, ConnectProps } from 'umi';
import { DesignState, EditingWidget, SetEditingWidgetRefPayload } from '@/models/design';
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
  const setEditingWidgetRef = useCallback(
    (editingWidget: EditingWidget, instance: Component) => {
      if (dispatch && instance && editingWidget.instance !== instance) {
        dispatch<SetEditingWidgetRefPayload>({
          type: 'design/setEditingWidgetRef',
          payload: {
            editingWidgetId: editingWidget.id,
            instance,
          },
        });
      }
    },
    [dispatch],
  );
  const editingWidgets = Object.values(editingWidgetMap);
  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.body}>
        <Toolbar widgets={widgets} onWidgetAdd={onWidgetAdd} />
        <Screen
          editingWidgets={editingWidgets}
          propMap={propMap}
          setEditingWidgetRef={setEditingWidgetRef}
        />
        <Menu />
      </div>
    </div>
  );
};

export default connect(({ design }: { design: DesignState }) => design)(DesignPage);

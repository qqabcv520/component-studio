import React, { FC, useMemo } from 'react';
import '../../accets/style/index.less';
import { connect, ConnectProps } from 'umi';
import { DesignState, SetEditingWidgetInstancePayload } from '@/models/design';
import { WidgetInfo } from 'component-studio-core';
import styles from './index.less';
import { Toolbar } from './toolbar';
import { Header } from './header';
import { Screen } from './screen';
import { Menu } from './menu';

const DesignPage: FC<ConnectProps & DesignState> = ({
  widgets,
  editingWidgetMap,
  editingWidgetInstanceMap,
  propMap,
  selectedWidget,
  dispatch,
}) => {
  const onWidgetAdd = (widget: WidgetInfo) => {
    if (dispatch) {
      dispatch<WidgetInfo>({
        type: 'design/newEditingWidget',
        payload: widget,
      });
    }
  };
  const onSelectWidget = (selectWidgetId: string | null) => {
    if (dispatch) {
      dispatch<string | null>({
        type: 'design/selectedEditingWidget',
        payload: selectWidgetId,
      });
    }
  };

  const setEditingWidgetRef = (payload: SetEditingWidgetInstancePayload) => {
    if (dispatch) {
      dispatch<SetEditingWidgetInstancePayload>({
        type: 'design/setEditingWidgetInstance',
        payload,
      });
    }
  };

  const editingWidgets = useMemo(() => {
    return Object.values(editingWidgetMap).filter(Boolean);
  }, [editingWidgetMap]);
  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.body}>
        <Toolbar widgets={widgets} onWidgetAdd={onWidgetAdd} />
        <Screen
          editingWidgets={editingWidgets}
          onSelectWidget={onSelectWidget}
          propMap={propMap}
          setEditingWidgetRef={setEditingWidgetRef}
          editingWidgetInstanceMap={editingWidgetInstanceMap}
        />
        <Menu selectedWidget={selectedWidget} />
      </div>
    </div>
  );
};

export default connect(({ design }: { design: DesignState }) => design)(DesignPage);

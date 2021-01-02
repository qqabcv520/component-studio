import React, { FC, useCallback, useMemo } from 'react';
import '../../accets/style/index.less';
import { connect, ConnectProps } from 'umi';
import {
  DesignState,
  EditingWidgetModel,
  NewEditingWidgetPayload,
  SetEditingWidgetInstancePayload,
  SetPropPayload
} from '@/models/design';
import { WidgetInfo } from 'component-studio-core';
import { Elements } from '@/pages/design-page/elements';
import { EditingWidgetTree } from '@/utils/type';
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
  selectedWidgetId,
  dispatch,
}) => {
  const onWidgetAdd = useCallback((widget: WidgetInfo) => {
    if (dispatch) {
      dispatch<NewEditingWidgetPayload>({
        type: 'design/newEditingWidget',
        payload: {
          parentId: selectedWidgetId,
          widget,
        },
      });
    }
  }, [selectedWidgetId]);
  const onSelectWidget = useCallback((selectWidgetId: string | null) => {
    if (dispatch) {
      dispatch<string | null>({
        type: 'design/selectedEditingWidget',
        payload: selectWidgetId,
      });
    }
  }, []);

  const setEditingWidgetRef = useCallback((payload: SetEditingWidgetInstancePayload) => {
    if (dispatch) {
      dispatch<SetEditingWidgetInstancePayload>({
        type: 'design/setEditingWidgetInstance',
        payload,
      });
    }
  }, []);

  const setProp = useCallback((key: string, value: any) => {
    if (dispatch) {
      dispatch<SetPropPayload>({
        type: 'design/setProp',
        payload: {
          key,
          value,
        },
      });
    }
  }, []);
  const editingWidgetTree = useEditingWidgetTree(editingWidgetMap);
  const selectedWidget = useMemo(() => selectedWidgetId ? editingWidgetMap[selectedWidgetId] : null, [editingWidgetMap, selectedWidgetId]);
  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.body}>
        <Toolbar widgets={widgets} onWidgetAdd={onWidgetAdd} />
        <Screen
          editingWidgetTree={editingWidgetTree}
          selectedWidgetId={selectedWidgetId}
          onSelectWidget={onSelectWidget}
          propMap={propMap}
          setEditingWidgetRef={setEditingWidgetRef}
          editingWidgetInstanceMap={editingWidgetInstanceMap}
        />
        <Menu selectedWidget={selectedWidget} propMap={propMap} setProp={setProp} />
        <Elements editingWidgetTree={editingWidgetTree} onSelectWidget={onSelectWidget} selectedWidgetId={selectedWidgetId}/>
      </div>
    </div>
  );
};

export default connect(({ design }: { design: DesignState }) => design)(DesignPage);

function recursiveEditingWidgetTree(parentIdMap: Map<string | null, EditingWidgetModel[]>, id: string | null = null): EditingWidgetTree[] {
  return(parentIdMap.get(id) ?? []).map<EditingWidgetTree>(({ parentId, ...otherProps }) => ({
    ...otherProps,
    children: recursiveEditingWidgetTree(parentIdMap, otherProps.id)
  }));
}
function useEditingWidgetTree(editingWidgetMap: { [id: string]: EditingWidgetModel }) {
  return useMemo(() => {
    const parentIdMap = Object.values(editingWidgetMap).reduce((previousValue, currentValue) => {
      let arr = previousValue.get(currentValue.parentId);
      if (arr == null) {
        arr = [];
        previousValue.set(currentValue.parentId, arr);
      }
      previousValue.set(currentValue.parentId, [...arr, currentValue]);
      return previousValue;
    }, new Map<string | null, EditingWidgetModel[]>());
    return recursiveEditingWidgetTree(parentIdMap);
  }, [editingWidgetMap]);
}

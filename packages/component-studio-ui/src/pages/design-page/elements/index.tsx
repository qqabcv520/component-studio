import React, { memo, useCallback, useMemo } from 'react';
import { Tree } from 'antd';
import { NodeDragEventParams } from 'rc-tree/lib/contextTypes';
import { DataNode, EventDataNode, Key } from 'rc-tree/lib/interface';
import { EditingWidgetTree } from '@/utils/type';
import styles from './index.less';


export interface ElementsProps {
  onSelectWidget: (selectWidgetId: string | null) => void;
  editingWidgetTree: EditingWidgetTree[];
}

export const Elements = memo<ElementsProps>(({ editingWidgetTree, onSelectWidget}) => {
  const treeData: DataNode[] = useTreeData(editingWidgetTree);

  const onDragEnter = (info: NodeDragEventParams & {expandedKeys: Key[]}) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };
  const onDrop = (info: NodeDragEventParams & {
    dragNode: EventDataNode;
    dragNodesKeys: Key[];
    dropPosition: number;
    dropToGap: boolean;
  }) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  const onSelect = useCallback((selectedKeys: Key[], info: {
    event: 'select';
    selected: boolean;
    node: EventDataNode;
    selectedNodes: DataNode[];
    nativeEvent: MouseEvent;
  }) => {
    onSelectWidget(selectedKeys[0] as string ?? null );
    console.log(selectedKeys);
  }, [onSelectWidget])

  return (
    <div className={styles.tree}>
      <Tree
        className="draggable-tree"
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        onSelect={onSelect}
        treeData={treeData}
      />
    </div>
  );
});


export function useTreeData(editingWidgets: EditingWidgetTree[]): DataNode[] {
  function recursive(widgets: EditingWidgetTree[]): DataNode[] {
    return widgets.map(value => ({
      key: value.id,
      title: value.widgetName,
      children: value.children && recursive(value.children)
    }));
  }
  return useMemo(() => {
    return recursive(editingWidgets);
  }, [editingWidgets]);
}

import React, { memo, useMemo } from 'react';
import { Tree } from 'antd';
import { NodeDragEventParams } from 'rc-tree/lib/contextTypes';
import { DataNode, EventDataNode, Key } from 'rc-tree/lib/interface';
import styles from './index.less';
import { EditingWidgetTree } from '@/utils/type';


export interface TreeProps {
  editingWidgetTree: EditingWidgetTree[];
}

export const Elements = memo<TreeProps>(({ editingWidgetTree }) => {
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



  return (
    <div className={styles.tree}>
      <Tree
        className="draggable-tree"
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop}
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

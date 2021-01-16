import React, { memo, useCallback, useMemo } from 'react';
import { Tree } from 'antd';
import { NodeDragEventParams } from 'rc-tree/lib/contextTypes';
import { DataNode, EventDataNode, Key } from 'rc-tree/lib/interface';
import { EditingWidgetTree } from '@/utils/type';
import { EditingWidgetModel } from '@/models/design';
import styles from './index.less';

export interface ElementsProps {
  onSelectWidget: (selectWidgetId: string | null) => void;
  selectedWidgetId: string | null;
  editingWidgetMap: { [id: string]: EditingWidgetModel };
  editingWidgetTree: EditingWidgetTree[];
  onEditingWidgetDrop: (params: {
    id: string;
    targetId: string | null;
    targetSort: number;
  }) => void;
}

export const Elements = memo<ElementsProps>(
  ({
    editingWidgetTree,
    onSelectWidget,
    selectedWidgetId,
    onEditingWidgetDrop,
    editingWidgetMap,
  }) => {
    const treeData: DataNode[] = useTreeData(editingWidgetTree);

    const onDrop = useCallback(
      (
        info: NodeDragEventParams & {
          dragNode: EventDataNode;
          dragNodesKeys: Key[];
          dropPosition: number;
          dropToGap: boolean;
        },
      ) => {
        if (info.event.type === 'drop') {
          const id = info.dragNode.key as string;
          const dropId = info.node.key as string;
          const dropPos = info.node.pos.split('-');
          const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
          if (!info.dropToGap) {
            const targetId = dropId;
            const targetSort = 0;
            onEditingWidgetDrop({ id, targetId, targetSort });
          } else if (dropPosition === 1) {
            const targetId = editingWidgetMap[dropId].parentId;
            const targetSort = editingWidgetMap[dropId].sort + 1;
            onEditingWidgetDrop({ id, targetId, targetSort });
          } else if (dropPosition === 0) {
            const targetId = dropId;
            const targetSort = 0;
            onEditingWidgetDrop({ id, targetId, targetSort });
          } else if (dropPosition === -1) {
            const targetId = null;
            const targetSort = 0;
            onEditingWidgetDrop({ id, targetId, targetSort });
          } else {
            throw Error(`意料之外的dropPosition值：${dropPosition}`);
          }
        }
      },
      [onEditingWidgetDrop, editingWidgetMap],
    );

    const onSelect = useCallback(
      (selectedKeys: Key[]) => {
        onSelectWidget((selectedKeys[0] as string) ?? null);
      },
      [onSelectWidget],
    );

    const selectedKeys = useMemo(() => (selectedWidgetId ? [selectedWidgetId] : []), [
      selectedWidgetId,
    ]);
    return (
      <div className={styles.tree}>
        <Tree
          className="draggable-tree"
          draggable
          blockNode
          showLine={{ showLeafIcon: false }}
          onDrop={onDrop}
          onSelect={onSelect}
          treeData={treeData}
          selectedKeys={selectedKeys}
        />
      </div>
    );
  },
);

export function useTreeData(editingWidgets: EditingWidgetTree[]): DataNode[] {
  function recursive(widgets: EditingWidgetTree[]): DataNode[] {
    return widgets.map((value) => ({
      key: value.id,
      title: `${value.widgetName} : ${value.id}`,
      children: value.children && recursive(value.children),
    }));
  }
  return useMemo(() => {
    return recursive(editingWidgets);
  }, [editingWidgets]);
}

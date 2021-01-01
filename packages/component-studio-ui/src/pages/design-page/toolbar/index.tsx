import React, { useCallback } from 'react';
import { Collapse, CollapsePanel } from '@/components/collapse';
import { WidgetGroup, WidgetInfo } from 'component-studio-core';
import styles from './index.less';

export interface WidgetProps {
  name: string;
  icon?: string;
  widgetInfo: WidgetInfo;
  onWidgetAdd: (widget: WidgetInfo) => void;
}

export const WidgetMenu: React.FC<WidgetProps> = ({ name, onWidgetAdd, widgetInfo }) => {
  const onClick = useCallback(() => {
    onWidgetAdd(widgetInfo);
  }, [widgetInfo, onWidgetAdd]);
  return (
    <div className={styles.widget} onClick={onClick}>
      <div />
      <span className={styles.widgetText}>{name}</span>
    </div>
  );
};

export interface ToolbarProps {
  widgets: WidgetGroup[];
  onWidgetAdd: (widget: WidgetInfo) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ widgets, onWidgetAdd }) => {
  return (
    <div className={styles.toolbar}>
      <Collapse>
        {widgets.map((widget) => (
          <CollapsePanel key={widget.groupName} header={widget.groupName}>
            <div className={styles.widgetWrapper}>
              {widget.widgetInfos.map((widgetInfo) => (
                <WidgetMenu
                  key={widgetInfo.widgetName}
                  name={widgetInfo.widgetName}
                  widgetInfo={widgetInfo}
                  onWidgetAdd={onWidgetAdd}
                />
              ))}
            </div>
          </CollapsePanel>
        ))}
      </Collapse>
    </div>
  );
};

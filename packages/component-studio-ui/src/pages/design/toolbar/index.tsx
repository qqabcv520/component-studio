import React from 'react';
import styles from './index.less';
import { Collapse, CollapsePanel } from '@/components/collapse';

export interface WidgetProps {
  name: string;
  icon?: string;
}

export const Widget: React.FC<WidgetProps> = (props) => {
  return (
    <div className={styles.widget}>
      <div></div>
      <span className={styles.widgetText}>{props.name}</span>
    </div>
  );
};

export interface ToolbarProps {}

export const Toolbar: React.FC<ToolbarProps> = () => {
  return (
    <div className={styles.toolbar}>
      <Collapse>
        <CollapsePanel header={'基础组件'}>
          <div className={styles.widgetWrapper}>
            <Widget name={'文本'} />
            <Widget name={'块容器'} />
            <Widget name={'图片'} />
            <Widget name={'按钮'} />
            <Widget name={'输入框'} />
            <Widget name={'表格'} />
          </div>
        </CollapsePanel>
      </Collapse>
    </div>
  );
};

import React from 'react';
import styles from './index.less';

export interface CollapseProps {
  onChange?: (key: string | string[]) => void;
  style?: React.CSSProperties;
  className?: string;
}

export interface CollapsePanelProps {
  isActive?: boolean;
  header?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CollapsePanel: React.FC<CollapsePanelProps> = (props) => {
  // const { className = '' } = props;

  return (
    <div className={styles.collapse}>
      <div className={styles.panelHeader}>{props.header}</div>
      {props.children}
    </div>
  );
};

export const Collapse: React.FC<CollapseProps> = (props) => {
  // const { className = '' } = props;

  return <div className={styles.collapse}>{props.children}</div>;
};

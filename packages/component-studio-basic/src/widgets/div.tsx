import React, { CSSProperties, FC } from 'react';
import { componentToWidget } from 'component-studio-core';

export interface DivComponentProps {
  content?: string;
}
const divStyle: CSSProperties = {
  minHeight: '20px',
  padding: '8px',
};
const DivComponent: FC<DivComponentProps> = ({ children }) => {
  return <div style={divStyle}>{children}</div>;
};

export const divWidget = {
  widgetName: '块布局',
  widgetType: componentToWidget(DivComponent),
  widgetProps: [],
};

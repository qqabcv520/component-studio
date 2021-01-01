import { componentToWidget } from 'component-studio-core';
import React, { CSSProperties, FC } from 'react';
import { stringProp } from '../props/string-prop';

export interface H1ComponentProps {
  content?: string;
}
const h1Style: CSSProperties = {
  minHeight: '20px'
}
const H1Component: FC<H1ComponentProps> = ({ content }) => {
  return (
    <h1 style={h1Style}>{content}</h1>
  );
};


export const h1Widget = {
  widgetName: '标题',
  widgetType: componentToWidget(H1Component),
  widgetProps: [
    {
      propName: 'content',
      propType: stringProp,
      defaultValue: 'text',
    },
  ],
}

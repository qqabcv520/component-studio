import { componentToWidget, PropInfo, WidgetWrapperType, WidgetGroup } from 'component-studio-core';
import React, { FC } from 'react';

const numberProp: PropInfo = {
  name: 'Number',
  defaultValue: 0,
  parser(value: any) {
    return <input type="number" value={value} />;
  },
};

const stringProp: PropInfo = {
  name: 'String',
  defaultValue: '',
  parser(value: any) {
    return <input type="text" value={value} />;
  },
};

export const widget: WidgetWrapperType[] = [];

export interface TestComponentProps {
  content?: string;
}

const TestComponent: FC<TestComponentProps> = (props: TestComponentProps) => {
  return (
    <div>
      <h1>Content: {props.content}</h1>
    </div>
  );
};

export const parsers: PropInfo[] = [numberProp, stringProp];

export const widgets: WidgetGroup = {
  groupName: '基础组件',
  widgetInfos: [
    {
      widgetName: '测试',
      widgetType: componentToWidget(TestComponent),
      widgetProps: [
        {
          propName: 'content',
          propType: stringProp,
          defaultValue: 'text',
        },
      ],
    },
  ],
};

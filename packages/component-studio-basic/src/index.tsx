import { componentToWidget, PropInfo, WidgetWrapperType, WidgetGroup } from 'component-studio-core';
import React, { ChangeEvent, FC, useCallback } from 'react';

const numberProp: PropInfo = {
  name: 'Number',
  defaultValue: 0,
  Parser(value: any) {
    return <input type="number" value={value} />;
  },
};

const stringProp: PropInfo<string> = {
  name: 'String',
  defaultValue: '',
  Parser({ value, onChange }) {
    const onChangeCallback = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange],
    );
    return (
      <input
        type="text"
        style={{ width: '100%' }}
        placeholder="请输入组件内容"
        value={value}
        onChange={onChangeCallback}
      />
    );
  },
};

export const widget: WidgetWrapperType[] = [];

export interface TestComponentProps {
  content?: string;
}

const TestComponent: FC<TestComponentProps> = (props: TestComponentProps) => {
  return (
    <div>
      <h1>{props.content}</h1>
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

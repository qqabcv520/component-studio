import { componentToWidget, WidgetInfo } from 'component-studio-core';
import { Component, ReactNode } from 'react';
import { booleanProp } from '../props/boolean-prop';

export interface IFComponentProps {
  condition?: boolean;
}

class IfComponent extends Component<IFComponentProps> {
  render(): ReactNode {
    if (this.props.condition) {
      return this.props.children;
    }
    return null;
  }
}

export const ifWidget: WidgetInfo = {
  widgetName: 'IF条件',
  widgetType: componentToWidget(IfComponent),
  widgetProps: [
    {
      propName: 'condition',
      propType: booleanProp,
    },
  ],
};

import { ComponentClass, createElement, FunctionComponent, PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { PropInfo } from './prop';

export interface WidgetProp {
  propName: string;
  propType: PropInfo;
  defaultValue?: unknown;
}

export type WidgetWrapperType<P = unknown> = FunctionComponent<P> | ComponentClass<P>;

export interface WidgetInfo<P = any> {
  widgetName: string;
  widgetProps: WidgetProp[];
  widgetType: WidgetWrapperType<P>;
}

export interface WidgetGroup {
  groupName: string;
  widgetInfos: WidgetInfo[];
}

export interface WidgetComponent<P = {}, S = {}, SS = any> extends PureComponent<P, S, SS> {
  wrapperRef: Element | null;
}

export function componentToWidget<P>(
  Com: FunctionComponent<P> | ComponentClass<P>,
): WidgetWrapperType<P> {
  return class WidgetComponent extends PureComponent<P> implements WidgetComponent {
    wrapperRef: Element | null = null;

    componentDidMount() {
      this.updateWrapperRef();
    }

    componentDidUpdate() {
      this.updateWrapperRef();
    }

    updateWrapperRef() {
      // eslint-disable-next-line react/no-find-dom-node
      const node = findDOMNode(this);
      if (!(node instanceof Element)) {
        return;
      }
      this.wrapperRef = node;
    }

    render() {
      return createElement(Com, this.props);
    }
  };
}

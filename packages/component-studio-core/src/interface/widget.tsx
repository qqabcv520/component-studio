import React, { Component, ComponentClass, FunctionComponent, MutableRefObject } from 'react';
import { findDOMNode } from 'react-dom';

export type WidgetWrapperType<P = unknown> =
  | FunctionComponent<P & WrapperRefProps>
  | ComponentClass<P & WrapperRefProps>;

export interface WidgetInfo<P = unknown> {
  widgetName: string;
  widget: WidgetWrapperType<P>;
}

export interface WidgetGroup {
  groupName: string;
  widgetInfos: WidgetInfo[];
}

export interface WrapperRefProps {
  wrapperRef?: MutableRefObject<Element | Text | null>;
}

export function componentToWidget<P>(
  Com: FunctionComponent<P> | ComponentClass<P>,
): WidgetWrapperType<P> {
  return class extends Component<P & WrapperRefProps> {
    componentDidMount() {
      if (this.props.wrapperRef) {
        // eslint-disable-next-line react/no-find-dom-node
        this.props.wrapperRef.current = findDOMNode(this);
      }
    }

    render() {
      return <Com {...this.props} />;
    }
  };
}

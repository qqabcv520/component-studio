import {
  Component,
  ComponentClass,
  createElement,
  FunctionComponent,
  MutableRefObject,
} from 'react';
import { findDOMNode } from 'react-dom';
import { PropInfo } from './prop';

export interface WidgetProp {
  propName: string;
  propType: PropInfo;
  defaultValue?: unknown;
}

export type WidgetWrapperType<P = unknown> =
  | FunctionComponent<P & WrapperRefProps>
  | ComponentClass<P & WrapperRefProps>;

export interface WidgetInfo<P = unknown> {
  widgetName: string;
  widgetProps: WidgetProp[];
  widgetType: WidgetWrapperType<P>;
}

export interface WidgetGroup {
  groupName: string;
  widgetInfos: WidgetInfo[];
}

export interface WrapperRefProps {
  wrapperRef?: MutableRefObject<Element | null>;
}

export function componentToWidget<P>(
  Com: FunctionComponent<P> | ComponentClass<P>,
): WidgetWrapperType<P> {
  return class extends Component<P & WrapperRefProps> {
    componentDidMount() {
      if (this.props.wrapperRef) {
        this.props.wrapperRef.current = this.findElement();
      }
    }

    componentDidUpdate() {
      if (this.props.wrapperRef) {
        this.props.wrapperRef.current = this.findElement();
      }
    }

    findElement() {
      // eslint-disable-next-line react/no-find-dom-node
      const node = findDOMNode(this);
      if (node instanceof Element) {
        return node;
      }
      throw Error('组件必须根节点必须是Element');
    }

    render() {
      return createElement(Com, this.props);
    }
  };
}

import React, { Component, ComponentClass, FunctionComponent, MutableRefObject } from 'react';
import { findDOMNode } from 'react-dom';

export type WrapperRefProps = {
  wrapperRef?: MutableRefObject<Element | Text | null>;
};

export function componentWrapper<P>(Com: FunctionComponent<P> | ComponentClass<P>) {
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

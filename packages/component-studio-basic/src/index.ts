import { PropInfo, WidgetGroup } from 'component-studio-core';
import { numberProp } from './props/number-prop';
import { stringProp } from './props/string-prop';
import { divWidget } from './widgets/div';
import { h1Widget } from './widgets/h1';

export const props: PropInfo[] = [numberProp, stringProp];

export const widgets: WidgetGroup = {
  groupName: '基础组件',
  widgetInfos: [h1Widget, divWidget],
};

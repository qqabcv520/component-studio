import { PropInfo, WidgetGroup } from 'component-studio-core';
import { numberProp } from './props/number-prop';
import { stringProp } from './props/string-prop';
import { divWidget } from './widgets/div';
import { h1Widget } from './widgets/h1';
import { ifWidget } from './widgets/if';
import { booleanProp } from './props/boolean-prop';

export const props: PropInfo[] = [numberProp, stringProp, booleanProp];

export const widgets: WidgetGroup = {
  groupName: '基础组件',
  widgetInfos: [h1Widget, divWidget, ifWidget],
};

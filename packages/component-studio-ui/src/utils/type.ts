import { WidgetWrapperType } from 'component-studio-core';
import { EditingWidgetProp } from '@/models/design';

export type ExcludeProperties<T, EP> = {
  [P in Exclude<keyof T, EP>]: T[P];
};


export interface EditingWidgetInfo {
  widgetName: string;
  props: EditingWidgetProp[];
  widgetType: WidgetWrapperType;
}

export interface EditingWidgetTree extends EditingWidgetInfo {
  id: string;
  children: EditingWidgetTree[];
}

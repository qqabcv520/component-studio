import { WidgetGroup, WidgetInfo, WidgetProp, WidgetWrapperType } from 'component-studio-core';
import { ImmerModelType } from '@/models/interface';
import { widgets as basicWidgets } from 'component-studio-basic';
import { Action } from '@@/plugin-dva/connect';
import { Component, createRef, RefObject } from 'react';

/**
 * 用于存放 Widget 的参数
 * @property propName Widget 接受的属性对应名
 * @property propKey Widget 接受的属性值的 key，类似一个引用，可以在 `propMap` 中通过 `key` 获取具体对应的值
 */
export interface EditingWidgetProp {
  propName: string;
  propKey: string;
}

export interface EditingWidget {
  id: number;
  props: EditingWidgetProp[];
  widgetType: WidgetWrapperType;
  instanceRef: RefObject<Component>;
}

export interface DesignState {
  widgets: WidgetGroup[];
  editingWidgets: EditingWidget[];
  propMap: {
    [id: number]: unknown;
  };
  propMapIndex: number;
  editingWidgetsIndex: number;
}

export interface AddEditingWidgetAction extends Action<'addEditingWidget'> {
  payload?: {
    props: EditingWidgetProp[];
    widgetType: WidgetWrapperType;
    instanceRef: RefObject<Component>;
  };
}

export interface AddWidgetAction extends Action<'addWidget'> {
  payload?: WidgetGroup;
}

export interface NewEditingWidgetAction extends Action<'newEditingWidget'> {
  payload?: WidgetInfo;
}

export interface AddPropToMapAction extends Action<'addPropToMap'> {
  payload?: WidgetProp;
}

const model: ImmerModelType<DesignState> = {
  state: {
    widgets: [],
    editingWidgets: [],
    propMap: Object.create(null),
    propMapIndex: 0,
    editingWidgetsIndex: 0,
  },
  reducers: {
    // pushProp(state, { payload } : {payload: PropsInfo}) {
    //   state.propMap[payload.]
    // },
    addWidget(state, action: AddWidgetAction) {
      if (action.payload) {
        state.widgets.push(action.payload);
      }
    },
    addEditingWidget(state, action: AddEditingWidgetAction) {
      const localState = state;
      const editingWidgets = action.payload;
      if (editingWidgets) {
        localState.editingWidgetsIndex += 1;
        localState.editingWidgets.push({
          ...editingWidgets,
          id: state.editingWidgetsIndex,
        });
      }
    },
    addPropToMap(state, action: AddPropToMapAction) {
      const localState = state;
      localState.propMapIndex += 1;
      localState.propMap[localState.propMapIndex] =
        action.payload?.defaultValue !== undefined
          ? action.payload?.defaultValue
          : action.payload?.propType.defaultValue;
    },
  },
  effects: {
    *newEditingWidget(action: NewEditingWidgetAction, effects) {
      const widgetInfo = action.payload;
      if (widgetInfo) {
        let props: EditingWidgetProp[] = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const widgetProp of widgetInfo.widgetProps) {
          yield effects.put<AddPropToMapAction>({
            type: 'addPropToMap',
            payload: widgetProp,
          });

          const propKey = yield effects.select(
            (state: { design: DesignState }) => state.design.propMapIndex,
          );
          props = props.concat({
            propName: widgetProp.propName,
            propKey,
          });
        }
        const instanceRef = createRef<Component>();
        yield effects.put<AddEditingWidgetAction>({
          type: 'addEditingWidget',
          payload: {
            props,
            widgetType: widgetInfo.widgetType,
            instanceRef,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch<AddWidgetAction>({
        type: 'addWidget',
        payload: basicWidgets,
      });
    },
  },
};
export default model;

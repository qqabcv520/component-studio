import { WidgetGroup, WidgetInfo, WidgetProp, WidgetWrapperType } from 'component-studio-core';
import { ImmerModelType } from '@/models/interface';
import { widgets as basicWidgets } from 'component-studio-basic';
import { Action } from '@@/plugin-dva/connect';
import { Component } from 'react';

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
  instance: Component | null;
}

export interface DesignState {
  widgets: WidgetGroup[];
  propMap: {
    [id: number]: unknown;
  };
  editingWidgetMap: {
    [id: number]: EditingWidget;
  };
  propMapIndex: number;
  editingWidgetsIndex: number;
}

export interface AddEditingWidgetAction extends Action<'addEditingWidget'> {
  payload?: {
    props: EditingWidgetProp[];
    widgetType: WidgetWrapperType;
    instance: Component | null;
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

export interface SetEditingWidgetRefPayload {
  editingWidgetId: number;
  instance: Component;
}

export interface SetEditingWidgetRefAction extends Action<'setEditingWidgetRef'> {
  payload?: SetEditingWidgetRefPayload;
}

const model: ImmerModelType<DesignState> = {
  state: {
    widgets: [],
    editingWidgetMap: Object.create(null),
    propMap: Object.create(null),
    propMapIndex: 0,
    editingWidgetsIndex: 0,
  },
  reducers: {
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
        const id = state.editingWidgetsIndex;
        localState.editingWidgetMap[id] = {
          ...editingWidgets,
          id,
        };
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
    setEditingWidgetRef(state, { payload }: SetEditingWidgetRefAction) {
      const localState = state;
      if (
        payload &&
        state.editingWidgetMap[payload.editingWidgetId] &&
        localState.editingWidgetMap[payload.editingWidgetId]
      ) {
        localState.editingWidgetMap[payload.editingWidgetId].instance = payload.instance;
      }
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
        yield effects.put<AddEditingWidgetAction>({
          type: 'addEditingWidget',
          payload: {
            props,
            widgetType: widgetInfo.widgetType,
            instance: null,
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

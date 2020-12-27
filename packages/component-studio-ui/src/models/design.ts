import {
  WidgetComponent,
  WidgetGroup,
  WidgetInfo,
  WidgetProp,
  WidgetWrapperType,
} from 'component-studio-core';
import { ModelType } from '@/models/interface';
import { widgets as basicWidgets } from 'component-studio-basic';
import { Action } from '@@/plugin-dva/connect';

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
}

export interface AddEditingWidgetAction extends Action<'addEditingWidget'> {
  payload?: {
    props: EditingWidgetProp[];
    widgetType: WidgetWrapperType;
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

export interface SetEditingWidgetInstancePayload {
  id: number;
  instance: WidgetComponent | null;
}

export interface SetEditingWidgetInstanceAction extends Action<'setEditingWidgetInstance'> {
  payload?: SetEditingWidgetInstancePayload;
}

export interface SelectedEditingWidgetAction extends Action<'setEditingWidgetRef'> {
  payload?: EditingWidget | null;
}

const initState = {
  widgets: [] as WidgetGroup[],
  editingWidgetMap: Object.create(null) as { [id: number]: EditingWidget },
  editingWidgetInstanceMap: Object.create(null) as { [id: number]: WidgetComponent | null },
  propMap: Object.create(null) as { [id: number]: unknown },
  propMapIndex: 0,
  editingWidgetsIndex: 0,
  selectedWidget: null as EditingWidget | null,
};

export type DesignState = typeof initState;

const model: ModelType<DesignState> = {
  state: initState,
  reducers: {
    addWidget(state = initState, { payload }: AddWidgetAction) {
      if (payload) {
        return {
          ...state,
          widgets: [...state.widgets, payload],
        };
      }
      return state;
    },
    addEditingWidget(state = initState, { payload }: AddEditingWidgetAction) {
      if (payload) {
        const newId = state.editingWidgetsIndex + 1;
        return {
          ...state,
          editingWidgetsIndex: newId,
          editingWidgetMap: {
            ...state.editingWidgetMap,
            [newId]: {
              ...payload,
              id: newId,
            },
          },
        };
      }
      return state;
    },
    addPropToMap(state = initState, { payload }: AddPropToMapAction) {
      if (payload) {
        const newId = state.propMapIndex + 1;
        return {
          ...state,
          propMapIndex: newId,
          propMap: {
            ...state.propMap,
            [newId]:
              payload?.defaultValue !== undefined
                ? payload?.defaultValue
                : payload?.propType.defaultValue,
          },
        };
      }
      return state;
    },
    setEditingWidgetInstance(state = initState, { payload }: SetEditingWidgetInstanceAction) {
      if (payload) {
        return {
          ...state,
          editingWidgetInstanceMap: {
            ...state.editingWidgetInstanceMap,
            [payload.id]: payload.instance,
          },
        };
      }
      return state;
    },
    selectedEditingWidget(state = initState, { payload }: SelectedEditingWidgetAction) {
      return {
        ...state,
        selectedWidgetRef: payload || null,
      };
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

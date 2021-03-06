import {
  PropInfo,
  WidgetComponent,
  WidgetGroup,
  WidgetInfo,
  WidgetProp,
} from 'component-studio-core';
import { ModelType } from '@/models/interface';
import { widgets as basicWidgets } from 'component-studio-basic';
import { Action } from '@@/plugin-dva/connect';
import { EditingWidgetInfo, ExcludeProperties } from '@/utils/type';

/**
 * 用于存放 Widget 的参数
 * @property propName Widget 接受的属性对应名
 * @property propKey Widget 接受的属性值的 key，类似一个引用，可以在 `propMap` 中通过 `key` 获取具体对应的值
 */
export interface EditingWidgetProp {
  propName: string;
  propType: PropInfo;
  propKey: string;
}

export interface EditingWidgetModel extends EditingWidgetInfo {
  id: string;
  sort: number;
  parentId: string | null;
}

export interface AddEditingWidgetPayload
  extends ExcludeProperties<EditingWidgetModel, 'id' | 'sort'> {}

export interface AddEditingWidgetAction extends Action<'addEditingWidget'> {
  payload?: AddEditingWidgetPayload;
}

export interface AddWidgetAction extends Action<'addWidget'> {
  payload?: WidgetGroup;
}

export interface NewEditingWidgetPayload {
  parentId: string | null;
  widget: WidgetInfo;
}

export interface NewEditingWidgetAction extends Action<'newEditingWidget'> {
  payload?: NewEditingWidgetPayload;
}

export interface AddPropToMapAction extends Action<'addPropToMap'> {
  payload?: WidgetProp;
}

export interface SetEditingWidgetInstancePayload {
  id: string;
  instance: WidgetComponent | null;
}

export interface SetEditingWidgetInstanceAction extends Action<'setEditingWidgetInstance'> {
  payload?: SetEditingWidgetInstancePayload;
}

export interface SelectedEditingWidgetAction extends Action<'setEditingWidgetRef'> {
  payload?: string | null;
}

export interface SetPropPayload {
  key: string;
  value: any;
}

export interface SetPropAction extends Action<'setProp'> {
  payload?: SetPropPayload;
}

export interface MoveEditingWidgetPayload {
  id: string;
  targetId: string | null;
  targetSort: number;
}

export interface MoveEditingWidgetAction extends Action<'moveEditingWidget'> {
  payload?: MoveEditingWidgetPayload;
}

const initState = {
  widgets: [] as WidgetGroup[],
  editingWidgetMap: Object.create(null) as { [id: string]: EditingWidgetModel },
  editingWidgetInstanceMap: Object.create(null) as { [id: string]: WidgetComponent },
  propMap: Object.create(null) as { [id: string]: unknown },
  propMapIndex: 0,
  editingWidgetsIndex: 0,
  selectedWidgetId: null as string | null,
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
    addEditingWidget(state = initState, { payload }: AddEditingWidgetAction): DesignState {
      if (payload) {
        const id = state.editingWidgetsIndex + 1;

        const { parentId } = payload;
        const children = Object.values(state.editingWidgetMap).filter(
          (value) => value.parentId === parentId,
        );
        return {
          ...state,
          editingWidgetsIndex: id,
          editingWidgetMap: {
            ...state.editingWidgetMap,
            [id]: {
              ...payload,
              id: String(id),
              sort: children.length,
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
        if (payload.instance == null) {
          const { [payload.id]: deleteInstance, ...editingWidgetInstanceMap } = {
            ...state.editingWidgetInstanceMap,
          };
          delete editingWidgetInstanceMap[payload.id];
          return {
            ...state,
            editingWidgetInstanceMap,
          };
        }
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
        selectedWidgetId: payload ?? null,
      };
    },
    setProp(state = initState, { payload }: SetPropAction) {
      if (payload) {
        return {
          ...state,
          propMap: {
            ...state.propMap,
            [payload.key]: payload.value,
          },
        };
      }
      return state;
    },
    moveEditingWidget(state = initState, { payload }: MoveEditingWidgetAction) {
      if (payload) {
        const { id, targetId, targetSort } = payload;
        const oldEditingWidgetMap = state.editingWidgetMap;
        const editingWidgetMap = Object.keys(oldEditingWidgetMap)
          .map<EditingWidgetModel>((key) => {
            const value = oldEditingWidgetMap[key];
            if (value.id === id) {
              return {
                ...value,
                parentId: targetId,
                sort: targetSort,
              };
            }
            return {
              ...value,
              sort:
                value.sort >= targetSort && value.parentId === targetId
                  ? value.sort + 1
                  : value.sort,
            };
          })
          .reduce((previousValue, currentValue) => {
            const map = previousValue;
            map[currentValue.id] = currentValue;
            return map;
          }, Object.create(null) as { [id: string]: EditingWidgetModel });
        console.log(editingWidgetMap);
        return {
          ...state,
          editingWidgetMap,
        };
      }
      return state;
    },
  },
  effects: {
    *newEditingWidget(action: NewEditingWidgetAction, effects) {
      const widgetInfo = action.payload?.widget;
      const parentId = action.payload?.parentId ?? null;
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
            propType: widgetProp.propType,
            propKey,
          });
        }
        yield effects.put<AddEditingWidgetAction>({
          type: 'addEditingWidget',
          payload: {
            props,
            widgetType: widgetInfo.widgetType,
            widgetName: widgetInfo.widgetName,
            parentId,
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

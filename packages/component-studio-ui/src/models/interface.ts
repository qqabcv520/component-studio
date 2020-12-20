import { Effect, ImmerReducer, Reducer } from 'umi';

export type ReducersType<S> = {
  [key: string]: Reducer<S>;
};

export type ModelType<S, E> = {
  state: S;
  effects?: {
    [key in keyof E]?: Effect;
  };
  reducers?: ReducersType<S>;
};

export type ImmerReducersType<S> = {
  [key: string]: ImmerReducer<S>;
};

export type ImmerModelType<S, E> = {
  state: S;
  effects?: {
    [key in keyof E]?: Effect;
  };
  reducers?: ImmerReducersType<S>;
};

export function defineModel<S, E>(model: ModelType<S, E>) {
  return model;
}

export function defineImmerModel<S, E>(model: ImmerModelType<S, E>) {
  return model;
}

import { Effect, ImmerReducer, Subscription, Reducer } from 'umi';

export type ModelType<S> = {
  state: S;
  reducers?: {
    [key: string]: Reducer<S>;
  };
  effects?: {
    [key: string]: Effect;
  };
  subscriptions?: {
    [key: string]: Subscription;
  };
};

export type ImmerModelType<S> = {
  state: S;
  reducers?: {
    [key: string]: ImmerReducer<S>;
  };
  effects?: {
    [key: string]: Effect;
  };
  subscriptions?: {
    [key: string]: Subscription;
  };
};

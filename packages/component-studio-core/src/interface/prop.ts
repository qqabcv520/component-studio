import { ComponentType } from 'react';

export interface ParserProps<T> {
  value: T;
  onChange: (value: T) => void;
}

export interface PropInfo<T = any> {
  name: string;
  defaultValue?: T;
  Parser: ComponentType<ParserProps<T>>;
}

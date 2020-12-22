export type Parser = (value: any) => JSX.Element;

export interface PropInfo {
  name: string;
  defaultValue?: unknown;
  parser: Parser;
}

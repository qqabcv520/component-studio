export type Parser = (value: any, onChange: (value: any) => void) => JSX.Element;

export interface PropInfo {
  name: string;
  defaultValue?: unknown;
  parser: Parser;
}

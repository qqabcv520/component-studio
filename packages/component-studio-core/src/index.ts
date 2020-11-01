export interface Parser {
  type: any;
  parser: (value: any) => JSX.Element;
}

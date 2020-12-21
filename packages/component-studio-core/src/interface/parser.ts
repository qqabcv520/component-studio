export type Parser = (value: any) => JSX.Element;

export interface ParserInfo {
  type: any;
  parser: Parser;
}

import React from 'react';
import { Parser } from 'component-studio-core';

export const components = [];

const numberParse: Parser = {
  type: Number,
  parser(value: any) {
    return <input type="text" value={value} />;
  },
};

export const parsers: Parser[] = [numberParse];

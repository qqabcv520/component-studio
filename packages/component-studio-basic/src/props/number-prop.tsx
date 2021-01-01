import { PropInfo } from 'component-studio-core';
import React from 'react';

export const numberProp: PropInfo = {
  name: 'Number',
  defaultValue: 0,
  Parser(value: any) {
    return <input type="number" value={value} />;
  },
};

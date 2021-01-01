import { PropInfo } from 'component-studio-core';
import React, { ChangeEvent, useCallback } from 'react';

export const stringProp: PropInfo<string> = {
  name: 'String',
  defaultValue: '',
  Parser({ value, onChange }) {
    const onChangeCallback = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange],
    );
    return (
      <input
        type="text"
        style={{ width: '100%' }}
        placeholder="请输入组件内容"
        value={value}
        onChange={onChangeCallback}
      />
    );
  },
};

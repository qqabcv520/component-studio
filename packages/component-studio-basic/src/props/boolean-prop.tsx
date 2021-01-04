import { PropInfo } from 'component-studio-core';
import React, { ChangeEvent, useCallback } from 'react';

export const booleanProp: PropInfo<boolean> = {
  name: 'Boolean',
  defaultValue: false,
  Parser({ value, onChange }) {
    const onChangeCallback = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
      },
      [onChange],
    );
    return (
      <input
        type="checkbox"
        style={{ width: '100%' }}
        placeholder="请输入组件内容"
        checked={value}
        onChange={onChangeCallback}
      />
    );
  },
};

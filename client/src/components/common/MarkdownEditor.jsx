import React, { useState, useEffect, useRef } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css'; // easymde styles
import styles from './MarkdownEditor.css';

function MarkdownEditor({ value, onChange, options, ...props }) {

    const handleChange = (newValue) => {
        if (onChange) {
            onChange(newValue);
        }
    };

  return (
    <div className={styles.markdownEditor}>
      <SimpleMDE
        value={value}
        onChange={handleChange}
        options={{
          spellChecker: false, // no space checker for tagalog
          ...options,
        }}
        {...props}
      />
    </div>
  );
}

export default MarkdownEditor;

import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './MarkdownRenderer.css'
function MarkdownRenderer({ content }) {
  return (
      <ReactMarkdown className={styles.markdownRenderer}>{content}</ReactMarkdown>
    );
}

export default MarkdownRenderer;
import React from 'react';
import styles from './Title.module.css';

const TruncatedTitle = ({ title }) => {
  const truncatedTitle = title.length > 10 ? `${title.slice(0, 10)}...` : title;

  return (
    <div className={styles.datatitle} title={title.length > 10 ? title : ''}>
      {truncatedTitle}
    </div>
  );
};

export default TruncatedTitle;

import React from 'react';
import Link from 'gatsby-link';

import styles from './landing.module.scss';

const LandingPage = () => (
  <div className={styles.landing}>
    <div>
      <h1 className={styles.landing__header}>REACT FILE INPUT</h1>
      <p className={styles.landing__subheader}>
        A File Input, width drag'n'drop and image editor.
      </p>
      <div className={styles.btn__wrapper}>
        <Link to="/docs" className={styles.landing__btn}>
          <span>Get started!</span>
        </Link>
      </div>
    </div>
  </div>
);

export default LandingPage;

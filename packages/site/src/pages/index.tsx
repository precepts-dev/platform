import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

function IndustrySignal() {
  return (
    <section className={styles.signalSection}>
      <div className="container">
        <Heading as="h2" className={styles.signalHeading}>
          The Industry is Converging
        </Heading>
        <blockquote className={styles.signalQuote}>
          <p>
            "Something I'm finding very useful recently: using LLMs to build
            personal knowledge bases for various topics of research interest. A
            large fraction of my recent token throughput is going less into
            manipulating code, and more into manipulating knowledge."
          </p>
          <footer className={styles.signalAttribution}>
            <span className={styles.signalAuthor}>Andrej Karpathy</span>
            <span className={styles.signalDate}>{' - April 2026'}</span>
            <a
              href="https://x.com/karpathy/status/2039805659525644595"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.signalXLink}
              aria-label="View original post on X">
              <svg
                className={styles.signalXIcon}
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </footer>
        </blockquote>
        <p className={styles.signalContext}>
          Precepts is the organizational-scale version of this - structured,
          validated, multi-channel standards for humans and AI agents.
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Standardize with ${siteConfig.title}`}
      description="Precepts - multi-discipline standards platform built for humans and AI agents">
      <HomepageHeader />
      <IndustrySignal />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

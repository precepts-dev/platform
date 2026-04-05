import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  link: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Product Management',
    icon: '\u{1F4CB}',
    link: '/docs/product/',
    description: (
      <>
        Guidelines and standards for Product Management professionals backed by
        data and best practices.
      </>
    ),
  },
  {
    title: 'Integrations',
    icon: '\u{1F517}',
    link: '/docs/integration/',
    description: (
      <>
        Guidelines and standards for Integration teams backed by ISO, IEEE, RFC
        and other standards.
      </>
    ),
  },
  {
    title: 'User Experience',
    icon: '\u{1F3A8}',
    link: '/docs/ux/',
    description: (
      <>
        Guidelines and standards for UX/UI professionals backed by WCAG, W3C,
        ISO and other standards.
      </>
    ),
  },
  {
    title: 'Project Management',
    icon: '\u{1F4C6}',
    link: '/docs/project-management/',
    description: (
      <>
        Guidelines and standards for Project Management professionals covering
        ceremonies, estimation and delivery.
      </>
    ),
  },
];

function Feature({ title, icon, link, description }: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <Link to={link} className={styles.featureLink}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon} role="img">{icon}</span>
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

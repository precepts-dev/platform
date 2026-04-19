import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type DisciplineItem = {
  title: string;
  icon: string;
  link: string;
  description: ReactNode;
};

const DisciplineList: DisciplineItem[] = [
  {
    title: 'Product Management',
    icon: '\u{1F4CB}',
    link: '/product/',
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
    link: '/integration/',
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
    link: '/ux/',
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
    link: '/project-management/',
    description: (
      <>
        Guidelines and standards for Project Management professionals covering
        ceremonies, estimation and delivery.
      </>
    ),
  },
];

function DisciplineCard({ title, icon, link, description }: DisciplineItem) {
  return (
    <Link to={link} className={styles.featureLink}>
      <div className={styles.featureCard}>
        <span className={styles.featureIcon} role="img">{icon}</span>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </Link>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          Browse Standards
        </Heading>
        <div className={styles.disciplineGrid}>
          {DisciplineList.map((props, idx) => (
            <DisciplineCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

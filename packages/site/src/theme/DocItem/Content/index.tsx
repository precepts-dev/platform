import type { ReactNode } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemContent from '@theme-original/DocItem/Content';
import styles from './styles.module.css';

type Props = {
  children: ReactNode;
};

type StatusVariant = 'mandatory' | 'recommended' | 'draft' | 'deprecated';

function getStatusVariant(status: string): StatusVariant {
  switch (status?.toUpperCase()) {
    case 'MANDATORY':
      return 'mandatory';
    case 'RECOMMENDED':
      return 'recommended';
    case 'DEPRECATED':
      return 'deprecated';
    default:
      return 'draft';
  }
}

function StandardMetadataBar() {
  const { frontMatter } = useDoc();

  const identifier = frontMatter.identifier as string | undefined;
  if (!identifier) return null;

  const status = (frontMatter.status as string) ?? '';
  const version = (frontMatter.version as string) ?? '';
  const domain = (frontMatter.domain as string) ?? '';
  const documentType = (frontMatter.documentType as string) ?? '';

  const variant = getStatusVariant(status);

  return (
    <div className={styles.metadataBar}>
      <span className={styles.identifier}>{identifier}</span>
      {version && <span className={styles.chip}>v{version}</span>}
      {status && (
        <span className={`${styles.chip} ${styles[variant]}`}>
          {status}
        </span>
      )}
      {domain && <span className={styles.chip}>{domain}</span>}
      {documentType && (
        <span className={styles.chip}>{documentType}</span>
      )}
    </div>
  );
}

export default function DocItemContentWrapper(props: Props): ReactNode {
  return (
    <>
      <StandardMetadataBar />
      <DocItemContent {...props} />
    </>
  );
}

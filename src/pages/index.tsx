import { wrapper } from 'app/store';
import {
  fetchOrganizations,
  selectOrganizations,
} from 'app/store/slices/organizations';
import type { NextPageWithLayout } from 'pages/_app';
import { useAppSelector } from 'app/hooks';

import styles from '../styles/Home.module.scss';

const IndexPage: NextPageWithLayout = () => {
  const { organizations } = useAppSelector(selectOrganizations);

  return (
    <div className={styles.container}>
      organizations
      {organizations.results.map((org) => {
        return ' ' + org.name + ' ';
      })}
    </div>
  );
};

IndexPage.getLayout = function getLayout(page) {
  return page;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await store.dispatch(fetchOrganizations());
    return {
      props: {},
    };
  }
);

export default IndexPage;

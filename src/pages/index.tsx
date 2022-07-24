import { wrapper } from 'app/store';
import {
  fetchPromotedOrganizations,
  selectOrganizations,
} from 'app/store/slices/organizations';
import type { NextPageWithLayout } from 'pages/_app';
import { useAppSelector } from 'app/hooks';

const IndexPage: NextPageWithLayout = () => {
  const { organizations } = useAppSelector(selectOrganizations);

  return (
    <div>
      organizations <br />
      {organizations.results.map((org) => {
        return ' ' + org.name + ' ';
      })}
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await store.dispatch(fetchPromotedOrganizations());
    return {
      props: {},
    };
  }
);

export default IndexPage;

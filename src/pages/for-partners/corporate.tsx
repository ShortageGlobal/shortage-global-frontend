import { wrapper } from 'app/store';
import type { NextPageWithLayout } from 'pages/_app';

const ForCorporate: NextPageWithLayout = () => {
  return <div>For corporate</div>;
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ForCorporate;

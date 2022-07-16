import { wrapper } from 'app/store';
import type { NextPageWithLayout } from 'pages/_app';

const ImpactStories: NextPageWithLayout = () => {
  return <div>Impact stories</div>;
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ImpactStories;

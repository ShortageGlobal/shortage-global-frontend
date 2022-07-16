import { wrapper } from 'app/store';
import type { NextPageWithLayout } from 'pages/_app';

const HowItWorks: NextPageWithLayout = () => {
  return <div>How it works</div>;
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default HowItWorks;

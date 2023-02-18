import commonStyles from 'styles/pages/private/common.module.scss';
import styles from 'styles/pages/private/my-impact.module.scss';
import { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import { accountLayout } from 'core/layouts';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import { wrapper } from 'core/store';
import { extractAccessTokenFromSession } from 'core/helpers';
import { fetchAccountPackageBlogPosts } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getMyImpactCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { BlogPostCard } from 'components/blog-posts/blog-post-card/blog-post-card';
import type { BlogPostPreview } from 'core/api/types';
import type { NextPageWithLayout } from 'pages/_app';

type MyImpactPageProps = {
  blogPosts: BlogPostPreview[];
};

const MyImpactPage: NextPageWithLayout = ({ blogPosts }: MyImpactPageProps) => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getMyImpactCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>My Impact | Shortage</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <Row className={commonStyles.headerRow}>
        <Col>
          <h2 className={commonStyles.title}>My Impact</h2>
        </Col>
      </Row>

      <Row>
        <Col>
          {blogPosts?.length > 0 ? (
            <div className={styles.blogPostsList}>
              {blogPosts.map((blogPost) => {
                const key = `${blogPost.organization.slug}-${blogPost.slug}`;
                return <BlogPostCard key={key} blogPost={blogPost} />;
              })}
            </div>
          ) : (
            <div>
              There are no impact stories associated with your donations yet.
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

MyImpactPage.getLayout = accountLayout;

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });

    let blogPostsResponse;
    try {
      // fetch blog posts associated with user's donations
      blogPostsResponse = await fetchAccountPackageBlogPosts({ accessToken });
    } catch (rejection) {
      if (rejection?.response?.status === 401) {
        const callbackUrl = encodeURIComponent(context.resolvedUrl);
        return {
          redirect: {
            destination: `/account/sign-in/?callbackUrl=${callbackUrl}`,
            permanent: false,
          },
        };
      }
      throw rejection;
    }

    return {
      props: { blogPosts: blogPostsResponse.data },
    };
  }
);

export default MyImpactPage;

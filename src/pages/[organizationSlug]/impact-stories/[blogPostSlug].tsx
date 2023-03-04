import styles from 'styles/pages/organization-blog-post.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import Head from 'next/head';
import Image from 'next/image';
import { wrapper } from 'core/store';
import {
  extractAccessTokenFromSession,
  formatDateForHumans,
} from 'core/helpers';
import { fetchOrganizationBlogPost } from 'core/api';
import { DraftWarning } from 'components/draft-warning/draft-warning';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getOrganizationBlogPostCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { ShareButton } from 'components/share/share-button';
import { ROOT_URL } from 'core/constants';
import type { BlogPost } from 'core/api/types';
import type { NextPageWithLayout } from 'pages/_app';

type BlogPostPageProps = {
  blogPost: BlogPost;
};

const BlogPostPage: NextPageWithLayout = ({ blogPost }: BlogPostPageProps) => {
  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getOrganizationCrumb({
        organizationSlug: blogPost.organization.slug,
        organizationName: blogPost.organization.name,
      }),
      getOrganizationBlogPostCrumb({
        organizationSlug: blogPost.organization.slug,
        blogPostSlug: blogPost.slug,
        blogPostTitle: blogPost.title,
        isActive: true,
      }),
    ];
  }, [blogPost]);

  const { metaUrl, metaTitle, metaDescription, metaImage } = useMemo(() => {
    return {
      metaUrl: `${ROOT_URL}/${blogPost.organization.slug}/impact-stories/${blogPost.slug}/`,
      metaTitle: blogPost.title,
      metaDescription: blogPost.meta_description?.trim()
        ? blogPost.meta_description.trim()
        : null,
      metaImage: blogPost.image,
    };
  }, [blogPost]);

  return (
    <>
      <Head>
        <title>{`${blogPost.title} | Shortage`}</title>
        <meta property="og:url" key="og:url" content={metaUrl} />
        <meta property="og:title" key="og:title" content={metaTitle} />
        {metaDescription ? (
          <>
            <meta
              property="og:description"
              key="og:description"
              content={metaDescription}
            />
            <meta
              property="description"
              key="description"
              content={metaDescription}
            />
          </>
        ) : null}
        {metaImage ? (
          <>
            <meta property="og:image" key="og:image" content={metaImage} />
            <meta
              property="og:image:width"
              key="og:image:width"
              content="1244"
            />
            <meta
              property="og:image:height"
              key="og:image:height"
              content="700"
            />
          </>
        ) : null}
      </Head>

      {blogPost.organization.is_draft ? (
        <DraftWarning
          adminHref={{
            pathname:
              '/private/manage-nonprofit/[organizationSlug]/impact-stories/[blogPostId]/',
            query: {
              organizationSlug: blogPost.organization.slug,
              blogPostId: blogPost.uuid,
            },
          }}
        />
      ) : null}

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col className={styles.organizationBlogPost}>
            <header className={styles.header}>
              <h2 className="text-break">{blogPost.title}</h2>
              <div className="d-flex align-items-center justify-content-center">
                <span className={styles.date}>
                  {formatDateForHumans({ date: blogPost.updated_at })}
                </span>
                {blogPost.is_draft ? (
                  <Badge bg="secondary" className="ms-2">
                    Draft
                  </Badge>
                ) : null}
              </div>
            </header>

            {blogPost.image ? (
              <div className={styles.imageContainer}>
                <Image
                  className={styles.image}
                  src={blogPost.image}
                  width="1244"
                  height="700"
                  alt=""
                  priority
                />
              </div>
            ) : null}

            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            <div className={styles.shareButtonContainer}>
              <ShareButton
                url={metaUrl}
                text={blogPost.title}
                disabled={blogPost.is_draft || blogPost.organization.is_draft}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });

    const organizationSlug = context.params.organizationSlug as string;
    const blogPostSlug = context.params.blogPostSlug as string;

    let blogPostResponse;
    try {
      // fetch blog post
      blogPostResponse = await fetchOrganizationBlogPost({
        organizationSlug,
        blogPostSlug,
        accessToken,
      });
    } catch (rejection) {
      if (rejection?.response?.status === 404) {
        return {
          notFound: true,
        };
      }

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
      props: { blogPost: blogPostResponse.data },
    };
  }
);

export default BlogPostPage;

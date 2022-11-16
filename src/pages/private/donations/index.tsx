import styles from 'styles/pages/private/donations/donations.module.scss';
import { useState, useMemo, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Row, Col, Table, Button } from 'react-bootstrap';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { accountLayout } from 'core/layouts';
import { AccountBreadcrumbsContainer } from 'core/layouts/account-layout/account-breadcrumbs-container';
import { wrapper } from 'core/store';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { fetchAccountPackages } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getAccountDonationsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { Pagination } from 'components/pagination/pagination';
import { LoadingMessage } from 'components/loading-message/loading-message';
import {
  REQUESTED_GOODS_CONTAINER_ID,
  PACKAGE_STATUS_DISPLAY_LABELS,
  PACKAGE_TYPE_DISPLAY_LABELS,
  DEFAULT_PAGE_SIZE,
} from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';
import type { Package } from 'core/api/types';

const DonationsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getAccountDonationsCrumb({ isActive: true })];
  }, []);

  const { showNotification } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(null);
  const [donations, setDonations] = useState<Package[]>(null);

  const getFetchDataCancelToken = useCancelToken();

  // fetch donations
  useEffect(() => {
    setIsLoading(true);
    (async function fetchData() {
      const cancelToken = getFetchDataCancelToken();
      try {
        const response = await fetchAccountPackages({
          offset: pageSize * pageNumber,
          limit: pageSize,
          cancelToken,
        });
        setIsLoading(false);
        setTotalCount(response.data.count);
        setDonations(response.data.results);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsLoading(false);
        let errorMessage = `Failed to load donations.`;
        if (rejection?.response?.data?.details) {
          errorMessage = `${errorMessage} ${rejection?.response?.data?.details}`;
        }
        showNotification({
          isFailure: true,
          message: errorMessage,
        });
      }
    })();
  }, [pageSize, pageNumber]);

  const handleRowClick = useCallback(
    (packageId) => {
      if (isLoading) {
        return;
      }
      router.push({
        pathname: '/private/donations/[packageId]/',
        query: { packageId },
      });
    },
    [router, isLoading]
  );

  return (
    <>
      <Head>
        <title>Account Donations | Shortage</title>
      </Head>

      <AccountBreadcrumbsContainer>
        <Breadcrumbs items={breadcrumbs} />
      </AccountBreadcrumbsContainer>

      <div className={styles.donations}>
        <Row>
          <Col>
            <h2 className={styles.header}>
              <span>Donations</span>

              {donations?.length > 0 ? (
                <div className={styles.paginationContainer}>
                  <Pagination
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    totalCount={totalCount}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    onPageNumberChange={(newPageNumber) =>
                      setPageNumber(newPageNumber)
                    }
                  />
                </div>
              ) : null}
            </h2>
          </Col>
        </Row>

        <Row>
          <Col>
            {!donations?.length && isLoading ? <LoadingMessage /> : null}

            {donations?.length === 0 && !isLoading ? (
              <p className={styles.noItemsMessage}>
                You don&apos;t have any registered donations. See the list of
                our{' '}
                <Link href={`/#${REQUESTED_GOODS_CONTAINER_ID}`}>
                  most requested items
                </Link>
                .
              </p>
            ) : null}

            {donations?.length > 0 ? (
              <>
                <Table responsive hover={!isLoading}>
                  <thead>
                    <tr>
                      <th className={styles.dateColumn}>Date</th>
                      <th className={styles.typeColumn}>Type</th>
                      <th className={styles.statusColumn}>Status</th>
                      <th className={styles.recipientColumn}>Recipient</th>
                      <th className={styles.actionsColumn}></th>
                    </tr>
                  </thead>
                  <tbody
                    className={classNames(styles.tbody, {
                      [styles.loading]: isLoading,
                    })}
                  >
                    {donations?.map((p) => {
                      // all package items must belong to a single organization,
                      // so just pick the first item
                      const organization = p.items[0].product.organization;
                      return (
                        <tr
                          key={p.uuid}
                          className={styles.row}
                          onClick={() => handleRowClick(p.uuid)}
                        >
                          <td className={styles.dateColumn}>
                            {new Date(p.created_at).toLocaleString('en-us', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>

                          <td className={styles.typeColumn}>
                            {PACKAGE_TYPE_DISPLAY_LABELS[p.type]}
                          </td>

                          <td className={styles.statusColumn}>
                            {PACKAGE_STATUS_DISPLAY_LABELS[p.status]}
                          </td>

                          <td className={styles.recipientColumn}>
                            <Link
                              className={styles.orgLink}
                              href={{
                                pathname: '/organizations/[organizationSlug]/',
                                query: { organizationSlug: organization.slug },
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {organization.name}
                            </Link>
                          </td>

                          <td className={styles.actionsColumn}>
                            <Link
                              href={{
                                pathname: '/private/donations/[packageId]/',
                                query: { packageId: p.uuid },
                              }}
                              legacyBehavior
                              passHref
                            >
                              <Button
                                variant="outline-dark"
                                disabled={isLoading}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Details
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </>
            ) : null}
          </Col>
        </Row>
      </div>
    </>
  );
};

DonationsPage.getLayout = accountLayout;

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default DonationsPage;

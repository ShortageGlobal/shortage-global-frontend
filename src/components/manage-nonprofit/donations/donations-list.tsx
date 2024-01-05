import commonStyles from 'styles/pages/private/common.module.scss';
import styles from './donations-list.module.scss';
import { useEffect, useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import {
  Row,
  Col,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { Package, DollarSign, X } from 'react-feather';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { useDebouncedCallback } from 'use-debounce';
import { fetchAccountOrganizationPackages } from 'core/api';
import { formatDateForHumans, formatPrice } from 'core/helpers';
import { Pagination } from 'components/pagination/pagination';
import { LoadingMessage } from 'components/loading-message/loading-message';
import {
  DEFAULT_PAGE_SIZE,
  PACKAGE_TYPE_DISPLAY_LABELS,
  PACKAGE_STATUS_DISPLAY_LABELS,
  PACKAGE_TYPE,
} from 'core/constants';
import type {
  AccountOrganization,
  AccountOrganizationPackage,
} from 'core/api/types';

const MAX_ITEMS_SHOWN = 3; // how many items to show in a table for each donation

export function DonationsList() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const { organization } = useAppSelector(selectAccountOrganization);

  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(null);
  const [donations, setDonations] = useState<AccountOrganizationPackage[]>([]);

  const hasCampaigns = useMemo(() => {
    return donations.some((d) => d.campaign);
  }, [donations]);

  const getFetchDonationsCancelToken = useCancelToken();

  const debouncedFetchDonations = useDebouncedCallback(
    async ({
      organizationSlug,
      offset,
      limit,
    }: {
      organizationSlug: AccountOrganization['slug'];
      offset?: number;
      limit?: number;
    }) => {
      const cancelToken = getFetchDonationsCancelToken();

      setIsLoading(true);

      try {
        const response = await fetchAccountOrganizationPackages({
          organizationSlug,
          offset,
          limit,
          cancelToken,
        });

        setDonations(response.data.results);
        setTotalCount(response.data.count);
        setIsLoading(false);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        const rejectionErrors = rejection?.response?.data;
        showNotification({
          isFailure: true,
          message: rejectionErrors?.details || 'Failed to get donations list',
        });
        setIsLoading(false);
      }
    },
    250
  );

  const handleRowClick = useCallback(
    (packageId) => {
      if (isLoading) {
        return;
      }
      router.push({
        pathname:
          '/private/manage-nonprofit/[organizationSlug]/donations/[packageId]/',
        query: { organizationSlug: organization.slug, packageId },
      });
    },
    [router, isLoading, organization]
  );

  useEffect(() => {
    debouncedFetchDonations({
      organizationSlug: organization.slug,
      offset: pageSize * pageNumber,
      limit: pageSize,
    });

    return () => {
      debouncedFetchDonations.cancel();
    };
  }, [organization.slug, pageSize, pageNumber]);

  return (
    <div>
      <Row className={commonStyles.headerRow}>
        <Col>
          <h2 className={commonStyles.title}>
            <span>Donations</span>

            {donations?.length > 0 ? (
              <Pagination
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                onPageNumberChange={(newPageNumber) =>
                  setPageNumber(newPageNumber)
                }
              />
            ) : null}
          </h2>
        </Col>
      </Row>

      {/* Loading */}
      {!donations?.length && isLoading ? <LoadingMessage /> : null}

      {/* No donations */}
      {donations?.length === 0 && !isLoading ? (
        <div>
          <p>
            You don&apos;t have any registered donations yet. We&apos;ll let you
            know as soon as a new donation is registered.
          </p>
        </div>
      ) : null}

      {donations?.length > 0 ? (
        <>
          <Table responsive hover={!isLoading} className={styles.donationsList}>
            <thead>
              <tr>
                <th className={styles.dateColumn}>Date</th>
                <th className={styles.typeColumn}>Type</th>
                <th className={styles.statusColumn}>Status</th>
                {hasCampaigns ? (
                  <th className={styles.campaignColumn}>Campaign</th>
                ) : null}
                <th className={styles.itemsColumn}>Items</th>
                <th className={styles.valueColumn}>Value</th>
                <th className={styles.actionsColumn}></th>
              </tr>
            </thead>
            <tbody
              className={classNames(styles.tbody, {
                [styles.loading]: isLoading,
              })}
            >
              {donations?.map((p) => {
                const totalPrice = p.items.reduce((acc, item) => {
                  return acc + item.quantity * item.price;
                }, 0);
                return (
                  <tr
                    key={p.uuid}
                    className={styles.row}
                    onClick={() => handleRowClick(p.uuid)}
                  >
                    <td className={styles.dateColumn}>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>
                            {new Date(p.created_at).toLocaleString()}
                          </Tooltip>
                        }
                      >
                        <span>
                          {formatDateForHumans({
                            date: p.created_at,
                            isMonthShort: true,
                          })}
                        </span>
                      </OverlayTrigger>
                    </td>

                    <td className={styles.typeColumn}>
                      <div className={styles.typeValue}>
                        {p.type === PACKAGE_TYPE.SENT_BY_DONOR ||
                        p.type === PACKAGE_TYPE.DROPPED_OFF_BY_DONOR ? (
                          <Package size="1rem" />
                        ) : null}
                        {p.type === PACKAGE_TYPE.FUNDED_BY_DONOR ? (
                          <DollarSign size="1rem" />
                        ) : null}

                        <span>{PACKAGE_TYPE_DISPLAY_LABELS[p.type]}</span>
                      </div>
                    </td>

                    <td className={styles.statusColumn}>
                      {PACKAGE_STATUS_DISPLAY_LABELS[p.status]}
                    </td>

                    {hasCampaigns ? (
                      <td className={styles.campaignColumn}>
                        {p.campaign ? (
                          <Link
                            href={{
                              pathname:
                                '/private/manage-nonprofit/[organizationSlug]/campaigns/[campaignUuid]/',
                              query: {
                                organizationSlug: organization.slug,
                                campaignUuid: p.campaign.uuid,
                              },
                            }}
                            className={classNames(
                              styles.campaignNameLink,
                              'break-word',
                              { 'text-secondary': p.campaign.is_deleted }
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{p.campaign.name}</span>
                          </Link>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                    ) : null}

                    <td className={styles.itemsColumn}>
                      {p.items.slice(0, MAX_ITEMS_SHOWN).map((item) => (
                        <div
                          key={item.product.id}
                          className={styles.productLine}
                        >
                          {item.quantity > 1 ? (
                            <>
                              <span>{item.quantity}</span>
                              <X size="0.9rem" />
                            </>
                          ) : null}
                          <Link
                            href={{
                              pathname:
                                '/private/manage-nonprofit/[organizationSlug]/requested-goods/[productId]/',
                              query: {
                                organizationSlug: organization.slug,
                                productId: item.product.id,
                              },
                            }}
                            className={classNames(
                              styles.productNameLink,
                              'text-truncate',
                              { 'text-secondary': item.product.is_deleted }
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{item.name}</span>
                          </Link>
                        </div>
                      ))}

                      {p.items.length > MAX_ITEMS_SHOWN ? (
                        <div>and {p.items.length - MAX_ITEMS_SHOWN} more</div>
                      ) : null}
                    </td>

                    <td className={styles.valueColumn}>
                      {formatPrice(totalPrice)}
                    </td>

                    <td className={styles.actionsColumn}>
                      <Link
                        href={{
                          pathname:
                            '/private/manage-nonprofit/[organizationSlug]/donations/[packageId]/',
                          query: {
                            organizationSlug: organization.slug,
                            packageId: p.uuid,
                          },
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
    </div>
  );
}

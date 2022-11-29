import styles from './package-logs.module.scss';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { Placeholder } from 'react-bootstrap';
import {
  useUser,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { fetchPackageLogs } from 'core/api';
import { PACKAGE_STATUS, PACKAGE_STATUS_DISPLAY_LABELS } from 'core/constants';
import type { Organization, Package, PackageLog } from 'core/api/types';

type PackageLogsProps = {
  donation: Package;
  organizationSlug: Organization['slug'];
  className?: string;
};

/* 
    A list of package log pairs: DATA - STATUS.
    Note, dates rendered on server cause hydration errors due to different time zones.
*/
export function PackageLogs({
  donation,
  organizationSlug,
  className = '',
}: PackageLogsProps) {
  const [logs, setLogs] = useState<PackageLog[]>(null);
  const [isPending, setIsPending] = useState(true);
  const { showNotification } = useNotifications();

  const getFetchLogsCancelToken = useCancelToken();

  const { isAccessTokenSet, isAuthenticated, isUnauthenticated } = useUser();

  useEffect(() => {
    if (!(isUnauthenticated || (isAccessTokenSet && isAuthenticated))) {
      // do not fetch log if access token hasn't been set yet for an authenticated user
      return;
    }

    async function fetchData() {
      const cancelToken = getFetchLogsCancelToken();
      setIsPending(true);

      try {
        const response = await fetchPackageLogs({
          packageId: donation.uuid,
          organizationSlug,
          cancelToken,
        });

        if (response.data?.length) {
          setLogs(response.data);
        } else {
          // old packages might not have logs
          setLogs([
            {
              created_at: donation.created_at,
              status: PACKAGE_STATUS.REGISTERED,
            },
          ]);
        }

        setIsPending(false);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsPending(false);
        let errorMessage = `Failed to load donation logs.`;
        if (rejection?.response?.data?.details) {
          errorMessage = `${errorMessage} ${rejection?.response?.data?.details}`;
        }
        showNotification({
          isFailure: true,
          message: errorMessage,
        });
      }
    }
    fetchData();
  }, [isAccessTokenSet, isAuthenticated, isUnauthenticated]);

  return (
    <div className={classNames(styles.packageLogs, className)}>
      {isPending ? (
        <Placeholder
          as="ul"
          animation="glow"
          className={styles.placeholderContainer}
        >
          {['Registered', 'Delivered'].map((value) => {
            return (
              <li key={value}>
                <Placeholder
                  as="div"
                  size="lg"
                  className={styles.placeholderDate}
                />{' '}
                &#8211;{' '}
                <Placeholder
                  as="div"
                  size="lg"
                  style={{ width: `${value.length}ch` }}
                />
              </li>
            );
          })}
        </Placeholder>
      ) : null}

      {!isPending && logs?.length > 0 ? (
        <ul>
          {logs?.map((log, index) => {
            return (
              <li key={index}>
                <span>{new Date(log.created_at).toLocaleString()}</span> &#8211;{' '}
                <span className={styles.logValue}>
                  {PACKAGE_STATUS_DISPLAY_LABELS[log.status]}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

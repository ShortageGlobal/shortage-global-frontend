import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import {
  selectNotifications,
  addNotification,
  removeNotification,
} from 'core/store/slices/notifications';
import { NOTIFICATION_TYPE } from 'core/constants';
import type { Notification } from 'core/api/types';

let notificationKey = 0;

const getNotificationKey = (): Notification['key'] => {
  return notificationKey++;
};

export function useNotifications() {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector(selectNotifications);

  const showNotification = useCallback(
    ({ isSuccess = false, isFailure = false, message }) => {
      let type: Notification['type'] = NOTIFICATION_TYPE.SUCCESS;
      if (isSuccess) {
        type = NOTIFICATION_TYPE.SUCCESS;
      }
      if (isFailure) {
        type = NOTIFICATION_TYPE.FAILURE;
      }
      dispatch(addNotification({ key: getNotificationKey(), message, type }));
    },
    []
  );

  const hideNotification = useCallback((key: Notification['key']) => {
    dispatch(removeNotification({ key }));
  }, []);

  return useMemo(() => {
    return { notifications, showNotification, hideNotification };
  }, [notifications, showNotification, hideNotification]);
}

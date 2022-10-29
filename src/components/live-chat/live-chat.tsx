import { LiveChatWidget } from '@livechat/widget-react';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { selectLiveChat, setChatVisibility } from 'core/store/slices/live-chat';
import { LIVE_CHAT_LICENCE_ID } from 'core/constants';
import type { EventHandlerPayload } from '@livechat/widget-react';

export function LiveChat() {
  const dispatch = useAppDispatch();
  const { visibility } = useAppSelector(selectLiveChat);

  function handleVisibilityChanged(
    event: EventHandlerPayload<'onVisibilityChanged'>
  ) {
    dispatch(setChatVisibility(event.visibility));
  }

  return (
    <LiveChatWidget
      license={LIVE_CHAT_LICENCE_ID}
      visibility={visibility}
      onVisibilityChanged={handleVisibilityChanged}
    />
  );
}

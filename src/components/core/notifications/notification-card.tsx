import React, { forwardRef } from 'react';
import { Avatar, Button, Notification, Stack } from '@mantine/core';

export interface NotificationCardProps {
  title: string;
  message: string;
  tabIndex?: number;
  actions?: React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const NotificationCard = forwardRef<HTMLDivElement, NotificationCardProps>(
  ({ title, message, ...props }, ref) => {
    return (
      <Notification
        ref={ref}
        withCloseButton={false}
        withBorder
        icon={<Avatar />}
        title={title}
        className="focus:outline-none focus:ring-1 focus:ring-blue-300 rounded-md"
        {...props}
      >
        {message}
        <Stack>{props.actions}</Stack>
        <Button>Mark As Read</Button>
      </Notification>
    );
  }
);

NotificationCard.displayName = 'NotificationCard';

export default NotificationCard;

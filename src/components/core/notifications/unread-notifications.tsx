import { Badge, Button, Drawer, List } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBell } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import NotificationCard, { NotificationCardProps } from './notification-card';

export const notifications: NotificationCardProps[] = [
  { title: 'New Message', message: 'You have received a new message from Dr. Smith.' },
  {
    title: 'Appointment Reminder',
    message: "Don't forget your appointment with Dr. Jane Doe tomorrow at 10:00 AM.",
  },
  { title: 'Medication Refill', message: "It's time to refill your prescription for Lisinopril." },
  {
    title: 'Health Tip',
    message: 'Stay hydrated! Aim to drink at least 8 glasses of water today.',
  },
  {
    title: 'Lab Results Available',
    message: 'Your recent lab results are now available. Check them in your health portal.',
  },
  {
    title: 'Insurance Update',
    message: 'Your insurance information has been updated successfully.',
  },
  {
    title: 'New Document Added',
    message: 'Your medical records have been updated with a new document.',
  },
  {
    title: 'Flu Season Alert',
    message: 'Flu season is here. Make sure to schedule your flu shot.',
  },
  {
    title: 'Upcoming Appointment',
    message: 'Your appointment with Dr. John Doe is scheduled for next Monday at 3:00 PM.',
  },
  {
    title: 'Wellness Check-In',
    message: "It's time for your monthly wellness check. Let us know how you're feeling.",
  },
];

const UnreadNotifications = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const notificationRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle keydown events for arrow navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (index + 1) % notifications.length;
      setFocusedIndex(nextIndex);
      notificationRefs.current[nextIndex]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (index - 1 + notifications.length) % notifications.length;
      setFocusedIndex(prevIndex);
      notificationRefs.current[prevIndex]?.focus();
    }
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Unread Notifications"
        position="right"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <List className="flex flex-col gap-2 py-4">
          {notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              {...notification}
              ref={(el) => {
                notificationRefs.current[index] = el;
              }}
              tabIndex={0} // Make it focusable
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
          ))}
        </List>
        <Button className="w-full" variant='light' onClick={close}>
          <Link href="/notifications">View All</Link>
        </Button>
      </Drawer>

      <Button size="sm" px={9} variant="transparent" onClick={open} className="relative">
        <IconBell />
        <Badge color="red" size="xs" className="absolute top-0 right-1">
          7
        </Badge>
      </Button>
    </>
  );
};

export default UnreadNotifications;

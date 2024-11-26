'use client';

import { useEffect, useState } from 'react';
import { rem, Switch, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [checked, setChecked] = useState<boolean | null>(null);

  // Check localStorage for saved theme preference or fallback to system preference
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('color-scheme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to light if server-side
  };

  useEffect(() => {
    // Set initial theme when the component mounts on the client
    setChecked(getInitialTheme());
  }, []);

  useEffect(() => {
    if (checked !== null) {
      const colorScheme = checked ? 'dark' : 'light';
      setColorScheme(colorScheme);
      localStorage.setItem('color-scheme', colorScheme); // Save user preference to localStorage
    }
  }, [checked]);

  const sunIcon = (
    <IconSun
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.yellow[4]}
    />
  );

  const moonIcon = (
    <IconMoonStars
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.blue[6]}
    />
  );

  return (
    <Switch
      size="md"
      color="dark.4"
      onLabel={sunIcon}
      offLabel={moonIcon}
      checked={checked ?? false}
      onChange={(event) => setChecked(event.currentTarget.checked)}
      disabled={checked === null} // Disable until initial theme is set
      aria-label="switch-theme"
    />
  );
}

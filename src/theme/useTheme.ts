import { useMemo } from 'react';
import { getColors, type ThemeColors } from './colors';
import { useStore } from '../store/useStore';
import type { ThemeMode } from '../types';

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useTheme = (): Theme => {
  const mode = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  const colors = useMemo(() => getColors(mode), [mode]);

  return { mode, colors, setTheme, toggleTheme };
};



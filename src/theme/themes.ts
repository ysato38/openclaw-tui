export type ThemeName = 'cyberpunk' | 'retro' | 'minimal';

export type Theme = {
  name: ThemeName;
  border: string;
  title: string;
  text: string;
  accent: string;
  ok: string;
  warn: string;
};

export const themes: Theme[] = [
  { name: 'cyberpunk', border: 'cyan', title: 'magenta', text: 'white', accent: 'yellow', ok: 'green', warn: 'red' },
  { name: 'retro', border: 'green', title: 'yellow', text: 'green', accent: 'white', ok: 'green', warn: 'red' },
  { name: 'minimal', border: 'gray', title: 'white', text: 'white', accent: 'blue', ok: 'green', warn: 'yellow' }
];

export const nextTheme = (current: ThemeName): ThemeName => {
  const idx = themes.findIndex((t) => t.name === current);
  return themes[(idx + 1) % themes.length].name;
};

export const getTheme = (name: ThemeName): Theme => themes.find((t) => t.name === name) ?? themes[0];

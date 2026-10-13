import type { AppInfo } from '@neo-scout/shared/ui';
import packageMeta from './package-meta.json';

export const APP_INFO = {
  version: packageMeta.version,
  copyright: {
    year: String(new Date().getFullYear()),
    email: 'vtsitlak@gmail.com',
  },
  source: 'https://github.com/vtsitlak/neo-scout',
} satisfies AppInfo;

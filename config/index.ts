import type { ConfigType } from '@moneko/core';

const conf: Partial<ConfigType> = {
  fallbackCompPath: '@/components/fallback',
  importOnDemand: {
    lodash: {
      transform: '${member}',
    },
    '@moneko/common': {
      transform: 'lib/${member}',
    },
    'neko-ui': {
      transform: 'es/${member}',
      memberTransformers: ['dashed_case']
    },
  },
};

export default conf;

import { deepseekSecrets } from './environment.secrets';

export const environment = {
  production: true,
  deepseekApiKey: deepseekSecrets.deepseekApiKey,
};

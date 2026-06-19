import { deepseekSecrets } from './environment.secrets';

export const environment = {
  production: false,
  deepseekApiKey: deepseekSecrets.deepseekApiKey,
};

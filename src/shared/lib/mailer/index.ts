import 'server-only';

import { resendMailer } from './resend-mailer';
import type { Mailer } from './types';

export const mailer: Mailer = resendMailer;
export type { SendEmailParams } from './types';
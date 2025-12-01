import { onCallGenkit } from 'firebase-functions/https';
import './config';
import { theOracleFlow } from './flows';

export const theOracle = onCallGenkit(theOracleFlow);

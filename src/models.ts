import {Protocol} from 'puppeteer-core';

export interface LinkedinClientSettings {
  headless: boolean;
  minMatchingRanking: number;
  context?: LinkedinClientContext;
}

export interface LinkedinClientContext {
  codeChallengeUrl?: string;
  cookies?: Protocol.Network.Cookie[];
}

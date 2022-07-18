import {Protocol} from 'puppeteer-core';

export interface HandlerEvent {
  url: string;
  cookies: Protocol.Network.CookieParam[];
}

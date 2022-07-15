export class LinkedinProxy {
  static getFor(proxyURL: string): string {
    const localizedProxyURL = proxyURL.replace(/(https?:\/\/)(.+?)(:.+?@.+?:\d{4,5})/g, '$1$2-country-es$3');
    // TODO why do we need to change the protocol?
    return localizedProxyURL.replace('https', 'http');
  }
}

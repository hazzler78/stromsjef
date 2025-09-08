export type PricingType = 'spot' | 'fast';

export type ProviderOffer = {
  id: string;
  providerId: string;
  providerName: string;
  providerLogoSrc: string; // path under public/
  planName: string;
  description?: string;
  href: string;
  buttonId: string;
  pricingType: PricingType;
  priceLabel?: string; // e.g. "Fra 83,90 øre/kWh (områdeavhengig)"
  bindingLabel?: string; // e.g. "Bindingstid: 12 mnd"
  monthlyFeeLabel?: string; // e.g. "Månedspris: kr 39,- pr måler"
};

export type Provider = {
  id: string;
  name: string;
  logoSrc: string; // path under public/
  offers: ProviderOffer[];
};

// Seed with Kilden Kraft example offers. Replace href values with your tracking URLs.
export const providers: Provider[] = [
  {
    id: 'kilden-kraft',
    name: 'Kilden Kraft',
    logoSrc: '/logos/kilden-kraft.png',
    offers: [
      {
        id: 'kilden-fast-1ar',
        providerId: 'kilden-kraft',
        providerName: 'Kilden Kraft',
        providerLogoSrc: '/logos/kilden-kraft.png',
        planName: 'Fastpris 1 år',
        description: 'Full kontroll på strømkostnadene i ett år.',
        href: 'https://kildenkraft.no/bedrift/fastpris-1-ar/?utm_source=stromsjef.no',
        buttonId: 'offer-kilden-fast-1ar',
        pricingType: 'fast',
        priceLabel: 'Fra 83,90 øre/kWh (prisområdeavhengig)',
        bindingLabel: 'Bindingstid: 12 mnd',
        monthlyFeeLabel: 'Månedspris: kr 39,- pr måler',
      },
      {
        id: 'kilden-fast-3ar',
        providerId: 'kilden-kraft',
        providerName: 'Kilden Kraft',
        providerLogoSrc: '/logos/kilden-kraft.png',
        planName: 'Fastpris 3 år',
        description: 'Forutsigbar pris i tre år.',
        href: 'https://kildenkraft.no/bedrift/fastpris-3-ar/?utm_source=stromsjef.no',
        buttonId: 'offer-kilden-fast-3ar',
        pricingType: 'fast',
        priceLabel: 'Fra 86,90 øre/kWh (prisområdeavhengig)',
        bindingLabel: 'Bindingstid: 36 mnd',
        monthlyFeeLabel: 'Månedspris: kr 39,- pr måler',
      },
      {
        id: 'kilden-fast-5ar',
        providerId: 'kilden-kraft',
        providerName: 'Kilden Kraft',
        providerLogoSrc: '/logos/kilden-kraft.png',
        planName: 'Fastpris 5 år',
        description: 'Langsiktig stabilitet i fem år.',
        href: 'https://kildenkraft.no/bedrift/fastpris-5-ar/?utm_source=stromsjef.no',
        buttonId: 'offer-kilden-fast-5ar',
        pricingType: 'fast',
        priceLabel: 'Se gjeldende pris per prisområde',
        bindingLabel: 'Bindingstid: 60 mnd',
        monthlyFeeLabel: 'Månedspris: kr 39,- pr måler',
      },
    ],
  },
  {
    id: 'vstrom',
    name: 'Vstrøm',
    logoSrc: '/logos/vstrom.png',
    offers: [
      {
        id: 'vstrom-ren-spot',
        providerId: 'vstrom',
        providerName: 'Vstrøm',
        providerLogoSrc: '/logos/vstrom.png',
        planName: 'Ren Spot',
        description: 'Spotpris med lave påslag og full transparens.',
        href: 'https://www.vstrom.no/renspot?utm_source=stromsjef&utm_medium=cpc&utm_campaign=renspot',
        buttonId: 'offer-vstrom-ren-spot',
        pricingType: 'spot',
        priceLabel: 'Spotpris + påslag (varierer med markedet)',
      },
    ],
  },
];

export function getAllOffers(): ProviderOffer[] {
  return providers.flatMap(p => p.offers);
}



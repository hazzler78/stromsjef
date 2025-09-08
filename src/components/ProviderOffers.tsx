import Image from 'next/image';
import TrackedButton from '@/components/TrackedButton';
import type { Provider, ProviderOffer, PricingType } from '@/data/providers';

type Props = {
  providers: Provider[];
  title?: string;
  subtitle?: string;
};

export default function ProviderOffers({ providers, title = 'Tilbud fra leverandører', subtitle }: Props) {
  const offers: ProviderOffer[] = providers.flatMap(p => p.offers);
  const byType = (type: PricingType) => offers.filter(o => o.pricingType === type);

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-2 text-center">{title}</h2>
      {subtitle ? <p className="text-gray-600 text-center mb-8">{subtitle}</p> : null}
      {/* Spotpris */}
      <h3 className="text-xl font-semibold mb-4">Spotpris</h3>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {byType('spot').map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      {/* Fastpris */}
      <h3 className="text-xl font-semibold mb-4">Fastpris</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {byType('fast').map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}

function OfferCard({ offer }: { offer: ProviderOffer }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src={offer.providerLogoSrc} width={36} height={36} alt={offer.providerName} />
        <div>
          <div className="text-sm text-gray-500">{offer.providerName}</div>
          <h3 className="text-lg font-semibold">{offer.planName}</h3>
        </div>
      </div>
      {offer.description ? (
        <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
      ) : null}
      {(offer.priceLabel || offer.bindingLabel || offer.monthlyFeeLabel) ? (
        <ul className="text-sm text-gray-700 space-y-1 mb-4">
          {offer.priceLabel ? <li>{offer.priceLabel}</li> : null}
          {offer.bindingLabel ? <li>{offer.bindingLabel}</li> : null}
          {offer.monthlyFeeLabel ? <li>{offer.monthlyFeeLabel}</li> : null}
        </ul>
      ) : null}
      <div className="mt-auto">
        <TrackedButton
          href={offer.href}
          className="inline-block bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          style={{ color: 'white' }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Gå til ${offer.providerName} – ${offer.planName}`}
          buttonId={offer.buttonId}
        >
          Se tilbud
        </TrackedButton>
      </div>
    </div>
  );
}



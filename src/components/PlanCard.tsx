import { ElectricityPlan } from '@/types/electricity';
import Link from 'next/link';
import Image from 'next/image';
import TrackedButton from './TrackedButton';

interface PlanCardProps {
  plan: ElectricityPlan;
}

const PlanCard = ({ plan }: PlanCardProps) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col relative">
      {/* Featured Banner - top right */}
      {plan.featured && (
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded shadow-md select-none rotate-12">
            Mest populær
          </div>
        </div>
      )}
      {/* Logo */}
      {plan.logoUrl && (
        <div className="absolute top-4 right-4 h-12 w-24">
          <Image
            src={plan.logoUrl}
            alt={`${plan.supplierName} logo`}
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
      <div className="flex-grow">
        <h3 className="text-xl font-bold">{plan.supplierName}</h3>
        <p className="text-md text-gray-700 mb-4">{plan.planName}</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Påslag</p>
            <p className="text-lg font-semibold">{plan.pricePerKwh} øre/kWh</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Månedsgebyr</p>
            <p className="text-lg font-semibold">{plan.monthlyFee} kr</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bindingstid</p>
            <p>{plan.bindingTimeText ? plan.bindingTimeText : (plan.bindingTime === 0 ? 'Ingen bindingstid' : `${plan.bindingTime} mnd`)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Prissone</p>
            <p>{plan.priceZone}</p>
          </div>
          {plan.terminationFee && (
            <div>
              <p className="text-sm text-gray-500">Bruddgebyr</p>
              <p>{plan.terminationFee} kr</p>
            </div>
          )}
          {plan.termsGuarantee && (
            <div>
              <p className="text-sm text-gray-500">Vilkårsgaranti</p>
              <p>{plan.termsGuarantee}</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>Månedlig etterskuddsbetaling</p>
          <p>eFaktura 0 kr / papirfaktura 8 kr</p>
          <p>Avtalen forutsetter godkjent kredittvurdering</p>
        </div>
        {plan.guaranteeDisclaimer && (
          <div className="mt-2 text-xs text-gray-500">
            <p>{plan.guaranteeDisclaimer}</p>
          </div>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-500 text-center">
        Finn billig strømavtale på{' '}
        <Link href="https://www.forbrukerradet.no/strompris/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
          Forbrukerrådets strømprisportal
        </Link>.
      </div>
      <div className="mt-6">
        <TrackedButton
          href={plan.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md text-center block hover:bg-green-600 transition-colors"
          buttonId={`plan-${plan.id}`}
        >
          Bytt nå
        </TrackedButton>
      </div>
    </div>
  );
};

export default PlanCard; 
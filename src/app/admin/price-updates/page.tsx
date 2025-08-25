'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ApiStatus {
  success: boolean;
  message: string;
  areasCount?: number;
  timestamp?: string;
}

export default function PriceUpdatesAdmin() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const router = useRouter();

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/plans/update-from-api');
      const result = await response.json();
      setApiStatus(result);
    } catch (error) {
      setApiStatus({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Prisuppdatering och API-status</h1>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Tillbaka till admin
            </button>
          </div>

          {/* Strom API Status */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Strom API Status</h2>
            <div className="bg-gray-50 p-4 rounded">
              {apiStatus ? (
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={apiStatus.success ? 'text-green-600' : 'text-red-600'}>
                      {apiStatus.success ? 'Ansluten' : 'Fel'}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Meddelande:</span> {apiStatus.message}
                  </p>
                  {apiStatus.areasCount !== undefined && (
                    <p className="text-sm">
                      <span className="font-medium">Tillgängliga prisområden:</span> {apiStatus.areasCount}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Senast kontrollerad:</span>{' '}
                    {apiStatus.timestamp ? new Date(apiStatus.timestamp).toLocaleString('nb-NO') : 'Okänd'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Laddar status...</p>
              )}
              <button
                onClick={checkApiStatus}
                className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Uppdatera status
              </button>
            </div>
          </div>

          {/* Information about Strom API */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Om Strom API</h2>
            <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Viktig information:</strong> Strom API tillhandahåller endast information om prisområden (NO1-NO5), inte produktdata.
              </p>
              <p className="text-sm text-blue-700 mb-2">
                • API:et returnerar 5 prisområden: Øst (NO1), Sør (NO2), Midt (NO3), Nord (NO4), Vest (NO5)
              </p>
              <p className="text-sm text-blue-700 mb-2">
                • Produktdata uppdateras manuellt via Telegram-bot
              </p>
              <p className="text-sm text-blue-700">
                • Automatisk prisuppdatering från Strom API är inte möjlig eftersom API:et inte innehåller produktinformation
              </p>
            </div>
          </div>

          {/* Current Update Methods */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Nuvarande uppdateringsmetoder</h2>
            <div className="bg-gray-50 p-4 rounded">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">1. Telegram-bot (Huvudmetod)</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Använd Telegram-botten för att manuellt uppdatera priser:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside ml-4">
                  <li><code>/update [leverantör] [pris] [zon] [typ]</code> - Uppdatera specifika priser</li>
                  <li><code>/prices</code> - Visa nuvarande priser</li>
                  <li><code>/reset</code> - Återställ till standardpriser</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">2. Admin-panel</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Använd admin-panelen för att redigera produkter direkt:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside ml-4">
                  <li>Redigera befintliga produkter</li>
                  <li>Lägg till nya produkter</li>
                  <li>Ta bort produkter</li>
                  <li>Hantera featured-status</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">3. Frontend auto-refresh</h3>
                <p className="text-sm text-gray-600">
                  Användargränssnittet uppdateras automatiskt var 5:e minut för att visa de senaste ändringarna.
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Schemalagd uppdatering</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Frontend uppdatering:</span> Var 5:e minut
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Produktuppdatering:</span> Manuell via Telegram-bot eller admin-panel
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Strom API:</span> Endast för validering av prisområden
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

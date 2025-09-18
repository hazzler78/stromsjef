import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const consentRaw = formData.get('consent');
    const consent = typeof consentRaw === 'string' ? consentRaw === 'true' : false;
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded or file is not a valid image.' }, { status: 400 });
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type;
    const fileSize = (file as File).size ?? buffer.length;
    
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(mimeType)) {
      return NextResponse.json({ error: 'Kun PNG og JPG støttes for øyeblikket.' }, { status: 400 });
    }

    // Convert image to base64
    const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;
    const imageSha256 = createHash('sha256').update(buffer).digest('hex');

    // Prompter: to-trinns flyt (ekstraksjon -> beregning). Norsk.
    const extractionPrompt = `Du er en ekspert på norske strømfakturaer fra ALLE strømleverandører. Oppgaven er å EKSTRAHERE ALLE kostnader fra fakturaen og strukturere dem som en JSON-array.

KRITISK – FLEKSIBILITET:
- Du MÅ håndtere fakturaer fra ALLE leverandører (Agva, Fjordkraft, Tibber, Fortum, Kraftriket, osv.)
- Ulike leverandører har forskjellige oppsett og termer – tilpass deg hver faktura
- Du skal alltid svare på norsk

EKSTRAKSJONSREGEL:
Returner en JSON-array der hvert element har:
- "name": eksakt tekst fra fakturaen (f.eks. "Fast månedsavgift", "Strømavtale årsavgift")
- "amount": beløpet i kroner fra siste/"Totalt"-kolonnen (f.eks. 31.20, 44.84) – IKKE fra "øre/kWh" eller "kr/mnd"
- "section": hvilken seksjon linjen tilhører ("Strømnett" eller "Strømhandel")
- "description": kort beskrivelse av hva kostnaden er

BELØP – VELG RIKTIG KOLONNE:
- Les ALLTID fra siste kolonne som viser sluttbeløp i kr
- Ignorer kolonner med "øre/kWh", "kr/mnd", "kr/kWh" – dette er enhetspriser

FORMATKRAV:
- Kun gyldig JSON-array (bruk doble anførselstegn, ingen trailing-komma, ingen kommentarer)
- Start med [ og slutt med ]

Svar KUN med JSON-arrayen.`;

    const calculationPrompt = `Du er en ekspert på norske strømfakturaer. Basert på JSON-dataen fra ekstraksjonen: identifiser unødvendige kostnader (kun under Strømhandel) og beregn total mulig besparelse per måned og per år. Svar som enkel, konsis tekst uten Markdown (ingen #, **, - eller nummererte lister).

REGNES SOM UNØDVENDIGE (Strømhandel):
- Månedsavgift, Fast månedsavgift, Fast avgift
- Rørlige kostnader, Rørlig kostnad
- Fast påslag, Påslag, Faste påslag
- Årsavgift, Strømavtale årsavgift
- Basavgift, Grunnavgift, Administrasjonsavgift, Abonnementsavgift
- Fakturaavgift, Kundeavgift, Strømhandelsavgift, Handelsavgift
- Indeksavgift, Elsertifikat/Elcertifikat (om oppført som egen kr-post)
- Opprinnelsesgaranti/Grønn strøm-avgift, Miljøpakke, Serviceavgift, Leverandøravgift
- Forsinkelsesrente, Påminnelsesgebyr, Priskontroll
- Profilpris/Bundet profilpris når dette er en egen post under Strømhandel

EKSKLUDER (ikke unødvendig):
- MVA, Strømoverføring (nett), Energiledd, Energiskatt, Spotpris/Strømpris (selve energiprisen)
- Forbruk, kWh, Øre/kWh, Kr/kWh

INSTRUKSJON:
1) Filtrer ut alle poster fra JSON som matcher listen over unødvendige OG har section = "Strømhandel"
2) Summer beløpene (kr) til en månedlig totalsum
3) Regn ut årlig besparelse = månedlig sum × 12
4) Presenter resultatet på norsk i enkel tekst, uten emojis og uten å gjenta totalsatser i flere ulike setninger. Bruk nøyaktig denne strukturen (radbrytninger mellom seksjoner):

"""
Unødvendige kostnader denne måneden:
[Navn 1]: [beløp] kr
[Navn 2]: [beløp] kr
...

Total unødvendige kostnader per måned: X,XX kr

Anbefaling:
Bytt til en avtale uten disse påslagene og avgiftene.
Rørlig pris – kampanje uten bindingstid i ett år, uten påslag/avgifter.
Alternativt: Velg fastpris med prisgaranti og valgfri bindingstid.

Oppsummering:
Potensiell besparelse: X,XX kr/mnd (≈ Y,YY kr/år)
"""

STIL OG FORMAT:
- Bruk norsk språk og norske tallformater (komma for desimaler, «kr» etter beløp)
- Ikke bruk emojis
- Ikke bruk Markdown-tegn (#, **, -, 1.)
- Ikke gjenta totalbeløpene flere ganger uten grunn
- Skriv kort og tydelig; unngå redundans

Svar på norsk, vennlig og pedagogisk.`;

    const openaiApiKey = process.env.OPENAI_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }

    // To-trinns: 1) Ekstraher strukturert JSON, 2) Beregn og presentér resultat
    let gptAnswer = '';

    try {
      // 1) Ekstraksjon
      const extractionRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: extractionPrompt },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Ekstraher ALLE kostnader som en JSON-array (kun JSON som svar).' },
                { type: 'image_url', image_url: { url: base64Image } }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.0,
        }),
      });

      if (extractionRes.ok) {
        const extractionData = await extractionRes.json();
        const extracted = extractionData.choices?.[0]?.message?.content || '';

        // Rens vekk ```json ... ``` om modellen har pakket svaret
        let cleanJson = extracted.trim();
        if (cleanJson.startsWith('```json')) {
          cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        }
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        // Valider JSON
        JSON.parse(cleanJson);

        // 2) Beregning/presentasjon
        const calcRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: calculationPrompt },
              { role: 'user', content: `Her er den ekstraherte JSON-dataen fra strømfakturaen:\n\n${cleanJson}\n\nAnalyser denne dataen i henhold til instruksjonene.` }
            ],
            max_tokens: 1200,
            temperature: 0.1,
          }),
        });

        if (calcRes.ok) {
          const calcData = await calcRes.json();
          gptAnswer = calcData.choices?.[0]?.message?.content || '';
        }
      }
    } catch {
      // Ignorer og fall tilbake nedenfor
    }

    // Fallback til tidligere én-trinns prompt (norsk)
    if (!gptAnswer) {
      const systemPrompt = `Du er en ekspert på norske strømregninger som identifiserer unødvendige kostnader og summerer potensiell besparelse. Svar på norsk, konsist og pedagogisk.`;

      const fallbackRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Hva betaler jeg i unødvendige kostnader? Analyser denne strømregningen i henhold til instruksjonene.' },
                { type: 'image_url', image_url: { url: base64Image } }
              ]
            }
          ],
          max_tokens: 1200,
          temperature: 0.2,
        }),
      });

      if (!fallbackRes.ok) {
        const err = await fallbackRes.text();
        return NextResponse.json({ error: 'OpenAI Vision error', details: err }, { status: 500 });
      }
      const fb = await fallbackRes.json();
      gptAnswer = fb.choices?.[0]?.message?.content || '';
    }

    // Logg analysen i Supabase
    let logId: number | null = null;
    try {
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const sessionId = req.headers.get('x-session-id') || `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
        const userAgent = req.headers.get('user-agent') || 'unknown';

        const { data: insertData, error } = await supabase
          .from('invoice_ocr')
          .insert([
            {
              session_id: sessionId,
              user_agent: userAgent,
              file_mime: mimeType,
              file_size: fileSize,
              image_sha256: imageSha256,
              model: 'gpt-4o',
              system_prompt_version: '2025-09-vision-v2-two-step-no',
              gpt_answer: gptAnswer,
              consent: consent,
            }
          ])
          .select('id')
          .single();

        if (!error && insertData) {
          logId = insertData.id as number;
          // If consent: upload file to private bucket and save reference
          if (consent) {
            try {
              const bucketName = 'invoice-ocr';
              // Ensure the storage bucket exists (create if missing)
              try {
                const { data: existingBucket, error: getBucketError } = await supabase.storage.getBucket(bucketName);
                if (getBucketError || !existingBucket) {
                  await supabase.storage.createBucket(bucketName, {
                    public: false,
                    fileSizeLimit: 20 * 1024 * 1024, // 20 MB
                    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
                  });
                }
              } catch {
                try {
                  await supabase.storage.createBucket(bucketName, {
                    public: false,
                    fileSizeLimit: 20 * 1024 * 1024,
                    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
                  });
                } catch {}
              }
              const storageKey = `${logId}/${imageSha256}.${mimeType === 'image/png' ? 'png' : 'jpg'}`;
              const uploadRes = await supabase.storage.from(bucketName).upload(storageKey, buffer, {
                contentType: mimeType,
                upsert: false,
              });
              if (!uploadRes.error) {
                await supabase.from('invoice_ocr_files').insert([
                  {
                    invoice_ocr_id: logId,
                    storage_key: storageKey,
                    image_sha256: imageSha256,
                  }
                ]);
              }
            } catch (e) {
              console.error('Failed to upload invoice image to storage:', e);
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to log invoice OCR to Supabase:', e);
    }

    return NextResponse.json({ gptAnswer, logId });
  } catch (err) {
    console.error('Unexpected error in /api/gpt-ocr:', err);
    return NextResponse.json({ error: 'Unexpected error', details: String(err) }, { status: 500 });
  }
}

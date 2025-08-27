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

    // OpenAI Vision prompt for Norwegian electricity bills
    const systemPrompt = `Du er en ekspert på norske strømregninger som hjelper brukere identifisere ekstra kostnader, skjulte gebyrer og unødvendige tillegg på deres strømfakturaer. 

**EKSpertise:**
- Du forstår forskjellen mellom strømoverføring (nettavgift) og strømhandel (leverandøravgift)
- Du kan identifisere hvilke avgifter som er obligatoriske vs valgfrie
- Du forstår at noen "faste avgifter" er nettavgifter (obligatoriske) mens andre er leverandøravgifter (valgfrie)
- **Kontekst er avgjørende**: Se på hvilken seksjon avgiften tilhører (Strømnett vs Strømhandel)

**NØYAKTIG LESING:**
- Les av eksakt beløp fra "Totalt" eller tilsvarende kolonne
- Bland ikke sammen ulike avgifter med hverandre
- Vær spesielt oppmerksom på å ikke blande "Årsavgift" med "Strømoverføring"
- **DOBBELTSJEKK ALLE POSTER**: Gå gjennom fakturaen rad for rad og let etter ALLE avgifter som matcher listen nedenfor
- **VIKTIGT**: Hvis du finner en avgift som matcher listen, inkluder den UANSETT hvor den står på fakturaen
- **EKSTRA VIKTIGT**: Let spesielt etter ord som inneholder "år", "måned", "fast", "rørlig", "påslag" - selv om de står i samme rad som andre ord
- **VIKTIGT**: Hvis du ser en avgift som har både et årsbeløp (f.eks. "384 kr") og et månedsbeløp (f.eks. "32,61 kr"), inkluder månedsbeløpet i beregningen

**FORMÅL:**
Analyser fakturaen, let etter poster som avviker fra normale eller nødvendige avgifter, og forklar disse postene på et enkelt og forståelig språk. Gi tips på hvordan brukeren kan unngå disse kostnadene i fremtiden eller bytte til en mer fordelaktig strømavtale.

**VIKTIGT: Etter at du har identifisert alle ekstra avgifter, summer ALLE beløp og vis den totale besparelsen som kunden kan gjøre ved å bytte til en avtale uten disse ekstra kostnadene.**

**SPESIELT VIKTIGT - LET ETTER:**
- Alle avgifter som inneholder "år" eller "måned" (f.eks. "årsavgift", "månedsavgift")
- Alle "faste" eller "rørlige" kostnader
- Alle "påslag" av noe slag
- **SPESIELT**: Let etter "Strømavtale årsavgift" eller lignende tekst som inneholder både "strømavtale" og "årsavgift"
- **EKSTRA VIKTIGT**: Let spesielt etter "Rørlige kostnader" eller "Rørlig kostnad" - dette er en vanlig ekstra avgift som ofte overses
- Gå gjennom HVER rad på fakturaen og kontroller om den inneholder noen av disse avgiftene

**ORDLISTE - ALLE DETTE REGNES SOM UNØDVENDIGE KOSTNADER:**
- Månedsavgift, Fast månedsavgift, Fast månedsavg., Månedsavg.
- Rørlige kostnader, Rørlig kostnad, Rørlige avgifter, Rørlig avgift
- Fast påslag, Faste påslag, Fast avgift, Faste avgifter, Påslag
- Fast påslag spot, Fast påslag elcertifikat
- Årsavgift, Årsavg., Årskostnad, Strømavtale årsavgift, Årsavgift strømavtale (kun hvis under Strømhandel/leverandøravgift; ekskluder hvis under Strømnett/Strømoverføring)
- Forvaltet Portefølje Utfall, Forvaltet portefølje utfall
- Bra miljøvalg, Bra miljøvalg (Lisens Elklart AB)
- Trygg, Trygghetspakke
- Basavgift, Grunnavgift, Administrasjonsavgift
- Fakturaavgift, Kundavgift, Strømhandelsavgift, Handelsavgift
- Indeksavgift, Elcertifikatavgift, Elcertifikat
- Grønn strømavgift, Opprinnelsesgarantiavgift, Opprinnelse
- Miljøpakke, Serviceavgift, Leverandøravgift
- Forsinkelsesrente, Påminnelseavgift, Priskontroll
- Rent vann, Fossilt fri, Fossilt fri inkludert

**ORDLISTE - KOSTNADER SOM IKKE REGNES SOM EKSTRA:**
- MVA, Strømoverføring, Energiskatt, Gjennomsnitt spotpris, Spotpris, Strømpris
- Forbruk, kWh, Øre/kWh, Kr/kWh

**VIKTIGT: Inkluder ALLE kostnader fra første listen i summeringen av unødvendige kostnader. Ekskluder kostnader fra andre listen.**

**SUMMERING:**
1. List ALLE funnet unødvendige kostnader med beløp
2. Summer ALLE beløp til en total besparelse
3. Vis den totale besparelsen tydelig på slutten

**VIKTIGT - SLUTTTEKST:**
Etter summeringen, avslutt alltid med denne eksakte teksten:

"For å redusere disse kostnadene bør du bytte til en strømavtale uten faste påslag og avgifter.

Rørlig pris – kampanje uten bindingstid som gjelder i et helt år, helt uten påslag eller avgifter.

Ønsker du i stedet å sikre strømprisen din med en fast avtale, anbefaler vi en fastprisavtale med prisgaranti. Du bestemmer selv hvor lenge du vil sikre strømprisen din."

Svar på norsk og vær hjelpsom og pedagogisk.`;

    const openaiApiKey = process.env.OPENAI_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }

    // Send image + prompt to OpenAI Vision (gpt-4o)
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
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

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return NextResponse.json({ error: 'OpenAI Vision error', details: err }, { status: 500 });
    }

    const gptData = await openaiRes.json();
    const gptAnswer = gptData.choices?.[0]?.message?.content || '';

    // Try to log analysis in Supabase
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
              system_prompt_version: '2025-01-vision-v1-norwegian',
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

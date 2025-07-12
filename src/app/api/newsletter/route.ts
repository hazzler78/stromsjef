import { NextRequest, NextResponse } from 'next/server';

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

const GROUP_ID_MAP: Record<string, string> = {
  NO1: '133272596199244877',
  NO2: '133272601424299360',
  NO3: '133272605418325520',
  NO4: '133272610115945598',
  NO5: '133272614177080571',
  Bedrift: '133272584155300909',
};

export async function POST(request: NextRequest) {
  try {
    const { email, zone, marketingConsent, name, source } = await request.json();

    if (!email || !zone) {
      return NextResponse.json(
        { error: 'Email og prissone er påkrevd' },
        { status: 400 }
      );
    }

    if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
      console.error('Mailerlite API key eller Group ID mangler i miljøvariabler');
      return NextResponse.json(
        { error: 'Konfigurasjonsfeil' },
        { status: 500 }
      );
    }

    // Select correct group ID based on zone
    const groupId = GROUP_ID_MAP[zone] || MAILERLITE_GROUP_ID;

    // Add subscriber to Mailerlite
    const mailerliteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        groups: [groupId],
        fields: {
          zone: zone,
          source: source || 'stromsjef_website',
          signup_date: new Date().toISOString(),
          marketingConsent: marketingConsent ? 'yes' : 'no',
          name: name || '',
        }
      })
    });

    if (!mailerliteResponse.ok) {
      const errorData = await mailerliteResponse.text();
      console.error('Mailerlite API error:', errorData);
      return NextResponse.json(
        { error: 'Kunne ikke melde på nyhetsbrev' },
        { status: 500 }
      );
    }

    const subscriberData = await mailerliteResponse.json();
    console.log('Successfully added subscriber to Mailerlite:', subscriberData);

    return NextResponse.json({
      success: true,
      message: 'Takk for din påmelding til nyhetsbrevet!',
      subscriber: subscriberData
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'En feil oppstod ved påmelding' },
      { status: 500 }
    );
  }
} 
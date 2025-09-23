'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const schemes = [
  {
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    description: 'A government scheme that provides income support of up to ₹6,000 per year to all landholding farmer families.',
    link: 'https://pmkisan.gov.in/',
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'A crop insurance scheme that provides comprehensive insurance coverage against crop failure, helping to stabilize farmers\' income.',
    link: 'https://pmfby.gov.in/',
  },
  {
    name: 'Kisan Credit Card (KCC)',
    description: 'A credit scheme that provides farmers with timely access to credit for their agricultural needs, including cultivation and other farming expenses.',
    link: 'https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card',
  },
  {
    name: 'Soil Health Card Scheme',
    description: 'A scheme under which the government provides farmers with soil health cards, which contain information about the nutrient status of their soil and recommendations on the appropriate dosage of nutrients to be applied for improving soil health and fertility.',
    link: 'https://soilhealth.dac.gov.in/',
  },
  {
    name: 'e-NAM (National Agriculture Market)',
    description: 'A pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.',
    link: 'https://www.enam.gov.in/web/',
  }
];

export default function GovtSchemes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Government Schemes</CardTitle>
        <CardDescription>
          Explore relevant government schemes for agriculture. Click on any scheme to learn more.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {schemes.map((scheme) => (
          <Card key={scheme.name}>
            <CardHeader>
              <CardTitle className="text-lg">{scheme.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{scheme.description}</p>
              <Button asChild>
                <Link href={scheme.link} target="_blank" rel="noopener noreferrer">
                  Learn More
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

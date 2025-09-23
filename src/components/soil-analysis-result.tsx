'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AnalyzeSoilImageOutput } from '@/ai/flows/analyze-soil-image';

type SoilAnalysisResultProps = {
  analysis: AnalyzeSoilImageOutput;
};

export default function SoilAnalysisResult({ analysis }: SoilAnalysisResultProps) {
  const suitablePlants = analysis.suitablePlants.split(',').map(s => s.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Soil Analysis Result</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <h3 className="font-semibold">Soil Type</h3>
          <p>{analysis.soilType}</p>
        </div>
        <div className="grid gap-2">
          <h3 className="font-semibold">Characteristics</h3>
          <p>{analysis.soilCharacteristics}</p>
        </div>
        <div className="grid gap-2">
          <h3 className="font-semibold">Suitable Plants</h3>
          <div className="flex flex-wrap gap-2">
            {suitablePlants.map((plant) => (
              <Badge key={plant} variant="secondary">
                {plant}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

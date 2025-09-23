import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import type { AnalyzeCropImageAndProvideDiagnosisOutput } from '@/ai/flows/analyze-crop-image-and-provide-diagnosis';

interface AnalysisResultProps {
  result: AnalyzeCropImageAndProvideDiagnosisOutput;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  if (!result?.diagnosis) {
    return null;
  }

  const { diagnosis } = result;

  const renderActions = (actions: string) => {
    const lines = actions.split('\n').filter(line => line.trim() !== '');
    return (
      <ul className="list-inside list-disc space-y-2">
        {lines.map((line, index) => (
          <li key={index}>{line.replace(/^[\d.*-]+\s*/, '')}</li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ShieldAlert className="h-8 w-8 text-accent" />
          Diagnosis Report
        </CardTitle>
        <CardDescription>
          Based on the provided information, here is the AI-driven analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <AlertCircle className="text-destructive" />
              Primary Diagnosis
            </h3>
            <p className="pt-2 pl-8 text-foreground/90">
              {diagnosis.primaryDiagnosis}
            </p>
          </div>
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                Explanation
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap text-base text-foreground/80">
                {diagnosis.explanation}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-primary" /> Recommended Actions
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-foreground/80">
                {renderActions(diagnosis.recommendedActions)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}


'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import SoilReportAnalysis from './soil-report-analysis';
import {
  analyzeSoilReport,
  SoilAnalysis,
} from '@/ai/flows/analyze-soil-report-and-recommend';

export default function SoilAnalysisForm() {
  const [reportAnalysis, setReportAnalysis] = useState<SoilAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [soilReportFile, setSoilReportFile] = useState<File | null>(null);
  const soilReportInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reportAnalysis && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [reportAnalysis]);

  const handleSoilReportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSoilReportFile(file);
      setReportAnalysis(null);
    } else {
      setSoilReportFile(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!soilReportFile) {
      toast({
        variant: 'destructive',
        title: 'No Data Provided',
        description: 'Please upload a soil data report to analyze.',
      });
      return;
    }

    setLoading(true);
    setReportAnalysis(null);

    if (soilReportFile) {
      try {
        const reportText = await soilReportFile.text();
        const result = await analyzeSoilReport({ reportText });
        setReportAnalysis(result);
      } catch (error) {
        console.error('Error analyzing soil report:', error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'Something went wrong while analyzing the soil report. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Soil Analysis</CardTitle>
          <CardDescription>
            Upload your soil data report to get an analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="soil-report">Soil Data Report</Label>
              <Input
                id="soil-report"
                type="file"
                accept=".txt,.pdf,.csv"
                onChange={handleSoilReportChange}
                ref={soilReportInputRef}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground">
                Upload a TXT, PDF or CSV file for detailed analysis.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyzeClick} disabled={loading || !soilReportFile}>
            {loading && <LoaderCircle className="animate-spin" />}
            {loading ? 'Analyzing...' : 'Analyze Soil'}
          </Button>
        </CardFooter>
      </Card>
      <div ref={resultsRef}>
        {reportAnalysis && <SoilReportAnalysis initialAnalysis={reportAnalysis} />}
      </div>
    </div>
  );
}

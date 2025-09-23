
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
import { LoaderCircle, Upload } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { analyzeSoilImage, AnalyzeSoilImageOutput } from '@/ai/flows/analyze-soil-image';
import { useToast } from '@/hooks/use-toast';
import SoilAnalysisResult from './soil-analysis-result';
import SoilReportAnalysis from './soil-report-analysis';
import {
  analyzeSoilReport,
  SoilAnalysis,
} from '@/ai/flows/analyze-soil-report-and-recommend';

export default function SoilAnalysisForm() {
  const [soilPhotoFile, setSoilPhotoFile] = useState<File | null>(null);
  const [soilPhotoPreview, setSoilPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState<AnalyzeSoilImageOutput | null>(null);
  const [reportAnalysis, setReportAnalysis] = useState<SoilAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [soilReportFile, setSoilReportFile] = useState<File | null>(null);
  const soilReportInputRef = useRef<HTMLInputElement>(null);
  const soilPhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((imageAnalysis || reportAnalysis) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [imageAnalysis, reportAnalysis]);

  const handleSoilPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSoilPhotoFile(file);
      setSoilPhotoPreview(URL.createObjectURL(file));
      setImageAnalysis(null);
      setReportAnalysis(null);
      setSoilReportFile(null);
      if (soilReportInputRef.current) {
        soilReportInputRef.current.value = '';
      }
    } else {
      setSoilPhotoFile(null);
      setSoilPhotoPreview(null);
    }
  };

  const handleSoilReportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSoilReportFile(file);
      setReportAnalysis(null);
      setImageAnalysis(null);
      setSoilPhotoFile(null);
      setSoilPhotoPreview(null);
      if (soilPhotoInputRef.current) {
        soilPhotoInputRef.current.value = '';
      }
    } else {
      setSoilReportFile(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!soilPhotoFile && !soilReportFile) {
      toast({
        variant: 'destructive',
        title: 'No Data Provided',
        description: 'Please upload a soil photo or a data report to analyze.',
      });
      return;
    }

    setLoading(true);
    setImageAnalysis(null);
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
    } else if (soilPhotoFile) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(soilPhotoFile);
        reader.onloadend = async () => {
          try {
              const base64data = reader.result as string;
              const result = await analyzeSoilImage({ photoDataUri: base64data, location });
              setImageAnalysis(result);
          } catch (error) {
              console.error('Error analyzing soil image:', error);
              toast({
                  variant: 'destructive',
                  title: 'Analysis Failed',
                  description: 'Something went wrong while analyzing the soil image. Please try again.',
              });
          } finally {
              setLoading(false);
          }
        };
        reader.onerror = () => {
          console.error('Error reading file');
          toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file. Please try again.',
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error analyzing soil image:', error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'Something went wrong while analyzing the soil image. Please try again.',
        });
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
            Upload your soil data report OR a photo of your soil to get an analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="soil-report">Soil Data Report (accurate)</Label>
              <Input
                id="soil-report"
                type="file"
                accept=".txt"
                onChange={handleSoilReportChange}
                disabled={!!soilPhotoFile}
                ref={soilReportInputRef}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground">
                Upload a TXT file for detailed analysis.
              </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex-grow border-t border-muted" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-grow border-t border-muted" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="soil-photo">Soil Photo (approx)</Label>
              <Input
                id="soil-photo"
                type="file"
                accept="image/*"
                onChange={handleSoilPhotoChange}
                disabled={!!soilReportFile}
                ref={soilPhotoInputRef}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground">
                Please upload a JPG, PNG, or other image file.
              </p>
            </div>
            {soilPhotoPreview && (
              <div className="grid gap-2">
                <Label>Image Preview</Label>
                <Image
                  src={soilPhotoPreview}
                  alt="Soil photo preview"
                  width={200}
                  height={200}
                  className="rounded-md object-cover aspect-square"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="location">Location (Optional for photo analysis)</Label>
              <Input
                id="location"
                placeholder="e.g., Coimbatore, Tamil Nadu"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!!soilReportFile}
              />
              <p className="text-xs text-muted-foreground">
                Providing a location helps the AI give more accurate recommendations with photo analysis.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyzeClick} disabled={loading || (!soilPhotoFile && !soilReportFile)}>
            {loading && <LoaderCircle className="animate-spin" />}
            {loading ? 'Analyzing...' : 'Analyze Soil'}
          </Button>
        </CardFooter>
      </Card>
      <div ref={resultsRef}>
        {imageAnalysis && <SoilAnalysisResult analysis={imageAnalysis} />}
        {reportAnalysis && <SoilReportAnalysis initialAnalysis={reportAnalysis} />}
      </div>
    </div>
  );
}

    
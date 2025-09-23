
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

export default function SoilAnalysisForm() {
  const [soilPhotoFile, setSoilPhotoFile] = useState<File | null>(null);
  const [soilPhotoPreview, setSoilPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeSoilImageOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Note: PDF analysis is a complex feature that requires a library like pdf-parse.
  // For this prototype, we'll simulate reading text from a text file.
  const [soilReportFile, setSoilReportFile] = useState<File | null>(null);

  useEffect(() => {
    if (analysis && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysis]);

  const handleSoilPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSoilPhotoFile(file);
      setSoilPhotoPreview(URL.createObjectURL(file));
      setAnalysis(null);
    } else {
      setSoilPhotoFile(null);
      setSoilPhotoPreview(null);
    }
  };

  const handleSoilReportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSoilReportFile(file);
      setAnalysis(null);
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
    setAnalysis(null);

    // Prioritize report analysis if available
    if (soilReportFile) {
        // Here you would implement the logic for the new multi-step flow.
        // For now, we will keep the existing image analysis flow.
        // A full implementation requires significant state management for the conversation steps.
        toast({
            title: "Coming Soon!",
            description: "Full soil report analysis is under development."
        });
        setLoading(false);
        return;

    } else if (soilPhotoFile) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(soilPhotoFile);
        reader.onloadend = async () => {
          try {
              const base64data = reader.result as string;
              const result = await analyzeSoilImage({ photoDataUri: base64data, location });
              setAnalysis(result);
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
              <div className="flex items-center gap-2">
                <Input id="soil-report" type="file" accept=".pdf,.csv,.txt" onChange={handleSoilReportChange} />
                <Button size="icon" variant="outline">
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a PDF, CSV, or TXT file for detailed analysis.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="soil-photo">Soil Photo (approx)</Label>
              <div className="flex items-center gap-2">
                <Input id="soil-photo" type="file" accept="image/*" onChange={handleSoilPhotoChange} />
                <Button size="icon" variant="outline">
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload</span>
                </Button>
              </div>
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
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="e.g., Coimbatore, Tamil Nadu"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Providing a location helps the AI give more accurate recommendations.
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
        {analysis && <SoilAnalysisResult analysis={analysis} />}
        {/* The new multi-step UI would be rendered here */}
      </div>
    </div>
  );
}

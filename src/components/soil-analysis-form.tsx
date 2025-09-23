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
import { useState } from 'react';
import Image from 'next/image';
import { analyzeSoilImage, AnalyzeSoilImageOutput } from '@/ai/flows/analyze-soil-image';
import { useToast } from '@/hooks/use-toast';
import SoilAnalysisResult from './soil-analysis-result';

export default function SoilAnalysisForm() {
  const [soilPhotoFile, setSoilPhotoFile] = useState<File | null>(null);
  const [soilPhotoPreview, setSoilPhotoPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeSoilImageOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleAnalyzeClick = async () => {
    if (!soilPhotoFile) {
      toast({
        variant: 'destructive',
        title: 'No Photo Selected',
        description: 'Please upload a soil photo to analyze.',
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(soilPhotoFile);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const result = await analyzeSoilImage({ photoDataUri: base64data });
        setAnalysis(result);
      };
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

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Soil Analysis</CardTitle>
          <CardDescription>
            Upload your soil data report or a photo of your soil to get an analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="soil-report">Soil Data Report (accurate)</Label>
              <div className="flex items-center gap-2">
                <Input id="soil-report" type="file" />
                <Button size="icon" variant="outline">
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Please upload a PDF or CSV file.
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
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyzeClick} disabled={loading || !soilPhotoFile}>
            {loading && <LoaderCircle className="animate-spin" />}
            {loading ? 'Analyzing...' : 'Analyze Soil'}
          </Button>
        </CardFooter>
      </Card>
      {analysis && <SoilAnalysisResult analysis={analysis} />}
    </div>
  );
}

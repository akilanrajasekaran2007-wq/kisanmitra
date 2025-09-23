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
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { indianPlants } from '@/lib/indian-plants';
import {
  identifyPestAndRecommendPesticide,
  IdentifyPestAndRecommendPesticideOutput,
} from '@/ai/flows/identify-pest-and-recommend-pesticide';
import { Badge } from './ui/badge';

export default function IdentifyPestForm() {
  const [pestPhotoFile, setPestPhotoFile] = useState<File | null>(null);
  const [pestPhotoPreview, setPestPhotoPreview] = useState<string | null>(null);
  const [cropName, setCropName] = useState('');
  const [analysis, setAnalysis] =
    useState<IdentifyPestAndRecommendPesticideOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const pestPhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (analysis && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysis]);

  const handlePestPhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPestPhotoFile(file);
      setPestPhotoPreview(URL.createObjectURL(file));
      setAnalysis(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!pestPhotoFile) {
      toast({
        variant: 'destructive',
        title: 'No Photo Provided',
        description: 'Please upload a photo of the affected plant.',
      });
      return;
    }
    if (!cropName) {
      toast({
        variant: 'destructive',
        title: 'No Crop Selected',
        description: 'Please select the affected crop.',
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(pestPhotoFile);
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          const result = await identifyPestAndRecommendPesticide({
            photoDataUri: base64data,
            cropName,
          });
          setAnalysis(result);
        } catch (error) {
          console.error('Error identifying pest:', error);
          toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description:
              'Something went wrong while analyzing the image. Please try again.',
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
      };
    } catch (error) {
      console.error('Error identifying pest:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'Something went wrong while analyzing the image. Please try again.',
      });
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Identify Pest or Disease</CardTitle>
          <CardDescription>
            Upload an image of the affected plant to identify the issue and get
            a pesticide recommendation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pest-photo">Affected Plant Photo</Label>
              <Input
                id="pest-photo"
                type="file"
                accept="image/*"
                onChange={handlePestPhotoChange}
                ref={pestPhotoInputRef}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            {pestPhotoPreview && (
              <div className="grid gap-2">
                <Label>Image Preview</Label>
                <Image
                  src={pestPhotoPreview}
                  alt="Pest photo preview"
                  width={200}
                  height={200}
                  className="rounded-md object-cover aspect-square"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="plant-name">Affected Crop</Label>
              <Select onValueChange={setCropName} value={cropName}>
                <SelectTrigger id="plant-name">
                  <SelectValue placeholder="Select a plant" />
                </SelectTrigger>
                <SelectContent>
                  {indianPlants.map(plant => (
                    <SelectItem key={plant} value={plant}>
                      {plant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyzeClick}
            disabled={loading || !pestPhotoFile || !cropName}
          >
            {loading && <LoaderCircle className="animate-spin" />}
            {loading ? 'Analyzing...' : 'Identify Pest & Recommend Pesticide'}
          </Button>
        </CardFooter>
      </Card>
      <div ref={resultsRef}>
        {analysis && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pest Identification Result</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <h3 className="font-semibold">Identified Pest/Disease</h3>
                  <p className="text-lg font-bold text-primary">
                    {analysis.pest.name}
                  </p>
                  {analysis.pest.isHarmful ? (
                     <Badge variant="destructive">Harmful</Badge>
                  ) : (
                     <Badge variant="secondary">Not Harmful</Badge>
                  )}
                </div>
                <div className="grid gap-2">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground">{analysis.pest.description}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pesticide Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <h3 className="font-semibold">Recommended Pesticide</h3>
                  <p>{analysis.pesticide.recommendation}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Suggested Brand</h3>
                  <p className="text-lg font-bold text-primary">{analysis.pesticide.brand}</p>
                </div>
                 <div>
                  <h3 className="font-semibold">Approximate Price</h3>
                  <p>{analysis.pesticide.approxPrice}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Application Method</h3>
                  <p className="text-sm text-muted-foreground">{analysis.pesticide.application}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Reasoning</h3>
                  <p className="text-sm text-muted-foreground">{analysis.pesticide.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


'use client';

import {
  recommendFertilizer,
  suggestCrops,
  SoilAnalysis,
  FertilizerRecommendation,
  CropSuggestion,
} from '@/ai/flows/analyze-soil-report-and-recommend';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { LoaderCircle } from 'lucide-react';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { indianPlants } from '@/lib/indian-plants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

enum RecommendationStep {
  Ask,
  Fertilizer,
  Crops,
}

export default function SoilReportAnalysis({
  initialAnalysis,
}: {
  initialAnalysis: SoilAnalysis;
}) {
  const [step, setStep] = useState<RecommendationStep>(RecommendationStep.Ask);
  const [loading, setLoading] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [fertilizerRec, setFertilizerRec] = useState<FertilizerRecommendation | null>(null);
  const [cropSuggestions, setCropSuggestions] = useState<CropSuggestion | null>(null);
  const { toast } = useToast();

  const handleGetFertilizer = async () => {
    if (!plantName) {
      toast({
        variant: 'destructive',
        title: 'Plant name required',
        description: 'Please select the crop that is planted.',
      });
      return;
    }
    setLoading(true);
    setFertilizerRec(null);
    try {
      const result = await recommendFertilizer({
        soilAnalysis: initialAnalysis,
        plantName,
      });
      setFertilizerRec(result);
      setStep(RecommendationStep.Fertilizer);
    } catch (error) {
      console.error('Error recommending fertilizer:', error);
      toast({
        variant: 'destructive',
        title: 'Recommendation Failed',
        description: 'Could not get a fertilizer recommendation. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestCrops = async () => {
    setLoading(true);
    setCropSuggestions(null);
    try {
      const result = await suggestCrops({ soilAnalysis: initialAnalysis });
      setCropSuggestions(result);
      setStep(RecommendationStep.Crops);
    } catch (error) {
      console.error('Error suggesting crops:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not get crop suggestions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case RecommendationStep.Ask:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Get Recommendations</CardTitle>
              <CardDescription>
                Do you have a crop already planted in this soil, or would you like suggestions for new crops?
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2 p-4 border rounded-md">
                    <Label htmlFor="plant-name" className="font-semibold">I have a crop planted</Label>
                    <p className="text-sm text-muted-foreground">Get a fertilizer recommendation for your existing crop.</p>
                    <Select onValueChange={setPlantName}>
                        <SelectTrigger id="plant-name">
                            <SelectValue placeholder="Select a plant" />
                        </SelectTrigger>
                        <SelectContent>
                            {indianPlants.map((plant) => (
                            <SelectItem key={plant} value={plant}>
                                {plant}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleGetFertilizer} disabled={loading || !plantName} className="mt-2">
                        {loading && !cropSuggestions ? <LoaderCircle className="animate-spin" /> : 'Get Fertilizer Recommendation'}
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex-grow border-t border-muted" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="flex-grow border-t border-muted" />
                </div>
                <div className="grid gap-2 p-4 border rounded-md">
                  <Label className="font-semibold">Suggest crops for me</Label>
                  <p className="text-sm text-muted-foreground">Get a list of suitable crops for your soil.</p>
                  <Button variant="secondary" onClick={handleSuggestCrops} disabled={loading} className="mt-2">
                      {loading && !fertilizerRec ? <LoaderCircle className="animate-spin" /> : 'Suggest Crops for this Soil'}
                  </Button>
                </div>
            </CardContent>
          </Card>
        );

      case RecommendationStep.Fertilizer:
        return (
          fertilizerRec && (
            <Card>
              <CardHeader>
                <CardTitle>Fertilizer Recommendation for {plantName}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <h3 className="font-semibold">Recommended Fertilizer</h3>
                  <p className="text-lg font-bold text-primary">{fertilizerRec.fertilizer}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Application Rate</h3>
                  <p>{fertilizerRec.applicationRate}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Reasoning</h3>
                  <p className="text-sm text-muted-foreground">{fertilizerRec.reasoning}</p>
                </div>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" onClick={() => setStep(RecommendationStep.Ask)}>Back to Recommendations</Button>
              </CardFooter>
            </Card>
          )
        );

      case RecommendationStep.Crops:
        return (
          cropSuggestions && (
            <Card>
              <CardHeader>
                <CardTitle>Suggested Crops for Your Soil</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Crop</TableHead>
                            <TableHead>Time Period</TableHead>
                            <TableHead>Expected Yield</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cropSuggestions.crops.map((crop) => (
                            <TableRow key={crop.name}>
                                <TableCell>
                                    <div className="font-medium">{crop.name}</div>
                                    <div className="text-sm text-muted-foreground">{crop.suitability}</div>
                                </TableCell>
                                <TableCell>{crop.timePeriod}</TableCell>
                                <TableCell>{crop.expectedYield}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" onClick={() => setStep(RecommendationStep.Ask)}>Back to Recommendations</Button>
              </CardFooter>
            </Card>
          )
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Soil Data Report Analysis</CardTitle>
          <CardDescription>
            Here is a breakdown of your soil's composition based on the provided report.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {initialAnalysis.presentComponents && initialAnalysis.presentComponents.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-lg">Available Components</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialAnalysis.presentComponents.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status.toLowerCase() === 'low'
                              ? 'destructive'
                              : item.status.toLowerCase() === 'high'
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {initialAnalysis.neededComponents && initialAnalysis.neededComponents.length > 0 && (
            <div>
                <h3 className="font-semibold mb-2 text-lg">Deficient or Unavailable Components</h3>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Deficient Nutrient</TableHead>
                    <TableHead>Recommendation</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialAnalysis.neededComponents.map((item) => (
                    <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.recommendation}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
           )}
        </CardContent>
      </Card>

      {renderCurrentStep()}
    </div>
  );
}

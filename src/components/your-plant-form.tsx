
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { indianPlants } from '@/lib/indian-plants';
import { plantVarieties } from '@/lib/plant-varieties';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

type AnalysisResult = {
  plant: string;
  variety: string | null;
  date: string;
  primaryDiagnosis: string;
  explanation: string;
  recommendedActions: string;
};

// Dummy analysis function - in a real app, this would be an AI call
const getDummyAnalysis = (plant: string, variety: string | null): Omit<AnalysisResult, 'date' | 'plant' | 'variety'> => {
  const isHealthy = Math.random() > 0.3;
  if (isHealthy) {
    return {
      primaryDiagnosis: 'Healthy',
      explanation: `The ${variety ? variety + ' ' : ''}${plant} appears to be in good health. No signs of common pests or diseases were detected based on general knowledge.`,
      recommendedActions: 'Continue with your current care routine. Monitor for any changes in leaf color, growth, or presence of insects. Ensure proper watering and sunlight.',
    };
  } else {
    const issues = ['Fungal Infection', 'Pest Infestation', 'Nutrient Deficiency'];
    const issue = issues[Math.floor(Math.random() * issues.length)];
    switch (issue) {
      case 'Fungal Infection':
        return {
          primaryDiagnosis: 'Possible Fungal Infection',
          explanation: `The plant may be suffering from a common fungal infection, such as powdery mildew or rust, which is prevalent in ${plant}. This is often caused by high humidity and poor air circulation.`,
          recommendedActions: `Apply a fungicide suitable for ${plant}. Improve air circulation around the plant. Avoid overhead watering to keep foliage dry.`,
        };
      case 'Pest Infestation':
        return {
          primaryDiagnosis: 'Possible Pest Infestation (e.g., Aphids)',
          explanation: `Small insects like aphids may be feeding on the plant, causing stress and reduced growth. This is a common issue for ${plant} in this season.`,
          recommendedActions: 'Spray the plant with insecticidal soap or neem oil. Introduce beneficial insects like ladybugs. Check surrounding plants for similar infestations.',
        };
      case 'Nutrient Deficiency':
      default:
        return {
          primaryDiagnosis: 'Possible Nutrient Deficiency (e.g., Nitrogen)',
          explanation: `Yellowing leaves or stunted growth can indicate a lack of essential nutrients like Nitrogen. The soil may be depleted, which is common after a long growing season for ${plant}.`,
          recommendedActions: 'Use a balanced, nitrogen-rich fertilizer. Consider getting a soil test for a more accurate diagnosis. Amend the soil with compost or well-rotted manure.',
        };
    }
  }
};


export default function YourPlantForm() {
  const [selectedPlant, setSelectedPlant] = useState<string>('');
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [varieties, setVarieties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load history from local storage on component mount
    const savedHistory = localStorage.getItem('plantAnalysisHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handlePlantChange = (plant: string) => {
    setSelectedPlant(plant);
    setSelectedVariety(null);
    setVarieties(plantVarieties[plant] || []);
  };

  const handleAnalyzeClick = () => {
    if (!selectedPlant) {
      toast({
        variant: 'destructive',
        title: 'No Plant Selected',
        description: 'Please select a plant to analyze.',
      });
      return;
    }
    setLoading(true);
    setAnalysisResult(null);

    // Simulate AI analysis
    setTimeout(() => {
      const analysis = getDummyAnalysis(selectedPlant, selectedVariety);
      const result: AnalysisResult = {
        plant: selectedPlant,
        variety: selectedVariety,
        date: new Date().toLocaleString(),
        ...analysis,
      };

      setAnalysisResult(result);
      const newHistory = [result, ...history];
      setHistory(newHistory);
      localStorage.setItem('plantAnalysisHistory', JSON.stringify(newHistory));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Plant</CardTitle>
          <CardDescription>
            Select your plant and its variety, then get a quick health analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="plant-name">Plant Name</Label>
              <Select onValueChange={handlePlantChange} value={selectedPlant}>
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
            {selectedPlant && varieties.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="plant-variety">Plant Variety</Label>
                <Select
                  onValueChange={setSelectedVariety}
                  value={selectedVariety || ''}
                >
                  <SelectTrigger id="plant-variety">
                    <SelectValue placeholder="Select a variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {varieties.map(variety => (
                      <SelectItem key={variety} value={variety}>
                        {variety}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyzeClick} disabled={loading || !selectedPlant}>
            {loading && <LoaderCircle className="animate-spin" />}
            {loading ? 'Analyzing...' : 'Analyze Plant Health'}
          </Button>
        </CardFooter>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Analysis Result</CardTitle>
            <CardDescription>
              Analyzed on {analysisResult.date}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Plant</h3>
              <p>{analysisResult.plant}{analysisResult.variety ? ` - ${analysisResult.variety}` : ''}</p>
            </div>
            <div>
              <h3 className="font-semibold">Primary Diagnosis</h3>
              <p className="text-lg font-bold text-primary">{analysisResult.primaryDiagnosis}</p>
            </div>
            <div>
              <h3 className="font-semibold">Explanation</h3>
              <p className="text-sm text-muted-foreground">{analysisResult.explanation}</p>
            </div>
            <div>
              <h3 className="font-semibold">Recommended Actions</h3>
              <p className="text-sm text-muted-foreground">{analysisResult.recommendedActions}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>Your past plant analyses are saved here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {history.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                      <span>{item.plant}{item.variety ? ` - ${item.variety}` : ''}</span>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                     <div>
                        <h3 className="font-semibold">Primary Diagnosis</h3>
                        <p className="text-lg font-bold text-primary">{item.primaryDiagnosis}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Explanation</h3>
                        <p className="text-sm text-muted-foreground">{item.explanation}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Recommended Actions</h3>
                        <p className="text-sm text-muted-foreground">{item.recommendedActions}</p>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

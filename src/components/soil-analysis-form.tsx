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
import { Upload } from 'lucide-react';

export default function SoilAnalysisForm() {
  return (
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
        </div>
      </CardContent>
      <CardFooter>
        <Button>Analyze Soil</Button>
      </CardFooter>
    </Card>
  );
}

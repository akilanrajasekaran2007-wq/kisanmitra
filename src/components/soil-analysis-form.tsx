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
import { useState } from 'react';
import Image from 'next/image';

export default function SoilAnalysisForm() {
  const [soilPhotoPreview, setSoilPhotoPreview] = useState<string | null>(null);

  const handleSoilPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSoilPhotoPreview(URL.createObjectURL(file));
    } else {
      setSoilPhotoPreview(null);
    }
  };

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
        <Button>Analyze Soil</Button>
      </CardFooter>
    </Card>
  );
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function IdentifyPestForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identify Pest</CardTitle>
        <CardDescription>
          Upload an image of the affected plant to identify the pest or disease.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <p>Pest identification form will go here.</p>
        </div>
      </CardContent>
    </Card>
  );
}

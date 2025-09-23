'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function GovtSchemes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Government Schemes</CardTitle>
        <CardDescription>
          Find relevant government schemes for agriculture. This section is under construction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Coming Soon</p>
        </div>
      </CardContent>
    </Card>
  );
}

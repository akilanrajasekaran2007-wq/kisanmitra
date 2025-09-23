'use client';

import {
  Card,
  CardContent,
  CardDescription,
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
import { useState } from 'react';

export default function YourPlantForm() {
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Plant</CardTitle>
        <CardDescription>
          Select your plant from the list below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="plant-name">Plant Name</Label>
            <Select onValueChange={setSelectedPlant}>
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
          </div>
          {selectedPlant && (
            <p className="text-sm text-muted-foreground">
              You selected: <strong>{selectedPlant}</strong>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

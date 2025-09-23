
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
import { plantVarieties } from '@/lib/plant-varieties';
import { useState } from 'react';

export default function YourPlantForm() {
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [varieties, setVarieties] = useState<string[]>([]);

  const handlePlantChange = (plant: string) => {
    setSelectedPlant(plant);
    setSelectedVariety(null);
    setVarieties(plantVarieties[plant] || []);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Plant</CardTitle>
        <CardDescription>
          Select your plant and its variety from the lists below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="plant-name">Plant Name</Label>
            <Select onValueChange={handlePlantChange}>
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
          {selectedPlant && varieties.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="plant-variety">Plant Variety</Label>
              <Select onValueChange={setSelectedVariety}>
                <SelectTrigger id="plant-variety">
                  <SelectValue placeholder="Select a variety" />
                </SelectTrigger>
                <SelectContent>
                  {varieties.map((variety) => (
                    <SelectItem key={variety} value={variety}>
                      {variety}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {selectedVariety && (
            <p className="text-sm text-muted-foreground">
              You selected: <strong>{selectedPlant} - {selectedVariety}</strong>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

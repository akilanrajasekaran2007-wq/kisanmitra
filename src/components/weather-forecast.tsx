'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import {
  getWeatherForecast,
  WeatherForecastOutput,
} from '@/ai/flows/get-weather-forecast';
import { LoaderCircle, Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const WeatherIcon = ({ condition }: { condition: string }) => {
  if (condition.toLowerCase().includes('rain')) {
    return <CloudRain className="h-10 w-10 text-blue-500" />;
  }
  if (condition.toLowerCase().includes('cloud')) {
    return <Cloud className="h-10 w-10 text-gray-400" />;
  }
    if (condition.toLowerCase().includes('snow')) {
    return <CloudSnow className="h-10 w-10 text-blue-200" />;
  }
  return <Sun className="h-10 w-10 text-yellow-500" />;
};

export default function WeatherForecast() {
  const [forecast, setForecast] = useState<WeatherForecastOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        // Using a dummy location for demonstration.
        // In a real app, you would get the user's location.
        const result = await getWeatherForecast({
          location: 'Delhi, India',
        });
        setForecast(result);
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center space-y-2">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
  }

  if (!forecast) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
        <CardDescription>{forecast.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full max-w-sm"
        >
          <CarouselContent>
            {forecast.daily.map((day, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4">
                    <p className="text-sm font-semibold">{day.day}</p>
                    <WeatherIcon condition={day.condition} />
                    <p className="text-lg font-bold">{day.temperature}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}

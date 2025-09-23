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
import { Cloud, Sun, CloudRain, CloudSnow, MapPin, Wind } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const WeatherIcon = ({ condition }: { condition: string }) => {
  const lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('showers')) {
    return <CloudRain className="h-10 w-10 text-blue-500" />;
  }
  if (lowerCaseCondition.includes('thunderstorm')) {
    return <Wind className="h-10 w-10 text-gray-600" />;
  }
  if (lowerCaseCondition.includes('snow')) {
    return <CloudSnow className="h-10 w-10 text-blue-200" />;
  }
  if (lowerCaseCondition.includes('cloud')) {
    return <Cloud className="h-10 w-10 text-gray-400" />;
  }
  return <Sun className="h-10 w-10 text-yellow-500" />;
};

export default function WeatherForecast() {
  const [forecast, setForecast] = useState<WeatherForecastOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWeatherForLocation = async (loc: string) => {
    try {
      setLoading(true);
      const result = await getWeatherForecast({
        location: loc,
      });
      setForecast(result);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
       toast({
        variant: 'destructive',
        title: 'Weather Error',
        description: 'Could not fetch weather data for your location.',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleLocationSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    const loc = `${latitude},${longitude}`;
    setLocation(loc);
    fetchWeatherForLocation(loc);
  };

  const handleLocationError = () => {
    toast({
      variant: 'destructive',
      title: 'Location Error',
      description: 'Could not access your location. Defaulting to Delhi, India.',
    });
    const defaultLocation = 'Delhi, India';
    setLocation(defaultLocation);
    fetchWeatherForLocation(defaultLocation);
  };


  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
    } else {
       toast({
        variant: 'destructive',
        title: 'Location Error',
        description: 'Geolocation is not supported by this browser.',
      });
      const defaultLocation = 'Delhi, India';
      setLocation(defaultLocation);
      fetchWeatherForLocation(defaultLocation);
    }
  };

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        <div key={i} className="flex flex-col items-center space-y-2 p-1">
                             <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 w-28">
                                <Skeleton className="h-5 w-12" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
  }

  if (!forecast) {
     return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Enable location to see the forecast.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={requestLocation}>
            <MapPin className="mr-2 h-4 w-4" /> Allow Location Access
          </Button>
        </CardContent>
      </Card>
    );
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
          className="w-full max-w-sm sm:max-w-xs md:max-w-sm"
        >
          <CarouselContent>
            {forecast.daily.map((day, index) => (
              <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4">
                    <p className="text-sm font-semibold">{day.day}</p>
                    <WeatherIcon condition={day.condition} />
                    <p className="text-lg font-bold">{day.temperature}</p>
                    <p className="text-xs text-muted-foreground text-center">{day.condition}</p>
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

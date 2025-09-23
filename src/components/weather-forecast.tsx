import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Cloud,
  CloudRain,
  Droplets,
  Sun,
  Thermometer,
} from 'lucide-react';

const weatherData = {
  current: {
    temp: 32,
    condition: 'Sunny',
    icon: Sun,
    humidity: 65,
  },
  forecast: [
    { day: 'Mon', temp: 33, icon: Sun },
    { day: 'Tue', temp: 31, icon: Cloud },
    { day: 'Wed', temp: 29, icon: CloudRain },
    { day: 'Thu', temp: 34, icon: Sun },
    { day: 'Fri', temp: 32, icon: Cloud },
  ],
};

const WeatherIcon = ({
  icon: Icon,
  ...props
}: {
  icon: React.ElementType;
  [key: string]: any;
}) => {
  return <Icon {...props} />;
};

export default function WeatherForecast() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
        <CardDescription>Your local weather for the coming days.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="relative">
            <WeatherIcon
              icon={weatherData.current.icon}
              className="h-24 w-24 text-yellow-400"
            />
          </div>
          <div className="flex items-start">
            <span className="text-7xl font-bold">
              {weatherData.current.temp}
            </span>
            <span className="mt-2 text-2xl font-medium">°C</span>
          </div>
          <p className="text-lg font-medium text-muted-foreground">
            {weatherData.current.condition}
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              <span>32°/24°</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              <span>{weatherData.current.humidity}% Humidity</span>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          {weatherData.forecast.map(day => (
            <div key={day.day} className="flex flex-col items-center space-y-1">
              <p className="font-medium text-muted-foreground">{day.day}</p>
              <WeatherIcon
                icon={day.icon}
                className="h-8 w-8 text-foreground/80"
              />
              <p className="font-semibold">{day.temp}°</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

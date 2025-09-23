'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching the weather forecast.
 *
 * - getWeatherForecast - A function that fetches a 7-day weather forecast.
 * - WeatherForecastInput - The input type for the getWeatherForecast function.
 * - WeatherForecastOutput - The return type for the getWeatherForecast function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WeatherForecastInputSchema = z.object({
  location: z.string().describe("The city and country, or latitude and longitude, e.g., 'San Francisco, USA' or '37.7749,-122.4194'"),
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

const DailyForecastSchema = z.object({
  day: z.string().describe('The day of the week (e.g., "Monday").'),
  temperature: z.string().describe('The temperature in Celsius (e.g., "25°C").'),
  condition: z.string().describe('A brief description of the weather condition (e.g., "Sunny", "Partly Cloudy").'),
});

const WeatherForecastOutputSchema = z.object({
  location: z.string().describe("The location for which the forecast was generated (e.g., 'San Francisco, USA')."),
  daily: z.array(DailyForecastSchema).describe('A 7-day weather forecast.'),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;


const geocodeAndFetchWeatherTool = ai.defineTool(
  {
    name: 'geocodeAndFetchWeather',
    description: 'First, determines the location name (city, country) from coordinates if provided, then returns a 7-day weather forecast for that location.',
    inputSchema: WeatherForecastInputSchema,
    outputSchema: WeatherForecastOutputSchema,
  },
  async (input) => {
    // This is a dummy tool for demonstration. In a real app, you would use a real weather API
    // and a real geocoding API.
    
    // Simple check if input is coordinates
    const isCoords = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(input.location);
    let displayLocation = input.location;

    if (isCoords) {
        // Dummy reverse geocoding
        const [lat, lon] = input.location.split(',');
        console.log(`(Dummy) Reverse geocoding for lat: ${lat}, lon: ${lon}`);
        // In a real app, you'd call a geocoding service here.
        // For this example, we'll just create a plausible-looking location.
        displayLocation = 'Your Current Location';
    } else {
        // If it's not coordinates, we assume it's already a readable location like "Delhi, India".
        console.log(`Fetching dummy weather for ${input.location}`);
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Showers', 'Thunderstorms'];
    const today = new Date().getDay();

    const daily = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (today + i) % 7;
      return {
        day: days[dayIndex],
        temperature: `${Math.floor(Math.random() * 15) + 20}°C`, // More realistic temperature range
        condition: conditions[Math.floor(Math.random() * conditions.length)],
      };
    });

    return {
      location: displayLocation,
      daily,
    };
  }
);


export async function getWeatherForecast(
  input: WeatherForecastInput
): Promise<WeatherForecastOutput> {
  return getWeatherForecastFlow(input);
}

const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: WeatherForecastInputSchema,
    outputSchema: WeatherForecastOutputSchema,
  },
  async (input) => {
    // Directly call the tool for robust execution
    return await geocodeAndFetchWeatherTool(input);
  }
);

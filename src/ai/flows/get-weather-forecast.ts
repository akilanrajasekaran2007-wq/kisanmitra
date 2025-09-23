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
  location: z.string().describe("The city and country, e.g., 'San Francisco, USA'"),
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

const DailyForecastSchema = z.object({
  day: z.string().describe('The day of the week (e.g., "Monday").'),
  temperature: z.string().describe('The temperature in Celsius (e.g., "25°C").'),
  condition: z.string().describe('A brief description of the weather condition (e.g., "Sunny", "Partly Cloudy").'),
});

const WeatherForecastOutputSchema = z.object({
  location: z.string().describe("The location for which the forecast was generated."),
  daily: z.array(DailyForecastSchema).describe('A 7-day weather forecast.'),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;


// This is a dummy tool for demonstration purposes.
// In a real application, you would replace this with a call to a real weather API.
const getDailyWeatherForecast = ai.defineTool(
    {
      name: 'getDailyWeatherForecast',
      description: 'Returns a 7-day weather forecast for a given location.',
      inputSchema: WeatherForecastInputSchema,
      outputSchema: WeatherForecastOutputSchema,
    },
    async (input) => {
        console.log(`Fetching dummy weather for ${input.location}`);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Showers'];
        const today = new Date().getDay();

        const daily = Array.from({ length: 7 }, (_, i) => {
            const dayIndex = (today + i) % 7;
            return {
                day: days[dayIndex],
                temperature: `${Math.floor(Math.random() * 10) + 25}°C`,
                condition: conditions[Math.floor(Math.random() * conditions.length)],
            };
        });

      return {
        location: input.location,
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
    return getDailyWeatherForecast(input);
  }
);
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing holistic recommendations to farmers, integrating AI analysis
 *   of crop images with soil data and weather forecasts to advise on pest control, irrigation, and fertilization.
 *
 * - getHolisticRecommendationBasedOnAnalysis - A function that orchestrates the process of gathering AI analysis,
 *     soil data, and weather forecasts to generate holistic recommendations.
 * - HolisticRecommendationInput - The input type for the getHolisticRecommendationBasedOnAnalysis function.
 * - HolisticRecommendationOutput - The return type for the getHolisticRecommendationBasedOnAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HolisticRecommendationInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  farmLocation: z.object({
    latitude: z.number().describe('Latitude of the farm location.'),
    longitude: z.number().describe('Longitude of the farm location.'),
  }).describe('The geographical location of the farm.'),
  userNotes: z.string().describe('Any notes or observations from the farmer.'),
  analysisDocumentId: z.string().describe('The ID of the analysis document in Firestore.'),
});
export type HolisticRecommendationInput = z.infer<typeof HolisticRecommendationInputSchema>;

const HolisticRecommendationOutputSchema = z.object({
  recommendations: z.string().describe('Holistic recommendations for the farmer.'),
});
export type HolisticRecommendationOutput = z.infer<typeof HolisticRecommendationOutputSchema>;

export async function getHolisticRecommendationBasedOnAnalysis(
  input: HolisticRecommendationInput
): Promise<HolisticRecommendationOutput> {
  return getHolisticRecommendationBasedOnAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'holisticRecommendationPrompt',
  input: {schema: HolisticRecommendationInputSchema},
  output: {schema: HolisticRecommendationOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the following information, provide holistic recommendations to the farmer.

Crop Name: {{{cropName}}}
Farm Location: Latitude: {{{farmLocation.latitude}}}, Longitude: {{{farmLocation.longitude}}}
Farmer's Notes: {{{userNotes}}}
AI Analysis Document ID: {{{analysisDocumentId}}}

Consider the AI analysis, soil data, and weather forecasts to provide personalized advice on pest/disease control, irrigation, and fertilization. Provide actionable steps.

Return your analysis in a structured JSON format.`,
});

const getHolisticRecommendationBasedOnAnalysisFlow = ai.defineFlow(
  {
    name: 'getHolisticRecommendationBasedOnAnalysisFlow',
    inputSchema: HolisticRecommendationInputSchema,
    outputSchema: HolisticRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

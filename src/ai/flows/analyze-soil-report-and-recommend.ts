'use server';
/**
 * @fileOverview Analyzes a soil data report and provides recommendations.
 *
 * - analyzeSoilReport - Analyzes the soil composition from a text report.
 * - recommendFertilizer - Recommends fertilizer based on soil analysis and crop.
 * - suggestCrops - Suggests suitable crops for the soil with details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema for Soil Analysis Output
const SoilAnalysisSchema = z.object({
  presentComponents: z.array(z.object({
    name: z.string().describe('Name of the nutrient/component'),
    value: z.string().describe('Value of the nutrient (e.g., "25 ppm", "6.8")'),
    status: z.string().describe('Status of the nutrient (e.g., "Low", "High", "Optimal")'),
  })).describe('List of components present in the soil.'),
  neededComponents: z.array(z.object({
    name: z.string().describe('Name of the deficient nutrient'),
    recommendation: z.string().describe('Recommended action or percentage needed.'),
  })).describe('List of components that are deficient and need to be added.'),
});
export type SoilAnalysis = z.infer<typeof SoilAnalysisSchema>;

// Schema for Fertilizer Recommendation Output
const FertilizerRecommendationSchema = z.object({
  fertilizer: z.string().describe('The name of the recommended fertilizer (e.g., "20-20-20 NPK")'),
  applicationRate: z.string().describe('The recommended application rate (e.g., "100 kg/hectare").'),
  reasoning: z.string().describe('A brief explanation for the recommendation.'),
});
export type FertilizerRecommendation = z.infer<typeof FertilizerRecommendationSchema>;

// Schema for Crop Suggestion Output
const CropSuggestionSchema = z.object({
  crops: z.array(z.object({
    name: z.string().describe('Name of the suggested crop.'),
    timePeriod: z.string().describe('The approximate time from planting to harvest.'),
    expectedYield: z.string().describe('The typical yield per unit area (e.g., "4-5 tons/hectare").'),
    suitability: z.string().describe('Why this crop is suitable for the given soil conditions.'),
  })),
});
export type CropSuggestion = z.infer<typeof CropSuggestionSchema>;

// Input for analyzing the report
const AnalyzeSoilReportInputSchema = z.object({
  reportText: z.string().describe('The text content of the soil data report.'),
});
export type AnalyzeSoilReportInput = z.infer<typeof AnalyzeSoilReportInputSchema>;

// Input for recommending fertilizer
const RecommendFertilizerInputSchema = z.object({
  soilAnalysis: SoilAnalysisSchema.describe('The result of the soil analysis.'),
  plantName: z.string().describe('The name of the crop that is already planted.'),
});
export type RecommendFertilizerInput = z.infer<typeof RecommendFertilizerInputSchema>;

// Input for suggesting crops
const SuggestCropsInputSchema = z.object({
  soilAnalysis: SoilAnalysisSchema.describe('The result of the soil analysis.'),
});
export type SuggestCropsInput = z.infer<typeof SuggestCropsInputSchema>;


// 1. Flow to analyze the soil report text
const analyzeSoilReportPrompt = ai.definePrompt({
  name: 'analyzeSoilReportPrompt',
  input: {schema: AnalyzeSoilReportInputSchema},
  output: {schema: SoilAnalysisSchema},
  prompt: `You are a soil analysis expert. Analyze the following soil data report text.
  Identify all key chemical components available in the soil, their values, and their status (e.g., Low, High, Optimal).
  Then, identify which components are not available or are at deficient levels and provide a recommendation for what is needed.

  Soil Report:
  {{{reportText}}}

  Return the analysis in the specified JSON format, with available components in 'presentComponents' and unavailable/deficient ones in 'neededComponents'.
  `,
});

const analyzeSoilReportFlow = ai.defineFlow(
  {
    name: 'analyzeSoilReportFlow',
    inputSchema: AnalyzeSoilReportInputSchema,
    outputSchema: SoilAnalysisSchema,
  },
  async (input) => {
    const {output} = await analyzeSoilReportPrompt(input);
    return output!;
  }
);

export async function analyzeSoilReport(input: AnalyzeSoilReportInput): Promise<SoilAnalysis> {
  return analyzeSoilReportFlow(input);
}


// 2. Flow to recommend fertilizer
const recommendFertilizerPrompt = ai.definePrompt({
  name: 'recommendFertilizerPrompt',
  input: {schema: RecommendFertilizerInputSchema},
  output: {schema: FertilizerRecommendationSchema},
  prompt: `You are an agronomist. Based on the provided soil analysis and the currently planted crop, recommend a suitable fertilizer.

  Soil Analysis:
  Present Components:
  {{#each soilAnalysis.presentComponents}}
  - {{name}}: {{value}} ({{status}})
  {{/each}}
  Needed Components:
  {{#each soilAnalysis.neededComponents}}
  - {{name}}: {{recommendation}}
  {{/each}}

  Planted Crop: {{{plantName}}}

  Provide a specific fertilizer recommendation, its application rate, and the reasoning.
  Return the recommendation in the specified JSON format.
  `,
});

const recommendFertilizerFlow = ai.defineFlow(
  {
    name: 'recommendFertilizerFlow',
    inputSchema: RecommendFertilizerInputSchema,
    outputSchema: FertilizerRecommendationSchema,
  },
  async (input) => {
    const {output} = await recommendFertilizerPrompt(input);
    return output!;
  }
);

export async function recommendFertilizer(input: RecommendFertilizerInput): Promise<FertilizerRecommendation> {
  return recommendFertilizerFlow(input);
}


// 3. Flow to suggest crops
const suggestCropsPrompt = ai.definePrompt({
  name: 'suggestCropsPrompt',
  input: {schema: SuggestCropsInputSchema},
  output: {schema: CropSuggestionSchema},
  prompt: `You are an agricultural expert. Based on the provided soil analysis, suggest a list of suitable crops.

  Soil Analysis:
  Present Components:
  {{#each soilAnalysis.presentComponents}}
  - {{name}}: {{value}} ({{status}})
  {{/each}}
  Needed Components:
  {{#each soilAnalysis.neededComponents}}
  - {{name}}: {{recommendation}}
  {{/each}}

  For each suggested crop, provide the common time period for its growth cycle (planting to harvest) and the expected yield. Also explain its suitability.
  Return the suggestions in the specified JSON format.
  `,
});

const suggestCropsFlow = ai.defineFlow(
  {
    name: 'suggestCropsFlow',
    inputSchema: SuggestCropsInputSchema,
    outputSchema: CropSuggestionSchema,
  },
  async (input) => {
    const {output} = await suggestCropsPrompt(input);
    return output!;
  }
);

export async function suggestCrops(input: SuggestCropsInput): Promise<CropSuggestion> {
  return suggestCropsFlow(input);
}

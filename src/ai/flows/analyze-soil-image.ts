'use server';
/**
 * @fileOverview Analyzes a soil image and provides information about it.
 *
 * - analyzeSoilImage - A function that handles the soil image analysis.
 * - AnalyzeSoilImageInput - The input type for the analyzeSoilImage function.
 * - AnalyzeSoilImageOutput - The return type for the analyzeSoilImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSoilImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of soil, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  location: z.string().optional().describe('The location where the soil sample was taken.'),
});
export type AnalyzeSoilImageInput = z.infer<
  typeof AnalyzeSoilImageInputSchema
>;

const AnalyzeSoilImageOutputSchema = z.object({
  soilType: z.string().describe('The type of the soil (e.g., Sandy, Clay, Loamy, etc.).'),
  soilCharacteristics: z.string().describe('The key characteristics of the soil based on the image.'),
  suitablePlants: z
    .string()
    .describe('A comma-separated list of plants that are suitable for this type of soil.'),
});
export type AnalyzeSoilImageOutput = z.infer<
  typeof AnalyzeSoilImageOutputSchema
>;

export async function analyzeSoilImage(
  input: AnalyzeSoilImageInput
): Promise<AnalyzeSoilImageOutput> {
  return analyzeSoilImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSoilImagePrompt',
  input: {schema: AnalyzeSoilImageInputSchema},
  output: {schema: AnalyzeSoilImageOutputSchema},
  prompt: `You are an expert soil scientist. Analyze the provided image of soil.
{{#if location}}
The soil sample was taken from: {{{location}}}. Use this location to inform your analysis about regional soil characteristics and climate, which will affect suitable plants.
{{/if}}

Based on the visual evidence in the image and the provided location (if available), determine the following:
1.  **Soil Type**: Identify the primary type of soil (e.g., Clay, Sandy, Loam, Silt, Peat, Chalky).
2.  **Soil Characteristics**: Describe the visible characteristics, such as texture, color, and structure.
3.  **Suitable Plants**: Suggest a list of plants that are well-suited to grow in this type of soil and climate.

Return your analysis in the specified JSON format.

Image: {{media url=photoDataUri}}`,
});

const analyzeSoilImageFlow = ai.defineFlow(
  {
    name: 'analyzeSoilImageFlow',
    inputSchema: AnalyzeSoilImageInputSchema,
    outputSchema: AnalyzeSoilImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

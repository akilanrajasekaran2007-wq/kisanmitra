'use server';
/**
 * @fileOverview Identifies a pest from an image and recommends a pesticide.
 *
 * - identifyPestAndRecommendPesticide - A function that handles the pest identification and pesticide recommendation.
 * - IdentifyPestAndRecommendPesticideInput - The input type for the function.
 * - IdentifyPestAndRecommendPesticideOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPestAndRecommendPesticideInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the affected plant or pest, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropName: z.string().describe('The name of the affected crop.'),
});
export type IdentifyPestAndRecommendPesticideInput = z.infer<
  typeof IdentifyPestAndRecommendPesticideInputSchema
>;

const IdentifyPestAndRecommendPesticideOutputSchema = z.object({
  pest: z.object({
    name: z.string().describe('The common name of the identified pest or disease.'),
    description: z.string().describe('A brief description of the pest or disease, including its typical impact on the crop.'),
    isHarmful: z.boolean().describe('Whether the identified pest or disease is harmful to the crop.'),
  }),
  pesticide: z.object({
    recommendation: z.string().describe('The recommended chemical or organic pesticide to treat the issue.'),
    brand: z.string().describe('A popular and effective brand name for the recommended pesticide available in the local market.'),
    application: z.string().describe('Instructions on how to apply the pesticide.'),
    approxPrice: z.string().describe('The approximate market price for the recommended pesticide brand (e.g., "₹300-400 per 250ml").'),
    reasoning: z.string().describe('Why this pesticide is recommended for this specific issue.'),
  }),
});
export type IdentifyPestAndRecommendPesticideOutput = z.infer<
  typeof IdentifyPestAndRecommendPesticideOutputSchema
>;

export async function identifyPestAndRecommendPesticide(
  input: IdentifyPestAndRecommendPesticideInput
): Promise<IdentifyPestAndRecommendPesticideOutput> {
  return identifyPestAndRecommendPesticideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPestAndRecommendPesticidePrompt',
  input: {schema: IdentifyPestAndRecommendPesticideInputSchema},
  output: {schema: IdentifyPestAndRecommendPesticideOutputSchema},
  prompt: `You are an expert entomologist and plant pathologist specializing in Indian agriculture. Analyze the provided image of a '{{cropName}}' plant.

Your tasks are:
1.  **Identify the Pest/Disease**: Identify the primary pest or disease visible in the image. Describe it and determine if it's harmful.
2.  **Recommend a Pesticide**: Based on your identification, recommend the most effective pesticide.
3.  **Suggest a Brand**: Provide a well-known, effective brand name for this pesticide that is commonly available in India.
4.  **Provide Application Instructions**: Explain how the farmer should apply the pesticide.
5.  **Estimate Price**: Give an approximate price range for the suggested brand in Indian Rupees (₹).
6.  **Explain Your Reasoning**: Briefly explain why you are recommending this specific solution.

Return your complete analysis in the specified JSON format.

Image of affected {{cropName}}:
{{media url=photoDataUri}}`,
});

const identifyPestAndRecommendPesticideFlow = ai.defineFlow(
  {
    name: 'identifyPestAndRecommendPesticideFlow',
    inputSchema: IdentifyPestAndRecommendPesticideInputSchema,
    outputSchema: IdentifyPestAndRecommendPesticideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

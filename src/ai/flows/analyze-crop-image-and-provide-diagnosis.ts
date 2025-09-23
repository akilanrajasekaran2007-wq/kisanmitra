'use server';
/**
 * @fileOverview Analyzes a crop image and provides a diagnosis of potential issues.
 *
 * - analyzeCropImageAndProvideDiagnosis - A function that handles the analysis and diagnosis process.
 * - AnalyzeCropImageAndProvideDiagnosisInput - The input type for the analyzeCropImageAndProvideDiagnosis function.
 * - AnalyzeCropImageAndProvideDiagnosisOutput - The return type for the analyzeCropImageAndProvideDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCropImageAndProvideDiagnosisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropName: z.string().describe('The name of the crop.'),
  farmLocation: z.string().describe('The location of the farm (GeoPoint).'),
  userNotes: z.string().describe('Any additional observations from the farmer.'),
});
export type AnalyzeCropImageAndProvideDiagnosisInput = z.infer<
  typeof AnalyzeCropImageAndProvideDiagnosisInputSchema
>;

const AnalyzeCropImageAndProvideDiagnosisOutputSchema = z.object({
  diagnosis: z.object({
    primaryDiagnosis: z.string().describe('The primary diagnosis of the crop issue.'),
    explanation: z.string().describe('The reasoning behind the diagnosis.'),
    recommendedActions: z
      .string()
      .describe('Immediate, actionable steps for the farmer to take.'),
  }),
});
export type AnalyzeCropImageAndProvideDiagnosisOutput = z.infer<
  typeof AnalyzeCropImageAndProvideDiagnosisOutputSchema
>;

export async function analyzeCropImageAndProvideDiagnosis(
  input: AnalyzeCropImageAndProvideDiagnosisInput
): Promise<AnalyzeCropImageAndProvideDiagnosisOutput> {
  return analyzeCropImageAndProvideDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCropImageAndProvideDiagnosisPrompt',
  input: {schema: AnalyzeCropImageAndProvideDiagnosisInputSchema},
  output: {schema: AnalyzeCropImageAndProvideDiagnosisOutputSchema},
  prompt: `You are an expert agronomist. Analyze the attached image of a {{cropName}} from a farm located near {{farmLocation}}. The farmer has noted: '{{userNotes}}'.

Your task is to:
1.  Identify any visible signs of pests, diseases, or nutrient deficiencies in the image.
2.  Based on all the provided data (image, crop type, location), provide a primary diagnosis.
3.  Explain your reasoning.
4.  Suggest immediate, actionable steps the farmer should take.
5.  Return your analysis in a structured JSON format.

Image: {{media url=photoDataUri}}`,
});

const analyzeCropImageAndProvideDiagnosisFlow = ai.defineFlow(
  {
    name: 'analyzeCropImageAndProvideDiagnosisFlow',
    inputSchema: AnalyzeCropImageAndProvideDiagnosisInputSchema,
    outputSchema: AnalyzeCropImageAndProvideDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

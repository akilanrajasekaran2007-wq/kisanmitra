'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching relevant government schemes for farmers.
 *
 * - getGovtSchemes - A function that fetches a list of government schemes based on optional filters.
 * - GetGovtSchemesInput - The input type for the getGovtSchemes function.
 * - GetGovtSchemesOutput - The return type for the getGovtSchemes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetGovtSchemesInputSchema = z.object({
  cropName: z.string().optional().describe('The name of the crop the farmer is growing.'),
  location: z.string().optional().describe('The farmer\'s state or region to find location-specific schemes.'),
  farmerCategory: z.string().optional().describe('The category of the farmer (e.g., small, marginal, woman).'),
});
export type GetGovtSchemesInput = z.infer<typeof GetGovtSchemesInputSchema>;

const SchemeSchema = z.object({
    name: z.string().describe('The official name of the government scheme.'),
    description: z.string().describe('A brief, clear summary of what the scheme offers and who it is for.'),
    benefits: z.string().describe('The key benefits provided by the scheme (e.g., financial support, insurance, subsidy).'),
    eligibility: z.string().describe('The main eligibility criteria for farmers to apply.'),
    link: z.string().url().describe('The direct URL to the official government page for the scheme.'),
});

const GetGovtSchemesOutputSchema = z.object({
  schemes: z.array(SchemeSchema).describe('A list of relevant government schemes.'),
});
export type GetGovtSchemesOutput = z.infer<typeof GetGovtSchemesOutputSchema>;

export async function getGovtSchemes(
  input: GetGovtSchemesInput
): Promise<GetGovtSchemesOutput> {
  return getGovtSchemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getGovtSchemesPrompt',
  input: {schema: GetGovtSchemesInputSchema},
  output: {schema: GetGovtSchemesOutputSchema},
  prompt: `You are an expert on Indian agricultural policies and government schemes for farmers. Your task is to provide a list of relevant government schemes based on the provided criteria.

  {{#if cropName}}
  The farmer is growing: {{{cropName}}}
  {{/if}}
  {{#if location}}
  The farmer is located in: {{{location}}}
  {{/if}}
  {{#if farmerCategory}}
  The farmer's category is: {{{farmerCategory}}}
  {{/if}}

  Based on the information above, provide a list of the most relevant schemes. For each scheme, include:
  1. The official name.
  2. A brief description.
  3. The key benefits.
  4. The main eligibility criteria.
  5. A direct link to the official government website.

  Prioritize schemes that are currently active and most beneficial. If no specific criteria are provided, return a list of the top 5-7 most popular and impactful national-level agricultural schemes in India.

  Return your response in the specified JSON format.`,
});

const getGovtSchemesFlow = ai.defineFlow(
  {
    name: 'getGovtSchemesFlow',
    inputSchema: GetGovtSchemesInputSchema,
    outputSchema: GetGovtSchemesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

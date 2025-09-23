'use server';

import { z } from 'zod';
import {
  analyzeCropImageAndProvideDiagnosis,
  type AnalyzeCropImageAndProvideDiagnosisOutput,
} from '@/ai/flows/analyze-crop-image-and-provide-diagnosis';

const formSchema = z.object({
  cropName: z.string().min(1, 'Crop name is required.'),
  location: z.string().min(1, 'Location is required.'),
  userNotes: z.string().optional(),
});

export async function getAnalysis(
  prevState: any,
  formData: FormData
): Promise<{
  success: boolean;
  data: AnalyzeCropImageAndProvideDiagnosisOutput | null;
  error: string | null;
}> {
  const imageFile = formData.get('image') as File;
  if (!imageFile || imageFile.size === 0) {
    return { success: false, data: null, error: 'An image is required.' };
  }

  const validatedFields = formSchema.safeParse({
    cropName: formData.get('cropName'),
    location: formData.get('location'),
    userNotes: formData.get('userNotes'),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages)[0]?.[0];
    return {
      success: false,
      data: null,
      error: firstError ?? 'Invalid form data.',
    };
  }

  const { cropName, location, userNotes } = validatedFields.data;

  try {
    const photoDataUri = await new Promise<string>((resolve, reject) => {
      imageFile
        .arrayBuffer()
        .then(buffer => {
          const base64 = Buffer.from(buffer).toString('base64');
          resolve(`data:${imageFile.type};base64,${base64}`);
        })
        .catch(reject);
    });

    const aiInput = {
      photoDataUri,
      cropName,
      farmLocation: location,
      userNotes: userNotes ?? 'No additional notes.',
    };

    const result = await analyzeCropImageAndProvideDiagnosis(aiInput);

    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Error getting analysis:', error);
    return {
      success: false,
      data: null,
      error: 'Failed to get analysis from AI. Please try again.',
    };
  }
}

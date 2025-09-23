import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-crop-image-and-provide-diagnosis.ts';
import '@/ai/flows/get-holistic-recommendation-based-on-analysis.ts';
import '@/ai/flows/analyze-soil-image.ts';
import '@/ai/flows/analyze-soil-report-and-recommend.ts';
import '@/ai/flows/identify-pest-and-recommend-pesticide.ts';
import '@/ai/flows/get-govt-schemes.ts';

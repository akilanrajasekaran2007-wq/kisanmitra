import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-crop-image-and-provide-diagnosis.ts';
import '@/ai/flows/get-holistic-recommendation-based-on-analysis.ts';
import { AIValidationResult, OutdoorChallenge } from '../types';

export interface GenerateChallengeResponse {
  challenge: OutdoorChallenge;
  source: 'gemma_4_openweight' | 'curated_fallback';
  aiEnabled: boolean;
  modelUsed?: string;
  notice?: string;
}

export async function fetchOutdoorChallenge(options?: { category?: string }): Promise<GenerateChallengeResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('/api/challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: options?.category,
        nonce: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data: GenerateChallengeResponse = await res.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[TouchGrass Client] API challenge generation error:', error?.message || error);
    
    // Dynamic client-level fallback with random choice
    const fallbackPool = [
      {
        id: `offline-sky-${Date.now()}`,
        title: 'Frame a Towering Cloud Edge',
        description: 'Step outside into open air, look straight up at the sky, and photograph a clean shot of a cloud edge against daylight.',
        suggestedDurationMinutes: 2,
        evidenceType: 'photo' as const,
        category: 'light_sky' as const,
        safetyTip: 'Never look directly at the sun. Protect your eyes.',
        tags: ['sky', 'clouds', 'daylight'],
      },
      {
        id: `offline-shadow-${Date.now()}`,
        title: 'Track the Longest Daylight Shadow',
        description: 'Look across the sidewalk or lawn. Find the longest or sharpest shadow cast by a fence, post, or tree, and photograph the projection.',
        suggestedDurationMinutes: 3,
        evidenceType: 'photo' as const,
        category: 'light_sky' as const,
        safetyTip: 'Stay on clear walking pathways and remain aware of your surroundings.',
        tags: ['shadows', 'sunlight', 'geometry'],
      },
      {
        id: `offline-bark-${Date.now()}`,
        title: 'Tree Bark Mountain Ranges',
        description: 'Walk to the closest tree. Get a macro photograph of the deep ridges, moss, or peeling patterns along its bark.',
        suggestedDurationMinutes: 3,
        evidenceType: 'photo' as const,
        category: 'textures' as const,
        safetyTip: 'Watch for exposed tree roots on the ground before snapping.',
        tags: ['trees', 'texture', 'macro'],
      },
      {
        id: `offline-moss-${Date.now()}`,
        title: 'Micro-Forest in a Pavement Crack',
        description: 'Look down at a sidewalk, patio, or driveway seam. Find tiny green moss or clover pushing through concrete, and photograph the micro-world.',
        suggestedDurationMinutes: 3,
        evidenceType: 'photo' as const,
        category: 'patterns' as const,
        safetyTip: 'Crouch safely out of any bicycle or vehicle paths.',
        tags: ['urban-nature', 'moss', 'patterns'],
      },
      {
        id: `offline-colors-${Date.now()}`,
        title: 'Spot Three Distinct Shades of Green',
        description: 'Step outside and locate three distinctly different green shades in plants, grass, or foliage. Photograph the most vibrant one.',
        suggestedDurationMinutes: 4,
        evidenceType: 'photo' as const,
        category: 'color_hunt' as const,
        safetyTip: 'Stay within public walkways and watch your footing.',
        tags: ['nature', 'greens', 'observation'],
      },
    ];

    const chosenFallback = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];

    return {
      challenge: {
        ...chosenFallback,
        source: 'curated_fallback',
      },
      source: 'curated_fallback',
      aiEnabled: false,
      notice: 'Operating in client fallback mode due to network availability.',
    };
  }
}

// Resize and optimize image to ensure fast transfer and stay well within Vercel's 4.5MB payload limit
async function resizeImageForApi(base64: string, maxDimension = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !base64.startsWith('data:image')) {
      resolve(base64);
      return;
    }

    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };

    img.onerror = () => {
      resolve(base64);
    };

    img.src = base64;
  });
}

export async function validateOutdoorEvidence(
  imageBase64: string,
  task: OutdoorChallenge
): Promise<AIValidationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    // Compress and downscale before sending to Vercel/server
    const optimizedBase64 = await resizeImageForApi(imageBase64);

    const res = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: optimizedBase64,
        task,
        captureTimestamp: Date.now(),
        mimeType: 'image/jpeg',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Validation server returned HTTP ${res.status}`);
    }

    const result: AIValidationResult = await res.json();
    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[TouchGrass Client] API validation error:', error?.message || error);
    // STRICT REJECTION on error: never falsely pass an unverified photo
    return {
      passed: false,
      confidence: 0,
      reason: 'Could not clearly verify the outdoor subject from this image.',
      feedback: 'Verification could not confirm the required outdoor subject. Please take a clear photo outside focusing on the assignment.',
      aiEnabled: false,
    };
  }
}

let isInitialized = false;

export async function ensureDbInitialized(): Promise<void> {
  if (isInitialized) return;
  // Live database initialized with zero static data
  isInitialized = true;
}

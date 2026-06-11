import { PostHog } from "posthog-node";

export const createPostHogServer = () => {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) {
    // Return a mock object if PostHog is not configured in the environment
    return {
      capture: () => {},
      shutdown: async () => {},
    } as unknown as PostHog;
  }

  return new PostHog(key, {
    host: host,
    flushAt: 1, // Send immediately
    flushInterval: 0, // No batching for short-lived functions
  });
};

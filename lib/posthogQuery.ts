import { createInsforgeServer } from "./insforge-server";

export interface ChartDataPoint {
  date?: string;
  day?: string;
  count: number;
}

export interface MatchScoreRange {
  range: string;
  count: number;
}

export interface DashboardChartsData {
  jobsFoundData: ChartDataPoint[];
  matchScoreData: MatchScoreRange[];
  companyResearchData: ChartDataPoint[];
}

export interface PostHogQueryResult {
  results?: unknown[][];
}

/**
 * Fetch dashboard charts data.
 * Tries querying PostHog events via HogQL first if credentials are set,
 * and falls back to database aggregation otherwise.
 */
export async function getDashboardChartsData(userId: string): Promise<DashboardChartsData> {
  const personalKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (personalKey && projectId) {
    try {
      console.log(`[posthogQuery] Fetching charts data from PostHog API for user ${userId}`);

      // 1. Jobs Found Over Time (last 30 days)
      const jobsFoundHogQL = `
        SELECT toDate(timestamp) as day, count() as count 
        FROM events 
        WHERE event = 'job_found' 
          AND distinct_id = '${userId}' 
          AND timestamp >= now() - INTERVAL 30 DAY 
        GROUP BY day 
        ORDER BY day ASC
      `;

      // 2. Match Score Distribution
      const matchScoreHogQL = `
        SELECT JSONExtractInt(properties, 'matchScore') as score, count() as count 
        FROM events 
        WHERE event = 'job_found' 
          AND distinct_id = '${userId}' 
        GROUP BY score
      `;

      // 3. Company Research Activity (last 7 days)
      const companyResearchHogQL = `
        SELECT toDate(timestamp) as day, count() as count 
        FROM events 
        WHERE event = 'company_researched' 
          AND distinct_id = '${userId}' 
          AND timestamp >= now() - INTERVAL 7 DAY 
        GROUP BY day 
        ORDER BY day ASC
      `;

      const [jobsFoundRes, matchScoreRes, companyResearchRes] = await Promise.all([
        queryPostHogHogQL(host, projectId, personalKey, jobsFoundHogQL),
        queryPostHogHogQL(host, projectId, personalKey, matchScoreHogQL),
        queryPostHogHogQL(host, projectId, personalKey, companyResearchHogQL),
      ]);

      return processPostHogResults(jobsFoundRes, matchScoreRes, companyResearchRes);
    } catch (err) {
      console.error("[posthogQuery] PostHog query failed, falling back to database queries:", err);
      return getDashboardChartsDataFromDb(userId);
    }
  }

  // Fallback to database queries
  return getDashboardChartsDataFromDb(userId);
}

/**
 * Sends a HogQL query to the PostHog API
 */
async function queryPostHogHogQL(
  host: string,
  projectId: string,
  personalKey: string,
  queryStr: string
): Promise<PostHogQueryResult> {
  const url = `${host.replace(/\/$/, "")}/api/projects/${projectId}/query/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${personalKey}`,
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query: queryStr.trim(),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PostHog Query API error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<PostHogQueryResult>;
}

/**
 * Process raw PostHog results into standardized formats
 */
function processPostHogResults(
  jobsFoundRaw: PostHogQueryResult,
  matchScoreRaw: PostHogQueryResult,
  companyResearchRaw: PostHogQueryResult
): DashboardChartsData {
  // --- 1. Jobs Found Over Time (last 30 days) ---
  const jobsFoundMap = new Map<string, number>();
  if (jobsFoundRaw && Array.isArray(jobsFoundRaw.results)) {
    jobsFoundRaw.results.forEach((row) => {
      if (Array.isArray(row) && row.length >= 2) {
        const dayStr = String(row[0]).split("T")[0]; // YYYY-MM-DD
        const count = Number(row[1]) || 0;
        jobsFoundMap.set(dayStr, count);
      }
    });
  }

  const jobsFoundData: ChartDataPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const rawDate = d.toISOString().split("T")[0];
    jobsFoundData.push({
      date: dateStr,
      count: jobsFoundMap.get(rawDate) || 0,
    });
  }

  // --- 2. Match Score Distribution ---
  const matchScoreMap = {
    "50-60%": 0,
    "60-70%": 0,
    "70-80%": 0,
    "80-90%": 0,
    "90-100%": 0,
  };

  if (matchScoreRaw && Array.isArray(matchScoreRaw.results)) {
    matchScoreRaw.results.forEach((row) => {
      if (Array.isArray(row) && row.length >= 2) {
        const score = Number(row[0]) || 0;
        const count = Number(row[1]) || 0;
        if (score >= 90) matchScoreMap["90-100%"] += count;
        else if (score >= 80) matchScoreMap["80-90%"] += count;
        else if (score >= 70) matchScoreMap["70-80%"] += count;
        else if (score >= 60) matchScoreMap["60-70%"] += count;
        else if (score >= 50) matchScoreMap["50-60%"] += count;
      }
    });
  }

  const matchScoreData: MatchScoreRange[] = [
    { range: "50-60%", count: matchScoreMap["50-60%"] },
    { range: "60-70%", count: matchScoreMap["60-70%"] },
    { range: "70-80%", count: matchScoreMap["70-80%"] },
    { range: "80-90%", count: matchScoreMap["80-90%"] },
    { range: "90-100%", count: matchScoreMap["90-100%"] },
  ];

  // --- 3. Company Research Activity (last 7 days) ---
  const researchMap = new Map<string, number>();
  if (companyResearchRaw && Array.isArray(companyResearchRaw.results)) {
    companyResearchRaw.results.forEach((row) => {
      if (Array.isArray(row) && row.length >= 2) {
        const dayStr = String(row[0]).split("T")[0]; // YYYY-MM-DD
        const count = Number(row[1]) || 0;
        researchMap.set(dayStr, count);
      }
    });
  }

  const companyResearchData: ChartDataPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const rawDate = d.toISOString().split("T")[0];
    companyResearchData.push({
      day: dayName,
      count: researchMap.get(rawDate) || 0,
    });
  }

  return {
    jobsFoundData,
    matchScoreData,
    companyResearchData,
  };
}

/**
 * Fetch and aggregate chart data directly from InsForge database tables.
 */
export async function getDashboardChartsDataFromDb(userId: string): Promise<DashboardChartsData> {
  console.log(`[posthogQuery] Fetching and aggregating chart data from InsForge DB for user ${userId}`);
  const insforge = await createInsforgeServer();

  // Fetch all jobs for user to build the charts
  const { data: jobs, error } = await insforge.database
    .from("jobs")
    .select("found_at, match_score, company_research")
    .eq("user_id", userId);

  if (error || !jobs) {
    console.error("[posthogQuery] Failed to fetch fallback jobs from database:", error);
    return {
      jobsFoundData: [],
      matchScoreData: [],
      companyResearchData: [],
    };
  }

  // --- 1. Jobs Found Over Time (last 30 days) ---
  const jobsFoundMap = new Map<string, number>();
  const jobsFoundList = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const rawDate = d.toISOString().split("T")[0];
    jobsFoundMap.set(rawDate, 0);
    jobsFoundList.push({ date: dateStr, count: 0, rawDate });
  }

  // --- 2. Match Score Distribution ---
  const matchScoreMap = {
    "50-60%": 0,
    "60-70%": 0,
    "70-80%": 0,
    "80-90%": 0,
    "90-100%": 0,
  };

  // --- 3. Company Research Activity (last 7 days) ---
  const researchMap = new Map<string, number>();
  const researchList = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const rawDate = d.toISOString().split("T")[0];
    researchMap.set(rawDate, 0);
    researchList.push({ day: dayName, count: 0, rawDate });
  }

  // Aggregate
  jobs.forEach((job) => {
    const dateStr = job.found_at;
    if (!dateStr) return;

    const dateOnly = dateStr.split("T")[0]; // YYYY-MM-DD

    // 1. Jobs Found
    if (jobsFoundMap.has(dateOnly)) {
      jobsFoundMap.set(dateOnly, (jobsFoundMap.get(dateOnly) || 0) + 1);
    }

    // 2. Match Score
    const score = Number(job.match_score) || 0;
    if (score >= 90) matchScoreMap["90-100%"]++;
    else if (score >= 80) matchScoreMap["80-90%"]++;
    else if (score >= 70) matchScoreMap["70-80%"]++;
    else if (score >= 60) matchScoreMap["60-70%"]++;
    else if (score >= 50) matchScoreMap["50-60%"]++;

    // 3. Company Research
    if (job.company_research !== null) {
      if (researchMap.has(dateOnly)) {
        researchMap.set(dateOnly, (researchMap.get(dateOnly) || 0) + 1);
      }
    }
  });

  const jobsFoundData = jobsFoundList.map((item) => ({
    date: item.date,
    count: jobsFoundMap.get(item.rawDate) || 0,
  }));

  const matchScoreData = [
    { range: "50-60%", count: matchScoreMap["50-60%"] },
    { range: "60-70%", count: matchScoreMap["60-70%"] },
    { range: "70-80%", count: matchScoreMap["70-80%"] },
    { range: "80-90%", count: matchScoreMap["80-90%"] },
    { range: "90-100%", count: matchScoreMap["90-100%"] },
  ];

  const companyResearchData = researchList.map((item) => ({
    day: item.day,
    count: researchMap.get(item.rawDate) || 0,
  }));

  return {
    jobsFoundData,
    matchScoreData,
    companyResearchData,
  };
}

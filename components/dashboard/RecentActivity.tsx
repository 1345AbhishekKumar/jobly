import React from "react";
import { Clock } from "lucide-react";

interface Activity {
  title: string;
  time: string;
  desc: string;
  dotColor: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[420px]">
      <div className="flex items-center justify-between mb-5 border-b border-border pb-3">
        <h3 className="text-base font-semibold text-text-primary font-display flex items-center gap-2">
          <Clock className="h-4.5 w-4.5 text-text-secondary" />
          Recent Activity
        </h3>
        <span className="text-xs font-medium text-text-muted">Live Stream</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {activities.length > 0 ? (
          <div className="relative border-l-2 border-border pl-4 ml-2.5 space-y-6">
            {activities.map((activity, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Timeline dot */}
                <span
                  className={`absolute -left-[23px] top-1.5 flex h-2.5 w-2.5 rounded-full ring-4 ${activity.dotColor}`}
                />
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-semibold text-text-primary leading-tight">
                    {activity.title}
                  </h4>
                  <span className="text-[10px] text-text-muted shrink-0">
                    {activity.time}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-normal">
                  {activity.desc}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 text-text-muted h-full">
            <svg
              className="h-10 w-10 text-text-muted/60 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium">No activity recorded yet</p>
            <p className="text-xs mt-1">
              Actions you perform will show up in this timeline
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

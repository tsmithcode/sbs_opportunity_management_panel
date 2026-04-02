import { SeedBundle } from "./types";

export function daysAgoIso(daysAgo: number, hour = 10, minute = 0): string {
  const value = new Date();
  value.setDate(value.getDate() - daysAgo);
  value.setHours(hour, minute, 0, 0);
  return value.toISOString();
}

export function markBundleTimeline(
  bundle: SeedBundle,
  input: {
    createdDaysAgo: number;
    updatedDaysAgo: number;
    checkpointDaysAgo: number[];
    taskDaysAgo: number[];
    memoDaysAgo: number[];
    correspondenceDaysAgo: number[];
    artifactDaysAgo: number[];
  },
) {
  bundle.opportunity.created_at = daysAgoIso(input.createdDaysAgo, 9, 15);
  bundle.opportunity.updated_at = daysAgoIso(input.updatedDaysAgo, 16, 10);
  bundle.profile.updated_at = daysAgoIso(Math.max(input.updatedDaysAgo, 1), 11, 20);

  bundle.artifacts.forEach((artifact, index) => {
    artifact.created_at = daysAgoIso(input.artifactDaysAgo[index] ?? input.updatedDaysAgo, 10, 45);
  });
  bundle.checkpoints.forEach((checkpoint, index) => {
    checkpoint.created_at = daysAgoIso(input.checkpointDaysAgo[index] ?? input.updatedDaysAgo, 13, 10);
  });
  bundle.tasks.forEach((task, index) => {
    const taskDay = input.taskDaysAgo[index] ?? input.updatedDaysAgo;
    task.created_at = daysAgoIso(taskDay, 14, 0);
    task.due_at = daysAgoIso(Math.max(taskDay - 2, 0), 17, 0);
  });
  bundle.memos.forEach((memo, index) => {
    memo.created_at = daysAgoIso(input.memoDaysAgo[index] ?? input.updatedDaysAgo, 15, 20);
  });
  bundle.correspondence.forEach((item, index) => {
    item.created_at = daysAgoIso(input.correspondenceDaysAgo[index] ?? input.updatedDaysAgo, 11, 40);
  });
}

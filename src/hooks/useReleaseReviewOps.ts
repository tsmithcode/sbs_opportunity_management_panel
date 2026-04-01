import { useMonyawn } from "../context/MonyawnContext";

export function useReleaseReviewOps() {
  const { patchState } = useMonyawn();

  const removeReleaseArtifactReview = (reviewId: string) => {
    patchState(
      (current) => ({
        ...current,
        releaseArtifactReviews: current.releaseArtifactReviews.filter(
          (item) => item.review_id !== reviewId,
        ),
      }),
      "Stored release/readiness review removed.",
    );
  };

  const toggleReleaseArtifactReviewPin = (reviewId: string) => {
    patchState(
      (current) => ({
        ...current,
        releaseArtifactReviews: current.releaseArtifactReviews.map((item) =>
          item.review_id === reviewId ? { ...item, pinned: !item.pinned } : item,
        ),
      }),
      "Stored release/readiness review pin state updated.",
    );
  };

  const clearReleaseArtifactReviewsForCurrentOpportunity = (selectedAccountId: string, selectedOpportunityId: string) => {
    patchState(
      (current) => ({
        ...current,
        releaseArtifactReviews: current.releaseArtifactReviews.filter(
          (item) =>
            !(
              item.account_id === selectedAccountId &&
              item.opportunity_id === selectedOpportunityId
            ),
        ),
      }),
      "Stored release/readiness reviews cleared for the current opportunity.",
    );
  };

  return {
    removeReleaseArtifactReview,
    toggleReleaseArtifactReviewPin,
    clearReleaseArtifactReviewsForCurrentOpportunity,
  };
}

import { useAuth } from "../contexts/AuthContext";

// Whether the signed-in ArcGIS user belongs to a given group.
// Reads from AuthContext (groups are fetched once on sign-in).
// Returns { hasAccess, checking }.
// Note: this gates the UI only — the real guard is the feature service's
// editing permission, which ArcGIS enforces server-side on save.
const useGroupAccess = (groupId) => {
  const { isAuthenticated, groupsLoading, isInGroup } = useAuth();
  return {
    hasAccess: isAuthenticated && isInGroup(groupId),
    checking: isAuthenticated && groupsLoading,
  };
};

export default useGroupAccess;

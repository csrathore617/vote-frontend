export function hasAdminRole(roles?: readonly string[] | null): boolean {
  return roles?.some((role) => role.replace(/^ROLE_/i, "").toUpperCase() === "ADMIN") ?? false;
}
export function validateUserId(userId: string | undefined): userId is string {
  return typeof userId === 'string' && userId.length > 0;
}

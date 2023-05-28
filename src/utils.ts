export async function retry(
  operation: () => Promise<boolean>,
  retries: number,
  delay: number
): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    if (await operation()) {
      return true
    }
    await new Promise((r) => setTimeout(r, delay))
  }

  return false
}

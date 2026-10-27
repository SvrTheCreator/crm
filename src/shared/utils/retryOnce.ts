export async function retryOnce<T extends { error: unknown }>(
    request: () => Promise<T>,
    delay = 700,
): Promise<T> {
    const response = await request();
    if (response.error === null) return response;

    await new Promise((resolve) => setTimeout(resolve, delay));
    return request();
}

/**
 * @description 获取`package.json`
 */
export async function pkg() {
    const fs = await import('fs').then((res) => res.default);
    return JSON.parse(fs.readFileSync('package.json', 'utf-8'));
}

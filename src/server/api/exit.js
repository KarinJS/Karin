import { app } from '../app';
import { auth } from '../auth';
app.get('/exit', async (req, res) => {
    if (!auth.getAuth(req)) {
        res.status(401).json({ message: '无效的token' });
        return;
    }
    logger.mark('收到退出请求，正在退出...');
    res.json({ message: '退出成功' });
    const { processExit } = await import('@/core/internal/process');
    await processExit(0);
});

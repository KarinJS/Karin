import { app } from '../app';
import { auth } from '../auth';
import { restartDirect } from '@/utils/system/restart';
app.get('/restart', async (req, res) => {
    if (!auth.getAuth(req)) {
        res.status(401).json({ message: '无效的token' });
        return;
    }
    res.status(200).end();
    restartDirect();
});

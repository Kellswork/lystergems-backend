import { Router } from 'express';

import registerRoute from './user/user.route';

const router = Router();

router.use('/', registerRoute);

export default router;

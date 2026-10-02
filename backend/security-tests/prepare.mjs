import { copyFileSync } from 'node:fs';
copyFileSync(new URL('../../firestore.rules', import.meta.url), new URL('./firestore.rules', import.meta.url));
copyFileSync(new URL('../../storage.rules', import.meta.url), new URL('./storage.rules', import.meta.url));

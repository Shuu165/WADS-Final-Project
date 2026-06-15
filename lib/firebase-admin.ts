import { App, cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

function getAdminApp(): App {
    if (getApps().length > 0) return getApp();
    
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    
    if (!projectId || !clientEmail || !privateKey) {
        return initializeApp({ projectId: 'placeholder' });
    }
    
    return initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
    });
}

let _adminAuth: Auth | null = null;

export const adminAuth = {
    verifySessionCookie: (...args: Parameters<Auth['verifySessionCookie']>) => {
        if (!_adminAuth) _adminAuth = getAuth(getAdminApp());
        return _adminAuth.verifySessionCookie(...args);
    },
    createSessionCookie: (...args: Parameters<Auth['createSessionCookie']>) => {
        if (!_adminAuth) _adminAuth = getAuth(getAdminApp());
        return _adminAuth.createSessionCookie(...args);
    },
};
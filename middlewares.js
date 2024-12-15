export const GlobalMiddleware = ('/', (req, res, next) => {
    if(req.session.user)
    {
         if(req.session.user.role==="user") console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (Authenticated Administrator User)`);
         else console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (Authenticated User)`);
    }
    else console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (Non-Authenticated)`);
    next();
});
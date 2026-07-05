export const HOMEPAGE = "/home"
export const SIGNINPAGE = "/signin"
export const CATS = "/cats";
export const FACTORS = "/life-stage-factors"
export const AUTH = "/auth/local"
export const DIETS = "/diets"
export const DIET_SCHEDULES = "/diet-schedules"
export const CONSUMPTIONS = "/consumptions"
export const INTRUSION_ALERTS = "/intrusion-alerts"

export const catRegenerateDietPath = (catDocumentId: string) => `${CATS}/${catDocumentId}/regenerate-diet`
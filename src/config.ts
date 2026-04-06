/**
 * App-wide brand and configuration constants.
 * All values are read from VITE_ env vars at build time.
 * Set them in your .env file (or CI environment).
 */

export const APP_NAME        = import.meta.env.VITE_APP_NAME        || "App";
export const APP_NAME_UPPER  = APP_NAME.toUpperCase();
export const TOKEN_NAME      = import.meta.env.VITE_TOKEN_NAME      || "Token";
export const API_BASE_URL    = import.meta.env.VITE_API_URL         || "https://api.example.com";
export const APP_DOMAIN      = import.meta.env.VITE_APP_DOMAIN      || "example.com";
export const COMPANY_NAME    = import.meta.env.VITE_COMPANY_NAME    || "App Technologies, Inc.";
export const COMPANY_ADDRESS = import.meta.env.VITE_COMPANY_ADDRESS || "651 N Broad Street, Suite 206, Middletown, Delaware 19709, USA";
export const SUPPORT_EMAIL   = import.meta.env.VITE_SUPPORT_EMAIL   || `support@${APP_DOMAIN}`;
export const PRIVACY_EMAIL   = import.meta.env.VITE_PRIVACY_EMAIL   || `privacy@${APP_DOMAIN}`;
export const LEGAL_EMAIL     = import.meta.env.VITE_LEGAL_EMAIL     || `legal@${APP_DOMAIN}`;
export const CAREERS_EMAIL   = import.meta.env.VITE_CAREERS_EMAIL   || `careers@${APP_DOMAIN}`;
export const SECURITY_EMAIL  = import.meta.env.VITE_SECURITY_EMAIL  || `security@${APP_DOMAIN}`;
export const DOWNLOAD_URL    = import.meta.env.VITE_DOWNLOAD_URL    || `/${APP_NAME}.apk`;
export const TELEGRAM_URL    = import.meta.env.VITE_TELEGRAM_URL    || "";
export const DISCORD_URL     = import.meta.env.VITE_DISCORD_URL     || "";
export const TWITTER_URL     = import.meta.env.VITE_TWITTER_URL     || "";
export const MEDIUM_URL      = import.meta.env.VITE_MEDIUM_URL      || "";
export const TELEGRAM_SUPPORT= import.meta.env.VITE_TELEGRAM_SUPPORT|| "";

export const LOCAL_STORAGE_USER_KEY = "app_user";

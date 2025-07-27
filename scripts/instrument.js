// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
require('dotenv').config();
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

// Debug: Check if DSN is loaded
console.log('SENTRY_DSN:', process.env.SENTRY_DSN ? 'Loaded' : 'Missing');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is evaluated only once per SDK.init call
    profileSessionSampleRate: 0.1,
    // Trace lifecycle automatically enables profiling during active traces
    profileLifecycle: 'trace',

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});

// Profiling happens automatically after setting it up with `Sentry.init()`.
// All spans (unless those discarded by sampling) will have profiling data attached to them.
// Sentry.startSpan({
//     name: "My Span",
// }, () => {
//        The code executed here will be profiled
// });
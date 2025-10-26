"use strict";

const https = require("https");
const { URL } = require("url");

const WARRANTY_API_BASE =
  process.env.WARRANTY_API_BASE || "https://gswapi.gscrm.ir";
const WARRANTY_API_TOKEN = process.env.WARRANTY_API_TOKEN || "";

function httpGetJson(urlString, headers = {}, timeoutMs = 7000) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const req = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: "GET",
        headers: {
          Accept: "application/json",
          ...headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          const status = res.statusCode || 0;
          if (status < 200 || status >= 300) {
            const err = new Error(`Upstream responded with status ${status}`);
            err.status = status;
            err.body = body;
            return reject(err);
          }
          try {
            const json = body ? JSON.parse(body) : null;
            resolve(json);
          } catch (e) {
            const err = new Error("Failed to parse JSON from upstream");
            err.cause = e;
            return reject(err);
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("Request timed out"));
    });
    req.end();
  });
}

exports.inquiry = async (serial) => {
  if (!WARRANTY_API_TOKEN) {
    const err = new Error("Warranty API token not configured");
    err.status = 500;
    throw err;
  }
  const base = WARRANTY_API_BASE.replace(/\/$/, "");
  const url = `${base}/api/warranty/inquiry/${encodeURIComponent(serial)}`;
  const data = await httpGetJson(url, {
    Authorization: `Token ${WARRANTY_API_TOKEN}`,
  });
  return Array.isArray(data) ? data : [];
};

import http from "k6/http";
import { check } from "k6";


export let options = {
  stages: [
    { duration: "1m", target: 100 }, // Ramp up to 1000 virtual users over 1 minute
    { duration: "3m", target: 100 }, // Stay at 1000 virtual users for 3 minutes
    { duration: "1m", target: 0 }, // Ramp down to 0 virtual users over 1 minute
  ],
  thresholds: {
    "http_req_duration{status:200}": ["p(95)<200"], // 95% of requests must complete within 200ms
    "http_req_duration{status:401}": ["p(95)<400"], // 95% of requests must complete within 400ms for incorrect login
  },
  summaryTrendStats: ["avg", "p(95)", "max"],
};

const BASE_URL = "https://staging-kii-main.web.app";

export default function () {
  // Correct login
  let correctResponse = http.post(`${BASE_URL}/auth/login`, {
    email: "ihtisham_khattak@nextpak.org",
    password: "Test@123",
  });

  const correctUser = check(correctResponse, {
    "Correct login status is 200": (res) => res.status === 200,
  });

  if (!correctUser) {
    fail("Correct credentials check failed");
  }

  // Incorrect login
  let incorrectResponse = http.post(`${BASE_URL}/login`, {
    email: "ihtisham_khattak@nextpak.org",
    password: "incorrectpassword",
  });

  check(incorrectResponse, {
    "Incorrect login status is 401": (res) => res.status === 401,
  });

}

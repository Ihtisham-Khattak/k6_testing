// === Load Testing ===
// https://k6.io/docs/test-types/load-testing/

//API for testing: https://test-api.k6.io/auth/token/login/

import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  // Let's simulating a normal day
  // to resemble your normal and peak conditions more closely.
  // In that case you could configure the load test to stay at 60(will use 6 for the demo) users
  // for most of the day, and ramp-up to 100 users during the peak hours of operation,
  // then ramp-down back to normal load
  vus: 10,

  stages: [
    { duration: "1m", target: 6 },
    { duration: "1m", target: 6 },
    { duration: "1m", target: 10 },
    { duration: "1m", target: 10 },
    { duration: "1m", target: 6 },
    { duration: "1m", target: 6 },
    { duration: "1m", target: 0 },
  ],

  //Threshold documentation: https://k6.io/docs/using-k6/thresholds/
  // * Thresholds are the pass/fail criteria that you define for your test metrics.
  // * If the performance of the system under test (SUT) does not meet the conditions of your threshold, the test will finish with a failed status.
  // * If your smoke test produces any errors, you should either correct the script or fix your environment before you continue.
  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
  },

  //k6 login cloud -t 4060058a77338bd7d88e6c112d01482dde030632befb2750f48b8ee121fe1f06
  //k6 run -o cloud smoke.js if I want to send this to k6 cloud
  ext: {
    loadimpact: {
      projectID: 3629234,
      // Test runs with the same name groups test runs together
      name: "Load demo",
    },
  },
};

const BASE_URL = "https://kii-main-staging.web.app/auth/login";
// const FIRSTNAME = "Wajid";
// const LASTNAME = "Rahul";
// const YEAR = 1998;
// const MONTH = 12;
// const DATE = 10;
const EMAIL = "ihtisham_khattak@nextpak.org";
const PASSWORD = "Test@13";

export default () => {
  const loginCred = http.post(
    `${BASE_URL}/l-amborhini/offerID=z9Q7bwt3OaZKDYAqoob7/`,
    {
      // firstName: FIRSTNAME,
      // lastName: LASTNAME,
      // password: PASSWORD,
      // year: YEAR,
      // month: MONTH,
      // date: DATE,
      email: EMAIL,
      password: PASSWORD,
    }
  );

  check(loginCred, {
    "logged in successfully": (resp) => resp.json("access") !== "",
  });

  // Creating an object with the authentication headers to be send in the next GET request.
  // const authHeaders = {
  //   headers: {
  //     Authorization: `Bearer ${loginRes.json("access")}`,
  //   },
  // };
  sleep(1);
};

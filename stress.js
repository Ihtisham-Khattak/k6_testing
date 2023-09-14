import http from "k6/http";
import { sleep } from "k6";

export const options = {
  scenarios: {
    stress: {
      executor: "ramping-arrival-rate",
      //Number of VUs to pre-allocate before test start to preserve runtime resources.
      preAllocatedVUs: 500,
      timeUnit: "1s",
      // Period of time to apply the startRate to the stages' target value.
      // Its value is constant for the whole duration of the scenario, it is not possible to change it for a specific stage.
      stages: [
        { duration: "2m", target: 10 }, // below normal load
        { duration: "5m", target: 10 },
        { duration: "2m", target: 20 }, // normal load
        { duration: "5m", target: 20 },
        { duration: "2m", target: 30 }, // around the breaking point
        { duration: "5m", target: 30 },
        { duration: "2m", target: 40 }, // beyond the breaking point
        { duration: "5m", target: 40 },
        { duration: "10m", target: 0 }, // scale down. Recovery stage.
      ],
    },
  },
  //k6 login cloud -t 4060058a77338bd7d88e6c112d01482dde030632befb2750f48b8ee121fe1f06
  //k6 run -o cloud smoke.js if I want to send this to k6 cloud
  ext: {
    loadimpact: {
      projectID: 3629234,
      // Test runs with the same name groups test runs together
      name: "Smoke demo",
    },
  },
};

export default function () {
  const BASE_URL = "https://volangua-staging-front.herokuapp.com"; // make sure this is not production
  // -> https://k6.io/docs/javascript-api/k6-http/batch/
  // Batch multiple HTTP requests together to issue them in parallel over multiple TCP connections.
  const responses = http.batch([
    ["GET", `${BASE_URL}/en/teachers/english/`],
    ["GET", `${BASE_URL}/en/teachers/urdu/`],
    ["GET", `${BASE_URL}/en/teachers/pashto,%20pushto/`],
    ["GET", `${BASE_URL}/en/teachers/german/`],
  ]);
}

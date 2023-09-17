import http from "k6/http";
import { check, sleep } from "k6";

const API_URL =
  "https://kiese-ratings-backend-f0b816f52143.herokuapp.com/account";

export let option = {
  stages: [
    { duration: "10s", target: 100 }, //below normal load
    { duration: "20s", target: 200 }, // normal load
    { duration: "10s", target: 300 }, // around the breaking point
    { duration: "10s", target: 400 }, // beyond the breaking point
  ],
};

export default function () {
  let response = http.get(`${API_URL}`);

  check(response, {
    "Check that response status code is 200": (r) => r.status == 200,
  });

  sleep(0.5);
}

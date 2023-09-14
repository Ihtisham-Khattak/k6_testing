import http from "k6/http";

export const options = {
  scenarios: {
    my_scenario1: {
      executor: "constant-arrival-rate",
      duration: "30s", // total duration
      preAllocatedVUs: 100, // to allocate runtime resources     preAll
      rate: 50, // number of constant iterations given `timeUnit`
      timeUnit: "1s",
    },
  },
  thresholds: {
    http_req_duration: ["p(90)<500"],
  },
};

export default function () {
  const payload = JSON.stringify({
    class_id: 274,
    comment: "Firebase Reveiw",
    rating: 3.75,
    teacher_id: 3770,
  });

  const headers = { "Content-Type": "application/json" };
  http.get("https://travos-backend-test.herokuapp.com/organization/all"),
    check(response, {
      "Post Status is 200 Ok": (res) => {
        res.status == 200;
      },
    });
}

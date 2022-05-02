import { TIMEOUT_SEC } from "./config";

const timeout = s => {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 429) {
        wait(10000, AJAX, url, uploadData);
        return;
      } else throw new Error(`${data.message} (${res.status})`);
    }

    const msg = `Deu o ${uploadData ? "POST" : "GET"}!`;

    //alert(msg);
    console.log(msg);
    return data;
  } catch (err) {
    throw err;
  }
};

function wait(milliseconds, foo, args) {
  setTimeout(function () {
    foo(args); // will be executed after the specified time
  }, milliseconds);
}

import { TIMEOUT_SEC } from "./config";

const timeout = s => {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJson = async url => {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 429) {
        wait(10000, getJson, url);
        return;
      } else throw new Error(`${data.message} (${res.status})`);
    }
    // alert("Deu!");
    console.log("Deu o GET!");
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJson = async (url, uploadData) => {
  try {
    const fetchPro = fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 429) {
        wait(10000, getJson, url);
        return;
      } else throw new Error(`${data.message} (${res.status})`);
    }
    //alert("Deu!");
    console.log("Deu o POST!");
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

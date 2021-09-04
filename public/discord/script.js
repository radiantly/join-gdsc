const nameInp = document.querySelector(".name");
const submitBtn = document.querySelector(".btn");

const handleInput = () => {
  submitBtn.classList[
    /^[a-z .'-]{3,32}$/i.test(nameInp.value) ? "remove" : "add"
  ]("disabled");
  submitBtn.href = `https://discord.com/api/oauth2/authorize?client_id=882963154122993674&redirect_uri=https%3A%2F%2Fdscase.tech%2Fdiscord&response_type=token&scope=identify%20guilds.join&state=${encodeURIComponent(
    btoa(nameInp.value).replace(/=/g, "")
  )}`;
};

document.querySelector(".name").addEventListener("input", handleInput);

const parseHash = () =>
  (location.hash?.slice(1) || "").split("&").reduce((obj, str) => {
    const [key, val] = str.split("=", 2);
    console.log(key, val);
    if (key && val) obj[key] = decodeURIComponent(val);
    return obj;
  }, {});

const { access_token, state } = parseHash();
console.log(location.hash);

if (access_token && state) {
  const nick = atob(state);
  nameInp.value = nick;
  nameInp.disabled = true;
  submitBtn.classList.add("disabled");
  submitBtn.textContent = "Processing";
  fetch("https://discord.com/api/v9/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((r) => r.json())
    .then(({ id }) =>
      fetch("/api/join-discord", {
        method: "POST",
        body: JSON.stringify({
          access_token,
          nick,
          id,
        }),
      })
    )
    .then(console.log);
}

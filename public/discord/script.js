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

// If redirecting back from an OAuth request, these fields are populated.
if (access_token && state) {
  const nick = atob(state);
  nameInp.value = nick;
  nameInp.disabled = true;
  submitBtn.classList.add("disabled");
  submitBtn.textContent = "Processing";

  // Retrieve user id
  fetch("https://discord.com/api/v9/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((r) => r.json())
    .then(({ id, avatar }) => {
      // Add avatar to DOM
      if (avatar) {
        const avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg?size=64`;
        document
          .querySelector(".row")
          .insertAdjacentHTML("afterbegin", `<img src="${avatarURL}" />`);
      }

      // Add user to server with their name as nickname
      return fetch("/api/join-discord", {
        method: "POST",
        body: JSON.stringify({
          access_token,
          nick,
          id,
        }),
      });
    })
    .then((response) => {
      if (response.status === 201) {
        submitBtn.textContent = "Added to server";
      } else if (response.status === 204) {
        submitBtn.textContent = "Already added";
      } else {
        submitBtn.textContent = "Error";
      }
    });
}

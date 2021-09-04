const nameInp = document.querySelector(".name");
const submitBtn = document.querySelector(".btn");

const setButtonClass = () =>
  submitBtn.classList[
    /^[a-z .'-]{3,}$/i.test(nameInp.value) ? "remove" : "add"
  ]("disabled");

document.querySelector(".name").addEventListener("input", setButtonClass);

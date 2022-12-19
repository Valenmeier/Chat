const socket = io();

let user;
let chatBox = document.querySelector(`#chatBox`);
Swal.fire({
  title: "identificate",
  input: "text",
  inputValidator: (value) => {
    return !value && `Necesita un nombre`;
  },
  allowOutsideClick: false,
}).then((res) => {
  user = res.value;
  console.log(user)
  let textUsername = document.querySelector(`#username`);
  textUsername.innerHTML = user;
  socket.emit(`authenticated`, user);
});

chatBox.addEventListener(`keyup`, (event) => {
  if (event.key == `Enter`) {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", {
        user,
        message: chatBox.value,
      });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.querySelector(`#messageBox`);
  let messages = "";
  data.forEach((message) => {
    messages += `<b>${message.user}</b>:${message.message}<br>`;
  });
  log.innerHTML = messages;
});
socket.on("newUser", (data) => {
  Swal.fire({
    text: `Nuevo usuario conectado ${data}`,
    toast: true,
    position: `top-right`,
  });
});

const form = document.querySelector('#sleeper-form');
const username = document.querySelector('#sleeper-username');
const message = document.querySelector('#form-message');
form.addEventListener('submit', (event) => { event.preventDefault(); const value = username.value.trim(); message.textContent = `Ready to connect ${value}. Add the Sleeper sync service before enabling live league imports.`; });

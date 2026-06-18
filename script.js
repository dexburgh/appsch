setInterval(() => {
  const c = document.getElementById('m-count');
  const b = document.getElementById('m-billed');
  if (!c || !b) return;
  let v = parseInt(c.innerText.replace(/\s/g,''), 10);
  if (isNaN(v)) v = 1482;
  v += 1;
  c.innerText = v.toLocaleString('en-ZA');
  b.innerText = 'R ' + (v * 1250).toLocaleString('en-ZA');
}, 5000);

function submitForm() {
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  if (!name || !email) { alert('Please fill in your name and email.'); return; }
  document.getElementById('mb-confirm').style.display = 'block';
  document.getElementById('cf-name').value = '';
  document.getElementById('cf-practice').value = '';
  document.getElementById('cf-email').value = '';
  document.getElementById('cf-msg').value = '';
}

document.getElementById('send-btn').addEventListener('click', submitForm);
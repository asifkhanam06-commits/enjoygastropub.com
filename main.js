// main.js - handles modals, search, and API calls

// modal helpers
const openModal = (id) => document.getElementById(id).style.display = 'flex';
const closeModal = (el) => { el.style.display = 'none'; };

// wire top buttons
document.getElementById('signupBtn').addEventListener('click', () => openModal('signupModal'));
document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
document.getElementById('feedbackBtn').addEventListener('click', () => openModal('feedbackModal'));
document.getElementById('orderBtnTop').addEventListener('click', () => openModal('orderModal'));

// close buttons
document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', (e)=>{
  const modal = e.target.closest('.modal');
  if(modal) closeModal(modal);
}));

// clicking outside modal closes it
document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', (e) => {
    if(e.target === m) closeModal(m);
  });
});

// SEARCH FILTER
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('keyup', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.menu-item').forEach(item => {
      const t = item.querySelector('h3').innerText.toLowerCase();
      item.style.display = t.includes(q) ? '' : 'none';
    });
    document.querySelectorAll('.memory-frame').forEach(frame => {
      frame.style.display = frame.querySelector('img').src.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// MENU ORDER BUTTONS: open order modal and fill item name
document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const item = e.currentTarget.dataset.item || e.currentTarget.closest('.menu-item').querySelector('h3').innerText;
    document.getElementById('orderTitle').innerText = item;
    document.getElementById('orderQuantity').value = 1;
    document.getElementById('orderPhone').value = '';
    openModal('orderModal');
  });
});

// SIGNUP
document.getElementById('su_submit').addEventListener('click', async () => {
  const username = document.getElementById('su_username').value.trim();
  const email = document.getElementById('su_email').value.trim();
  const password = document.getElementById('su_password').value.trim();
  if(!username || !email || !password){ alert('Fill all signup fields'); return; }

  try {
    const res = await fetch('/signup', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username,email,password})
    });
    const data = await res.json();
    alert(data.message || 'Signup complete');
    closeModal(document.getElementById('signupModal'));
  } catch(err){ alert('Signup failed'); console.error(err) }
});

// LOGIN
document.getElementById('li_submit').addEventListener('click', async () => {
  const email = document.getElementById('li_email').value.trim();
  const password = document.getElementById('li_password').value.trim();
  if(!email || !password){ alert('Fill email and password'); return; }

  try {
    const res = await fetch('/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email,password})
    });
    const data = await res.json();
    if(res.ok){ alert(data.message || 'Login successful'); closeModal(document.getElementById('loginModal')); }
    else { alert(data.message || 'Invalid credentials'); }
  } catch(err){ alert('Login error'); console.error(err) }
});

// PLACE ORDER
document.getElementById('order_submit').addEventListener('click', async () => {
  const item = document.getElementById('orderTitle').innerText;
  const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
  const phone = document.getElementById('orderPhone').value.trim();
  if(!phone){ alert('Enter phone number'); return; }

  try {
    const res = await fetch('/order', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({item,quantity,phone})
    });
    const data = await res.json();
    if(res.ok) { alert(data.message || 'Order placed'); closeModal(document.getElementById('orderModal')); }
    else alert(data.message || 'Order failed');
  } catch(err){ alert('Order error'); console.error(err) }
});

// FEEDBACK
document.getElementById('feedback_submit').addEventListener('click', async () => {
  const text = document.getElementById('feedbackText').value.trim();
  if(!text){ alert('Write feedback'); return; }
  try {
    const res = await fetch('/feedback', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({text})
    });
    const data = await res.json();
    alert(data.message || 'Thanks for the feedback');
    closeModal(document.getElementById('feedbackModal'));
  } catch(err){ alert('Feedback failed'); console.error(err) }
});

// RESERVATION form
document.getElementById('reserveForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    date: form.date.value,
    time: form.time.value,
    guests: parseInt(form.guests.value) || 1,
    request: form.request.value.trim()
  };
  try {
    const res = await fetch('/reserve', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || 'Reservation sent');
    form.reset();
  } catch(err){ alert('Reservation error'); console.error(err) }
});
const chatBtn = document.getElementById('chatButton');
const chatBox = document.getElementById('chatBox');

chatBtn.addEventListener('click', () => {
  chatBox.classList.toggle('hidden');
});
document.addEventListener('DOMContentLoaded', function() {
  const chatBtn = document.getElementById('chatButton');
  const chatBox = document.getElementById('chatBox');
  const closeChat = document.getElementById('closeChat');
  const sendBtn = document.getElementById('sendMsgBtn');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  // Toggle chat box open/close
  chatBtn.addEventListener('click', () => {
    chatBox.classList.toggle('hidden');
  });

  // Close chat when click on X
  closeChat.addEventListener('click', () => {
    chatBox.classList.add('hidden');
  });

  // Send message
  sendBtn.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (!msg) return;

    // Add your message
    const msgDiv = document.createElement('div');
    msgDiv.textContent = "You: " + msg;
    chatMessages.appendChild(msgDiv);

    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate reply
    setTimeout(() => {
      const replyDiv = document.createElement('div');
      replyDiv.textContent = "Admin: Thanks for your message!";
      chatMessages.appendChild(replyDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
  });

  // Also allow pressing Enter to send
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
      e.preventDefault();
    }
  });
});

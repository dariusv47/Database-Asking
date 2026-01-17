<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  // PASTE YOUR FIREBASE CONFIG HERE
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  let userIp = "Unknown";
  let fontSize = 18;
  let paddingY = 15;
  let paddingX = 30;
  let clickCount = 0;
  let pleaseExtraClicks = 0;

  // Fetch the IP address when the page opens
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => userIp = data.ip)
    .catch(err => console.error("Could not fetch IP", err));

  const messages = [
      "No", "Are you sure?", "Really Sure", "Are you possitive?", 
      "Pookie please...", "Just think about it!", 
      "If you say, i will be verry sad", "i will be sad", "Please"
  ];

  window.handleNo = function() {
      const yesBtn = document.getElementById('yesBtn');
      const noBtn = document.getElementById('noBtn');

      fontSize += 35; 
      paddingY += 12;
      paddingX += 20;
      yesBtn.style.fontSize = fontSize + 'px';
      yesBtn.style.padding = paddingY + 'px ' + paddingX + 'px';

      if (clickCount < messages.length - 1) {
          clickCount++;
          noBtn.innerText = messages[clickCount];
      } else {
          pleaseExtraClicks++;
          if (pleaseExtraClicks >= 3) noBtn.style.display = 'none';
      }
  };

  window.celebrate = async function() {
      // SAVE DATA TO FIREBASE
      try {
          await addDoc(collection(db, "responses"), {
              answer: "YES",
              ipAddress: userIp, // Saves their IP
              time: serverTimestamp(),
              noClicksAttempted: clickCount + pleaseExtraClicks
          });
      } catch (e) {
          console.error("Error saving to DB: ", e);
      }

      const container = document.getElementById('mainContainer');
      container.innerHTML = `
          <img class="main-img" src="success.gif" alt="Success!">
          <h1 style="color: #d35d6e; font-size: 2.5rem;">Knew you would say yes!</h1>
      `;
  };
</script>

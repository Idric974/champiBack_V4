const appTimer = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const day = now.toLocaleDateString();

  const apptime = `${day} `;
  console.log("apptime : ", apptime);

  const appDate = `${hours}:${minutes}:${seconds}`;
  console.log("appDate : ", appDate);
};

setInterval(appTimer, 1000);

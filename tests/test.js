const myPromise = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Test myPromise OK");
      resolve(console.log("🟢 SUCCESS : my resolve"));
    } catch (error) {
      console.log("🟠 TRY CATCH ERROR : my error :", error);
      reject(console.log("🟠 TRY CATCH ERROR : my reject :", error));
    }
  });
};

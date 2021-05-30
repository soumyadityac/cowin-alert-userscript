// ==UserScript==
// @name         COWIN Availability Alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Soumyaditya
// @match        https://selfregistration.cowin.gov.in/appointment
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        window.focus
// ==/UserScript==

(() => {
  const clickElement = (id, elementSelector = document.getElementById) => new Promise(res => setTimeout(() => {
    const searchBySelector = elementSelector.call(document, id);
    searchBySelector.click();
    res();
  }, 500));

  async function selectStateSearchParams() {
    await clickElement("status"); // select by district
    await clickElement("mat-select-value-1"); // state select
    await clickElement("mat-option-36"); // west bengal select
  }

  async function selectKolkataDistrict() {
    await clickElement("mat-select-value-3"); // district select
    await clickElement("mat-option-53"); // kolkata select
  }

  async function selectN24District() {
    await clickElement("mat-select-value-3"); // district select
    await clickElement("mat-option-58"); // kolkata select
  }

  async function searchPaid() {
    await clickElement(null, () => document.getElementsByTagName("ion-button")[0]); // search
    await clickElement("c6");
  }

  function checkSlotAvailablity() {
    return new Promise(res => {
        setTimeout(() => {
          const slotStatuses = Array.from(document.getElementsByClassName("vaccine-box"));
          const availableSlot  = slotStatuses.find(elem => {
            const slotStatus = elem.innerText.split("\n")[0];
            return !(slotStatus.includes("Booked") || slotStatus.includes("NA"))
          });
        if (availableSlot) return res(availableSlot);
        return setTimeout(res, 4000);
        }, 1000)
    });
  }

  function setupAudio() {
      window.player = document.createElement('audio');
      window.player.src = 'https://drive.google.com/uc?id=1dwM-Xd8DFp_XkBN5lekDwou5Hug71Aky';
      window.player.preload = 'auto';
  }

  function setupNotifications() {
    if (Notification.permission === "granted") return;
    Notification.requestPermission()
  }

  async function main() {
    let slotFound = false;
    setupAudio();
    setupNotifications();
    await selectStateSearchParams();
    for (let attemptCount = 1; !slotFound; attemptCount++) {
        const districtToSelect = Math.floor(attemptCount%2) ? selectKolkataDistrict : selectN24District;
        await districtToSelect();
        await searchPaid();
        slotFound = await checkSlotAvailablity();
    }
    window.focus();
    window.player.play();
    new Notification("Slot Found")
    slotFound.scrollIntoView();
    slotFound.click();
    window.player.pause();
  }


  window.onload = () => {
  console.log("initializing");
  main();
  };
})()
/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if(e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing')

    window.removeEventListener('keydown', handleFirstTab)
    window.addEventListener('mousedown', handleMouseDownOnce)
  }

}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing')

  window.removeEventListener('mousedown', handleMouseDownOnce)
  window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered
    ? "scale(1)"
    : "scale(0)";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    isBackToTopRendered = true;
    alterStyles(isBackToTopRendered);
  } else {
    isBackToTopRendered = false;
    alterStyles(isBackToTopRendered);
  }
});

//Visit Counter Code

window.addEventListener('DOMContentLoaded', (event) => {
  getVisitCount();
});

//API creation

const localFunctionApi = 'http://localhost:7071/api/httptrigercosmodb';
const liveFunctionApi = 'https://functionappcosmodb.azurewebsites.net/api/httptrigercosmodb';

const getVisitCount = () => {
  let count = 10;
  fetch(liveFunctionApi).then(response => {
    return response.json()
  }).then(response => {
    console.log("Webpage called function API successfully.");
    count = response.count;
    document.getElementById("counter").innerText = count;
  }).catch(function(error){
    console.log(error);
  });

  return count;
}
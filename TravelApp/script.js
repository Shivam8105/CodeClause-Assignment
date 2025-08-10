// Example static tour data
const tourData = [
  {
    name: "Swiss Alps Adventure",
    price: "$1999",
    features: ["7 nights, 4-star hotels", "Daily hiking tours", "Cable car tickets included"],
  },
  {
    name: "Discover Bali",
    price: "$1299",
    features: ["5 nights resort stay", "Temple & beach tours", "Airport transfers"],
  },
  {
    name: "Paris Explorer",
    price: "$999",
    features: ["4 nights city hotel", "Seine cruise", "Museum & monument passes"],
  }
];

// Populate tours on page
const tourListDiv = document.getElementById("tourList");
const selectTour = document.getElementById("selectTour");

function renderTours() {
  let html = '';
  tourData.forEach((tour, idx) => {
    html += `
      <div class="tour">
        <h3>${tour.name}</h3>
        <span class="price">${tour.price}</span>
        <ul>
          ${tour.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <button class="btn" onclick="document.getElementById('book').scrollIntoView({behavior:'smooth'});selectTour.selectedIndex=${idx};">Book Now</button>
      </div>
    `;
    if(selectTour){
      let option=document.createElement("option");
      option.value=tour.name;
      option.textContent=tour.name+" - "+tour.price;
      selectTour.appendChild(option);
    }
  });
  if(tourListDiv){ tourListDiv.innerHTML = html;}
}
renderTours();

// Booking form handling
const bookingForm = document.getElementById("bookingForm");
const bookingSuccess = document.getElementById("bookingSuccess");
bookingForm.addEventListener("submit", function(e){
  e.preventDefault();
  bookingSuccess.textContent = "Thank you, " + document.getElementById("name").value + "! Your booking for " + document.getElementById("selectTour").value + " is received. We'll contact you soon!";
  bookingSuccess.style.display = "block";
  bookingForm.reset();
  setTimeout(()=>{ bookingSuccess.style.display = "none"; }, 6900);
});

var slideIndex = 1; //global variable used for the index of slides
var activityState = 0; //global variables used to indicate current state
var tabularState = 0;
showSlides(slideIndex); //shows first slide

//shows next or previous slide, depending on the input
function plusSlides(n) {
  showSlides(slideIndex += n);
}

//this function shows the slideshow, and cycles through it. changes the style of the element 'mySlides' from 'none' to 'block' and displays the respective
//captions (years) of the slides as well
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
  captionText.innerHTML = dots[slideIndex-1].alt;
};

//this function shows the graph and changes the style of the element 'graph' from 'none' to 'block'
function showGraphs() {
  var slides = document.getElementById("graph");
  slides.style.display = "block";
};

//global variable used for indicating the visibility of all markers on the map
var visibility = 0;

//function used to display the map and describe its properties
function initMap() {
  var map;
  var markers = [];
    //initiation of the map
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 6,
      center: { lat: 30.917307, lng: 71.76934 },
      fullscreenControl: false,
    });
    //locations of all markers
    const locations = [
      { lat: 33.644206, lng: 72.99143 },
      { lat: 35.56798, lng: 73.100828 },
      { lat: 31.019045, lng: 72.441638 },
      { lat: 28.192117, lng: 68.969904 },
    ];
    //creating all markers, assigning them their coordinates, animation and pushing them in the 'markers' array
    for(let i = 0; i < locations.length; i++){
      const marker = new google.maps.Marker({
        position: locations[i],
        map,
        animation: google.maps.Animation.DROP,
      });
      markers[i] = marker;
    }
    //iniiate the map with no markers on it
    setMapOnAll(null, markers);
    //assigning functions to the buttons
    document.getElementById("show-hide-markers").addEventListener("click", function(){hideOrShowMarkers(map, markers)});
    document.getElementById("activity").addEventListener("click", function(){activityMode(markers)});
    document.getElementById("tabular").addEventListener("click", function(){tabularMode(markers)});
}
  
// Sets the map on all markers in the array.
function setMapOnAll(map, markers) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    markers[i].setAnimation(google.maps.Animation.DROP);
  }
}

// Toggle the markers
function hideOrShowMarkers(map, markers) {
  var a = document.getElementById("activity");
  var b = document.getElementById("tabular");
  // if markers are visible and 'Plantation Sites' button is clicked, markers will be hidden, the other buttons will be disabled and 
  // the slideshow/graph will also become hidden. the markers will lose all its listeners and return to its default icon. activityState and
  // tabularState will be set to 0 as no state will be selected
  if(visibility == 1){
    setMapOnAll(null, markers);
    visibility = 0;
    a.disabled = true;
    b.disabled = true;
    if(a.classList.contains('buttonActive')) a.classList.remove('buttonActive');
    if(b.classList.contains('buttonActive')) b.classList.remove('buttonActive');
    var x = document.getElementById("graph");
    var y = document.getElementById("slides");
    x.style.display = "none";
    y.style.display = "none";
    google.maps.event.clearInstanceListeners(markers[0]);
    markers[0].setIcon();
    activityState = 0;
    tabularState = 0;
  }
  // if markers are not visible and the button is clicked, the markers will be displayed and the other buttons will be enabled.
  else{
    setMapOnAll(map, markers);
    visibility = 1;
    a.disabled = false;
    b.disabled = false;
    activityState = 0;
    tabularState = 0;
  }
}

// this function displays the slideshow of the activity data when a marker is clicked
function showActivity(markers) {
  console.log("IN ACTIVITY MODE");
  var x = document.getElementById("slides");
  // when a marker is clicked, it changes into a green marker, indicating that it is selected and the slideshow of that site will be displayed
  if (x.style.display == "none") {
      var icon = {url:'images/green-dot.png', scaledSize: new google.maps.Size(46, 48)};
      markers[0].setIcon(icon);
      x.style.display = "block";
      showSlides(1);
  }
  // if marker is clicked again, the slideshow is hidden and the marker icon returns to the default icon 
  else {
      markers[0].setIcon();
      x.style.display = "none";
  }
}

// this function displays the forestation data in the form of a graph when a marker is clicked
function showTabular(markers) {
  console.log("IN TABULAR MODE");
  var x = document.getElementById("graph");
  // when a marker is clicked, it changes into a green marker, indicating that it is selected and the forestation data of that site will be displayed
  if (x.style.display == "none") {
      var icon = {url:'images/green-dot.png', scaledSize: new google.maps.Size(46, 48)};
      markers[0].setIcon(icon);
      x.style.display = "block";
      showGraphs();
  }
  // if marker is clicked again, the slideshow is hidden and the marker icon returns to the default icon 
  else {
      markers[0].setIcon();
      x.style.display = "none";
  }
}

// This function sets the state of the buttons into 'activity mode', defines the marker to display the activity data slideshow when clicked
function activityMode(markers){
  var a = document.getElementById("activity");
  var b = document.getElementById("tabular");
  var x = document.getElementById("graph");
  var y = document.getElementById("slides");
  
  // If the buttons are not in the activity state, it turns the 'activityState' variable into 1 and the 'tabularState' into 0
  // Changes the styles of the button clicked and the 'Forestation Data' button
  // Assigns the 'showActivity(markers)' function to the markers to activate when clicked
  // if the forestation graph data is already being displayed, it will replace that with the activity data slideshow
  if(activityState == 0){
    if(!a.classList.contains('buttonActive')) a.classList.add('buttonActive');
    if(b.classList.contains('buttonActive')) b.classList.remove('buttonActive');
    google.maps.event.clearInstanceListeners(markers[0]);
    markers[0].addListener('click', () => showActivity(markers));
    if(x.style.display == "block"){
      x.style.display = "none";
      y.style.display = "block";
    }
    activityState = 1;
    tabularState = 0;
  }
  // If the buttons are in the activity state and the 'Activity Data' button is clicked again, it will set the 'activityState' variable to 0
  // Removes all functionality from the markers and hides the activity data slideshow. Also returns the marker to its default icon
  else{
    activityState = 0;
    if(a.classList.contains('buttonActive')) a.classList.remove('buttonActive');
    google.maps.event.clearInstanceListeners(markers[0]);
    y.style.display = "none";
    markers[0].setIcon();
  }
}

// This function sets the state of the buttons into 'activity mode', defines the marker to display the activity data slideshow when clicked
function tabularMode(markers){
  var a = document.getElementById("tabular");
  var b = document.getElementById("activity");
  var x = document.getElementById("graph");
  var y = document.getElementById("slides");
  // If the buttons are not in the tabular state, it turns the 'tabularState' variable into 1 and the 'activityState' into 0
  // Changes the styles of the button clicked and the 'Activity Data' button
  // Assigns the 'showTabular(markers)' function to the markers to activate when clicked
  // If the activity data slideshow is already being displayed, it will replace that with the forestation data graph
  if(tabularState == 0){
    if(!a.classList.contains('buttonActive')) a.classList.add('buttonActive');
    if(b.classList.contains('buttonActive')) b.classList.remove('buttonActive');
    google.maps.event.clearInstanceListeners(markers[0]);
    markers[0].addListener('click', () => showTabular(markers));
    if(y.style.display == "block"){
      y.style.display = "none";
      x.style.display = "block";
    }
    activityState = 0;
    tabularState = 1;
  }
  // If the buttons are in the tabular state and the 'Forestation Data' button is clicked again, it will set the 'tabularState' variable to 0
  // Removes all functionality from the markers and hides the forestation data graph. Also returns the marker to its default icon
  else{
    tabularState = 0;
    if(a.classList.contains('buttonActive')) a.classList.remove('buttonActive');
    google.maps.event.clearInstanceListeners(markers[0]);
    x.style.display = "none";
    markers[0].setIcon();
  }
}

// This function displays the slides in the activity data slideshow in modal view and uses the slideshow's caption as its own caption
function fullScreen(){
  console.log("CLICKED");
  var modal = document.getElementById("myModal");
  var img = document.getElementsByClassName('mySlides')[slideIndex-1];
  var myimg = img.getElementsByTagName('img')[0];
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");
  var modalCaptionText = document.getElementById("modal-caption");
  modal.style.display = "block";
  modalImg.src = myimg.src;
  modalCaptionText.innerHTML = captionText.innerHTML;
}

// This function displays the forestation data graph in modal view
function fullScreen2(){
  console.log("CLICKED");
  var modal = document.getElementById("myModal");
  var img = document.getElementsByClassName('myGraph')[0];
  var myimg = img.getElementsByTagName('img')[0];
  var modalImg = document.getElementById("img01");
  var modalCaptionText = document.getElementById("modal-caption");
  modal.style.display = "block";
  modalImg.src = myimg.src;
  modalCaptionText.innerHTML = "Bar Graph Data";
}

// When the user clicks on (x), close the modal
function closeModal(){
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}
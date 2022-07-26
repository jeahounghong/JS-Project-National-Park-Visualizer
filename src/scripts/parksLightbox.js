const ParksLightbox = {
    openModal: function() {
      console.log("Open Modal")
      document.getElementById("photoModal").style.display = "block";
    },

    closeModal: function(){
      console.log("close")
        document.getElementById("photoModal").style.display = "none";
    },

    plusSlides: function(n){
      showSlides(slideIndex += n);
    },

    currentSlide: function(image){
      document.getElementById("main-modal-image").src = image.src;
      document.getElementById("photo-caption").innerHTML = image.alt;
    },

    showSlides: function(n) {
      var i;
      var slides = document.getElementsByClassName("mySlides");
      var dots = document.getElementsByClassName("demo");
      var captionText = document.getElementById("caption");
      if (n > slides.length) {slideIndex = 1}
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
      }
      for (i = 0; i < dots.length; i++) {
          dots[i].className = ""
          // dots[i].className = dots[i].className.replace("active", "");
      }
      slides[slideIndex-1].style.display = "block";
      dots[slideIndex-1].className += " active";
      captionText.innerHTML = dots[slideIndex-1].alt;
    },
    
}

module.exports = ParksLightbox;
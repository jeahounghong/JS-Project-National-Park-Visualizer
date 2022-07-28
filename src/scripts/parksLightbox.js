const ParksLightbox = {
    openModal: function() {
      document.getElementById("photoModal").style.display = "block";
    },

    closeModal: function(){
      document.getElementById("photoModal").style.display = "none";
    },

    plusSlides: function(n){
      showSlides(slideIndex += n);
    },

    currentSlide: function(image){
      document.getElementById("main-modal-image").src = image.src;
      document.getElementById("photo-caption").innerHTML = image.alt;
    },    
}

module.exports = ParksLightbox;
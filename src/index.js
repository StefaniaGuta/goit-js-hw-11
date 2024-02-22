import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.getElementById("search-form");
const input = document.getElementsByName("searchQuery")[0];
const gallery = document.querySelector(".gallery");
const loadBtn = document.querySelector(".load-more");

loadBtn.style.display = "none";
let page = 1;


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearGallery();
    page = 1;
    await fetchImages();
    
});

loadBtn.addEventListener("click", async() => {
    page ++;
    await fetchImages();
  });

const fetchImages = async ()=> {
    const baseUrl = `https://pixabay.com/api/`;
    const apiKey = "42434842-2ff460ac30438dd36311e67f2";
    
    const params = {
        key: apiKey,
        q: input.value.trim(), 
        image_type: 'photo', 
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: 40,
    }

    try{
        const response = await axios.get(baseUrl, { params });
        const {hits, totalHits} =  response.data;

        if(hits.length === 0 || input.value === ''){
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
            galleryImages(hits);
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            loadBtn.style.display = hits.length < totalHits ? "block" : "none";
            
            const lightbox = new SimpleLightbox('.gallery a', {
                captionsData: 'alt',
                captionDelay: 250,
            });
            lightbox.refresh();  
                
            const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();
    
            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
            })  
        }  
        if (hits < totalHits) {
            loadBtn.style.display = "none";
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        };   
    } catch(error) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.", error);
        console.log(error);
    };
}

function galleryImages(images) {
    const imageMarkup = images.map((image) => `
    <a href="${image.largeImageURL}" data-title="${image.tags}">
        <div class="photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
                    <p class="info-item">
                    <b>Likes</b>
                <span>${image.likes}</span>
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <span>${image.views}</span>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <span>${image.comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <span>${image.downloads}</span>
                </p>
            </div>
        </div>
    </a>`);
    gallery.innerHTML += imageMarkup.join("");
}

function clearGallery() {
    gallery.innerHTML = '';
}

const STORAGE_KEY = "kellyFilmsDemoV1";
const sampleFilms = [
 {id:"sample-1",title:"The Green Horizon",genre:"Drama",year:2025,description:"A young dreamer returns to the place they once called home and discovers that the future can begin with one brave decision.",poster:"",video:"",sample:true},
 {id:"sample-2",title:"Midnight Run",genre:"Action",year:2024,description:"When an unexpected message changes everything, one night becomes a race against time through a city that never sleeps.",poster:"",video:"",sample:true},
 {id:"sample-3",title:"Laughing Matters",genre:"Comedy",year:2025,description:"A group of friends set out to solve a small problem and accidentally turn an ordinary weekend into a comedy of errors.",poster:"",video:"",sample:true},
 {id:"sample-4",title:"The Quiet House",genre:"Horror",year:2023,description:"A family moves into an old house with a mysterious past. Strange sounds after dark lead them to ask what the house is trying to tell them.",poster:"",video:"",sample:true},
 {id:"sample-5",title:"Letters in Spring",genre:"Romance",year:2024,description:"Two strangers find a box of letters and begin a journey that changes the way they understand love, family, and second chances.",poster:"",video:"",sample:true},
 {id:"sample-6",title:"Beyond the Stars",genre:"Animation",year:2025,description:"A curious young explorer and a loyal robot set off across colorful worlds to find their way home.",poster:"",video:"",sample:true},
 {id:"sample-7",title:"Last Signal",genre:"Action",year:2022,description:"A communications technician receives a signal that could change everything, but only a small team believes it is real.",poster:"",video:"",sample:true},
 {id:"sample-8",title:"A New Beginning",genre:"Drama",year:2023,description:"A moving story about rebuilding trust, finding community, and taking the first step toward a better tomorrow.",poster:"",video:"",sample:true}
];
let films = loadFilms();
let activeGenre = "All";
let searchTerm = "";
let toastTimer;

const $ = (selector) => document.querySelector(selector);
const filmGrid = $("#filmGrid");
const emptyState = $("#emptyState");
const adminModal = $("#adminModal");
const detailModal = $("#detailModal");

function loadFilms(){
  try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : sampleFilms.map(f=>({...f})); }
  catch { return sampleFilms.map(f=>({...f})); }
}
function saveFilms(){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(films)); return true; }
  catch { showToast("Browser storage is full. Try a smaller poster image."); return false; }
}
function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function safeUrl(value){
  try { const url = new URL(value); return ["http:","https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
}
function posterMarkup(film, detail=false){
  if(film.poster) return `<img ${detail?'class="detail-poster"':''} src="${film.poster}" alt="${escapeHtml(film.title)} poster" loading="lazy">`;
  if(detail) return `<div class="detail-poster poster-fallback"><span class="fallback-mark">KELLY FILMS</span><span>${escapeHtml(film.title)}</span><span class="fallback-bottom">${escapeHtml(film.genre)} · ${film.year||"FILM"}</span></div>`;
  return `<div class="poster-fallback"><span class="fallback-mark">KELLY FILMS</span><span>${escapeHtml(film.title)}</span><span class="fallback-bottom">${escapeHtml(film.genre)} · ${film.year||"FILM"}</span></div>`;
}
function getVisibleFilms(){
  return films.filter(f => (activeGenre==="All" || f.genre===activeGenre) &&
    (f.title.toLowerCase().includes(searchTerm) || f.genre.toLowerCase().includes(searchTerm) || (f.description||"").toLowerCase().includes(searchTerm)))
    .sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
}
function renderFilms(){
  const visible = getVisibleFilms();
  filmGrid.innerHTML = visible.map(f=>`
    <article class="film-card" tabindex="0" role="button" aria-label="View ${escapeHtml(f.title)} details" data-film-id="${escapeHtml(f.id)}">
      <div class="poster-wrap">${posterMarkup(f)}<span class="film-tag">${escapeHtml(f.genre.toUpperCase())}</span><span class="play-bubble">▶</span></div>
      <div class="film-meta"><div class="film-title-row"><h3 class="film-title">${escapeHtml(f.title)}</h3><span class="film-year">${f.year||"—"}</span></div><p class="film-subtitle">${escapeHtml((f.description||"Discover this film on Kelly Films.").slice(0,74))}${(f.description||"").length>74?"…":""}</p></div>
    </article>`).join("");
  $("#statFilms").textContent = films.length;
  $("#heroCount").textContent = `${String(films.length).padStart(2,"0")} FILMS`;
  $("#resultCount").textContent = `${visible.length} film${visible.length===1?"":"s"}`;
  $("#resultsLabel").textContent = searchTerm ? `RESULTS FOR “${searchTerm.toUpperCase()}”` : activeGenre==="All" ? "FEATURED COLLECTION" : `${activeGenre.toUpperCase()} COLLECTION`;
  emptyState.classList.toggle("hidden", visible.length>0);
  filmGrid.classList.toggle("hidden", visible.length===0);
  renderAdminList();
}
function showToast(message){
  const toast=$("#toast"); toast.textContent=message; toast.classList.remove("hidden");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.add("hidden"),2800);
}
function openModal(modal){ modal.classList.remove("hidden"); document.body.style.overflow="hidden"; }
function closeModal(modal){ modal.classList.add("hidden"); if(adminModal.classList.contains("hidden")&&detailModal.classList.contains("hidden")) document.body.style.overflow=""; }
function openAdmin(){renderAdminList();openModal(adminModal);}
function openDetail(id){
  const f=films.find(item=>item.id===id); if(!f)return;
  const video=safeUrl(f.video||"");
  $("#detailContent").innerHTML=`<div class="detail-layout"><div>${posterMarkup(f,true)}</div><div class="detail-copy"><p class="section-kicker">KELLY FILMS COLLECTION</p><h2 id="detailTitle">${escapeHtml(f.title)}</h2><span class="detail-pill">${escapeHtml(f.genre)}</span>${f.year?`<span class="detail-pill">${f.year}</span>`:""}<p>${escapeHtml(f.description||"No description has been added yet.")}</p><div class="detail-actions">${video?`<a class="primary-btn" href="${video}" target="_blank" rel="noopener noreferrer">Watch trailer <span>↗</span></a>`:""}<button class="secondary-btn" id="copyFilmLink">Copy film title</button></div>${!video?'<p class="field-help">No trailer link has been added for this film yet.</p>':""}</div></div>`;
  $("#copyFilmLink").addEventListener("click",()=>{copyText(f.title);});
  openModal(detailModal);
}
async function copyText(text){
  try{await navigator.clipboard.writeText(text);showToast("Copied!");}
  catch{showToast(text);}
}
function renderAdminList(){
  const list=$("#adminFilmList"); if(!list)return;
  $("#adminFilmCount").textContent=`${films.length} films`;
  list.innerHTML=films.length?films.map(f=>`<div class="admin-film-row"><div><strong>${escapeHtml(f.title)}</strong><br><span>${escapeHtml(f.genre)}${f.year?" · "+f.year:""}</span></div><button class="delete-film" data-delete-id="${escapeHtml(f.id)}">Delete</button></div>`).join(""):'<p class="field-help">No films yet.</p>';
}
function resetFilters(){activeGenre="All";searchTerm="";$("#searchInput").value="";document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("selected",b.dataset.genre==="All"));renderFilms();}
$("#searchInput").addEventListener("input",event=>{searchTerm=event.target.value.trim().toLowerCase();renderFilms();});
document.querySelectorAll(".filter-chip").forEach(button=>button.addEventListener("click",()=>{activeGenre=button.dataset.genre;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("selected",b===button));renderFilms();}));
$("#clearSearchBtn").addEventListener("click",resetFilters);
$("#openAdminBtn").addEventListener("click",openAdmin);
$("#heroAdminBtn").addEventListener("click",openAdmin);
document.addEventListener("click",event=>{
  const close=event.target.closest("[data-close]"); if(close){const which=close.dataset.close;closeModal(which==="admin"?adminModal:detailModal);return;}
  const deleteBtn=event.target.closest("[data-delete-id]"); if(deleteBtn){const id=deleteBtn.dataset.deleteId;const f=films.find(item=>item.id===id);if(!f)return;if(confirm(`Delete "${f.title}" from this browser?`)){films=films.filter(item=>item.id!==id);if(saveFilms()){renderFilms();showToast("Film deleted.");}}return;}
  const card=event.target.closest("[data-film-id]");if(card)openDetail(card.dataset.filmId);
});
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"){closeModal(adminModal);closeModal(detailModal);}
  if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-film-id]")){event.preventDefault();openDetail(event.target.dataset.filmId);}
});
$("#filmForm").addEventListener("submit",async event=>{
  event.preventDefault();
  const title=$("#filmTitle").value.trim();
  const genre=$("#filmGenre").value;
  const year=$("#filmYear").value?Number($("#filmYear").value):"";
  const description=$("#filmDescription").value.trim();
  const video=$("#filmVideo").value.trim();
  if(!title){showToast("Please enter a film title.");return;}
  if(video && !safeUrl(video)){showToast("Enter a valid http or https video URL.");return;}
  const file=$("#filmPoster").files[0];
  let poster="";
  if(file){
    if(!file.type.startsWith("image/")){showToast("Choose an image file for the poster.");return;}
    if(file.size>1024*1024){showToast("Poster is over 1 MB. Choose a smaller image.");return;}
    try{poster=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}
    catch{showToast("Could not read this image.");return;}
  }
  const newFilm={id:`film-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,title,genre,year,description,poster,video,createdAt:Date.now()};
  films.unshift(newFilm);
  if(!saveFilms()){films=films.filter(f=>f.id!==newFilm.id);return;}
  renderFilms();event.target.reset();closeModal(adminModal);showToast("Film added to this browser!");
});
$("#resetDemoBtn").addEventListener("click",()=>{
  if(confirm("Reset this browser to the original sample films? Your added films will be removed.")){
    films=sampleFilms.map(f=>({...f}));saveFilms();resetFilters();showToast("Sample films restored.");
  }
});
$("#year").textContent=new Date().getFullYear();
renderFilms();

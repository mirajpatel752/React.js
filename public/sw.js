let chcheData = "appV1";
this.addEventListener("install", (event) => {
  event.waiUntil(
    caches.open(chcheData).then((cache) => {
      cache.addAll([
        "/static/js/bundle.js",
        "/static/js/main.chunk.js",
        "/static/js/0.chunk.js",
        "/index.html",
        "/",
      ]);
    })
  );
});
this.addEventListener("fetch",(event)=>{
    event.respondWith(
        caches.match(event.request).then(()=>{
            if(result){
                return result
            }
        })
    )
})
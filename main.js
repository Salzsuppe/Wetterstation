function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function a(){
    var raindropWrapper = document.querySelector(".raindropWrapper")
    for (i = 0; i<160; i++){
        var raindrop = '<div class="raindrop" style="top:'+getRandomArbitrary(0, 100)+'%; left:'+getRandomArbitrary(0, 100)+'%;"></div>'
        raindropWrapper.insertAdjacentHTML('beforeend', raindrop)
    }
}
a()
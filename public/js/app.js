const addtocartel = document.querySelectorAll('.add_to_cart');
const cartcounterel = document.getElementById('cartcounter');
function updateCart(pizza){
    fetch('update-cart',{method:'POST',body:pizza,headers:{"Content-type":"application/json; charset=UTF-8"}})
    .then(res => res.json())
    .then((data)=>{
        swal("Product added to cart!");
        cartcounterel.innerText = data.totalqty;       
    }).catch(err => {
        console.log(err);
    })

}

addtocartel.forEach((ele)=>{
    ele.addEventListener('click',(e)=>{
        let pizza = ele.dataset.pizza;
        let data = JSON.parse(pizza)
        updateCart(pizza);
    })  
})





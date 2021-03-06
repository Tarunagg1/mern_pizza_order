// import {loadStripe} from '@stripe/stripe-js'
const addtocartel = document.querySelectorAll('.add_to_cart');
const cartcounterel = document.getElementById('cartcounter');


function updateCart(pizza){
    fetch('update-cart',{method:'POST',body:pizza,headers:{"Content-type":"application/json; charset=UTF-8"}})
    .then(res => res.json())
    .then((data)=>{
        swal("Product added to cart!");
        cartcounterel.innerText = data.totalqty;       
    }).catch(err => {
        return   
    })

}

addtocartel.forEach((ele)=>{
    ele.addEventListener('click',(e)=>{
        let pizza = ele.dataset.pizza;
        let data = JSON.parse(pizza)
        updateCart(pizza);
    })  
})

const alertmsg = document.querySelector('#success-alert');
if(alertmsg){
    setTimeout(() => {
        alertmsg.remove();
    }, 2000);
}

//////// stripe

function placeoder(formobj){
    
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/orders");

        // xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type','application/json')
        // handle error
        xhr.onerror = function () {
            console.log(xhr.responseText);
        };
      
        // listen for response which will give the link
        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.responseText);
            if(xhr.responseText.status){
                    swal("Order Placed successfully!");
            }else{
                    swal(xhr.responseText.error);
            }
            window.location.href = 'http://localhost:3000/customer/myorders';
          }
        };    
        xhr.send(JSON.stringify(formobj));
}

let style = {
            base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
    }
    },
            invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
    }
};


const paymentType = document.getElementById('paymentType');
let cardelement = null;
var stripe = Stripe('pk_test_51I9WV7EpGX1180D7G5S9b3peaWknxobXf0UrQbnny6AySbmOAHUJooavYy73zNcqKSkuFJsaAIvPTbZ6you8FYcd0009qCmGHw');
if(paymentType){
    const makecard = ()=>{
        const elements = stripe.elements();
        cardelement = elements.create("card",{style,hidePostalCode:true})
        cardelement.mount('#card-element');
    }

    paymentType.addEventListener('change',(e)=>{
        let type = e.target.value;
        if(type == "card"){
            makecard()
        }else{
            cardelement.destroy();
        }
    })
}


///////////////////////
const paymentform = document.getElementById('payment-form');
if(paymentform){
    paymentform.addEventListener('submit',(e)=>{
        e.preventDefault();
        let formdata = new FormData(paymentform);
        let formobj = {};
        for(let [key,val] of formdata.entries()){
            formobj[key] = val;
        }

        // verify card
        if(cardelement){
            stripe.createToken(cardelement)
            .then((res)=>{
                formobj.stripetoken = res.token.id;
                placeoder(formobj);
            }).catch((err)=>{
                console.log(err);
            })
        }else{
            placeoder(formobj);
        }

    })
}

//////// stripe

////////// admin
//////////////////////////////////////////////////////////////////////////////

const adminTaborderTableBody = document.querySelector('#orderTableBody');
let order = [];
let markup
fetch('/admin/ferchorders')
.then(res => res.json())
.then(data =>{
    orders = data
    markup = genratedmarkup(order)
    adminTaborderTableBody.innerHTML = markup
})
.catch(err => {
    return
})

function renderItems(items) {
    let parsedItems = Object.values(items)
    return parsedItems.map((menuItem) => {
        return `
            <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
        `
    }).join('')
  }

function genratedmarkup(order){
    return orders.map(order => {
        return `
            <tr>
            <td class="border px-4 py-2 text-green-900">
                <p>${ order._id }</p>
                <div>${ renderItems(order.items) }</div>
            </td>
            <td class="border px-4 py-2">${ order.customerid.name }</td>
            <td class="border px-4 py-2">${ order.address }</td>
            <td class="border px-4 py-2">
                <div class="inline-block relative w-64">
                    <form action="/admin/order/status" method="POST">
                        <input type="hidden" name="orderId" value="${ order._id }">
                        <select name="status" onchange="this.form.submit()"
                            class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="order_placed"
                                ${ order.status === 'order_placed' ? 'selected' : '' }>
                                Placed</option>
                            <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                Confirmed</option>
                            <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                Prepared</option>
                            <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                Delivered
                            </option>
                            <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                Completed
                            </option>
                        </select>
                    </form>
                    <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20">
                            <path
                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </td>
            <td class="border px-4 py-2">
                ${order.createdAt}
            </td>
            <td class="border px-4 py-2">
                ${ order.paymentStatus ? 'paid' : 'Not paid' }
            </td>
        </tr>
    `
    }).join('')
}
let socket = io();

socket.on('orderplaced',(data)=>{
    console.log(data);
    orders.unshift(data);
    adminTaborderTableBody.innerHTML = '';
    adminTaborderTableBody.innerHTML = genratedmarkup(order);
})

//// status update at user

const status_lineel = document.querySelectorAll('.status_line');
const hiel = document.querySelector('#hiddenInput')
const orderinputele = hiel ? hiel.value : null;
let time = document.createElement('small');
let orderelhi = JSON.parse(orderinputele)
function updatestatus(order){
    status_lineel.forEach((status)=>{
        status.classList.remove('current')
        status.classList.remove('step-completed');
    })
    let stepcompleted = true;
    status_lineel.forEach((ele)=>{
        const datastatus = ele.dataset.status;
        if(stepcompleted){
            ele.classList.add("step-completed");
        }
        if(datastatus === order.status){
            ele.nextElementSibling.classList.add('current');
            time.innerText = order.updatedAt;
            stepcompleted = false;
            ele.appendChild(time)
            ele.classList.add("step-completed");
        }
    })
}

updatestatus(orderelhi);

if(orderelhi){
    socket.emit('join',`order_${orderelhi._id}`)
}
let adminareapath = window.location.pathname;
if(adminareapath.includes('admin')){
    socket.emit('join','adminroom')
}
socket.on('orderupdated',(data)=>{
    const updatedorder = {...orderelhi}
    updatedorder.updatedAt = 'inunun'
    updatedorder.status = data.status;
    updatestatus(updatedorder);
})

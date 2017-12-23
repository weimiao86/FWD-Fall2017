/***********vars*************/
var address;
var spicy = " normal ";
var choice;
var ordered = false;


/**********events listeners*********/
window.addEventListener('load', setup, false);

function setup() {
  var pizzaImg = document.getElementById('pizza-img');
  var burritoImg = document.getElementById('burrito-img');
  var hotCheck = document.getElementById('ifhot');
  var pizza_store = document.getElementById('pizza_store');
  var burrito_store = document.getElementById('burrito_store');
  var orderBtn = document.getElementById('placeOrder');

  /****** Event listener for images*******/
  if (pizzaImg.addEventListener) {
    pizzaImg.addEventListener('click', function(e) {
      chooseImg(e)
    }, false);
  } else {
    pizzaImg.attachEvent('click', function(e) {
      chooseImg(e)
    })
  }

  if (burritoImg.addEventListener) {
    burritoImg.addEventListener('click', function(e) {
      chooseImg(e)
    }, false);
  } else {
    burritoImg.attachEvent('click', function(e) {
      chooseImg(e)
    })
  }

/************event listener for hot chekcbox*******/
  if (hotCheck.addEventListener) {
    hotCheck.addEventListener('change', chooseHot, false);
  } else {
    hotCheck.attachEvent('change', chooseHot);
  }

/*******event listener for store radios *********/
pizza_store.addEventListener('click',chooseStore,false);
burrito_store.addEventListener('click',chooseStore,false);

/*********event listenre for buttons********/
orderBtn.addEventListener('click',placeOrder);
orderBtn.addEventListener('mouseover',preOrderOn);
orderBtn.addEventListener('mouseout',preOrderOff);

}

function getTarget(e) {
  if (!e) {
    e = window.event;
  }
  return e.target || e.srcElement;
}

function chooseImg(e) {
  var target, eBrother;
  target = getTarget(e);
  if (target.id == "pizza-img") {
    choice = "pizza";
    address = "Backcountry Pizza and Taphous";
    target.style.maxWidth = "250px";
    document.getElementById('burrito-img').style.maxWidth = "100px";
    document.getElementById("pizza_store").className = "show";
    document.getElementById('burrito_store').className = "hide";
  }
  if (target.id == "burrito-img") {
    choice = "burrito";
    address="Cafe Mexicali";
    target.style.maxWidth = "250px";
    document.getElementById('pizza-img').style.maxWidth = "100px";
    document.getElementById("pizza_store").className = "hide";
    document.getElementById('burrito_store').className = "show";
  }
}

function chooseHot() {
  var x = document.getElementById("ifhot").checked;
  var hotArea = document.getElementById('hotArea');
  if (x == true) {
    spicy = " spicy ";
    hotArea.style.backgroundColor = "red";
  } else {
    spicy = " normal ";
    hotArea.style.backgroundColor = "white";
  }
}

function chooseStore(){
  var store = this;
  for(var i=0; i<store.length; i++){
    if(store[i].checked){
      address=store[i].value;
      console.log(address);
    }
  }
}

function preOrderOn(){
  var preInfo;
  var preDetail = document.getElementById("preinfo");
  if(choice != null && !ordered){
    preDetail.style.display = "block";
    preInfo = spicy + choice + " from " + address;
    preDetail.innerHTML = preInfo;
  }
}

function preOrderOff(){
  var preDetail = document.getElementById("preinfo");
  preDetail.style.display = "none";
}

function placeOrder(){
  ordered = true;
  var orderinfo;
  var orderDetail = document.getElementById("orderDetail");
  if(choice != null){
    preOrderOff();
    orderinfo = "You ordered a" + spicy + choice + " from " + address
    + ", will be delivered in 30 mins, thanks!";
    orderDetail.innerHTML = orderinfo;
  }else{
    alert("Please select a food first!");
  }
}

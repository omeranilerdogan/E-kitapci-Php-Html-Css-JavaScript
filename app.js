let bookList =[],
basketList = [];




const toggleModal=()=>{
    const sepetModalEl=document.querySelector(".sepet_modal");
    sepetModalEl.classList.toggle("active");
};

const getBooks = () => {
    fetch("./products.json")
    .then(res => res.json())
    .then((books) => (bookList=books));
}

getBooks();

const createBookStart = (starRate) => {
let starRateHtml = "";
for(let i=1; i <=5;i++){
    if(Math.round(starRate) >= i)starRateHtml+=    `<i class="bi bi-star-fill active"></i>`;
    else starRateHtml+=`<i class="bi bi-star-fill "></i>`;
}
return starRateHtml;

};

const createBookItemsHtml = () => {
  const bookListEl =  document.querySelector(".book_list");
  let bookListHtml ="";
 bookList.forEach((book, index) => {

    bookListHtml += `<div class="col-5 ${ index %2 == 0 && "offset-2" } mb-5">
        <div class="row book_card">
          <div class="col-6">
            <img class="img-fluid shadow" src="${book.imgSource}" width="258" height="400"/>
          </div>
          <div class="col-6  d-flex flex-column justify-content-between">
            <div class="book_detail">
              <span class="fos gray fs-5">${book.author}</span><br>
              <span class="fs-4 fw-bold">${book.name}</span><br>
              <span class="book_star-rate">
                ${createBookStart(book.starRate)}
              <span class="book_rewies">${book.reviewCount}</span>
              </span>
            </div>
           <p class="book_desc fos gray">${book.description}</p>
              <div>
                <span class="black fw-bold fs-5 m-2">${book.price}₺</span>
                ${book.oldPrice ? `<span class="old_price fs-5 fw-bold">${book.oldPrice}</span>`: ""}
              </div>
              <button class="btn_purple" onclick="addBookToBasket(${book.id}) ">Sepete Ekle</button>
          </div>
        </div>
      </div>`;

 });

      bookListEl.innerHTML=bookListHtml; 


};


const BOOK_TYPE = {
ALL :"TÜMÜ",
NOVEL:"ROMAN",
CHILDREN:"ÇOCUK",
SELFIMPROVEMENT:"KİŞİSEL GELİŞİM ",
SCIENCE:"BİLİM",
HISTORY:"TARİH",
FINANCE:"Finans",
};


const createBookTypeHtml = () => {
   const filterEl = document.querySelector(".fiter");

   let filterHtml =" ";
   let filterTypes =["ALL"];
   bookList.forEach(book => {
     if(filterTypes.findIndex((filter) => filter == book.type)  == -1) filterTypes.push(book.type);
   });

   filterTypes.forEach((type, index) => {
    filterHtml += `<li class="${index==0 ? "active" : null}" onclick="filterBooks(this)" data-type="${type}">${BOOK_TYPE[type] ||  type}</li>`;
   });
   filterHtml.innerHTML=filterHtml;


};

const filterBooks = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType=filterEl.dataset.type;
  getBooks();
  if(bookType != "ALL")
   bookList=bookList.filter((book) => book.type == bookType);
  createBookItemsHtml();
};
const ListBasketItems = () => {
  

 const basketlistEl = document.querySelector(".sepet_liste");
 const basketCountEl = document.querySelector(".basket_count");
 basketCountEl.innerHTML = basketList.length > 0 ? basketList.length: null;

 const totalPriceEl = document.querySelector(".total_price");
let basketListHtmal ="";
 var totalPrice = 0;
basketList.forEach(item => {
  totalPrice += item.product.price *item.quantity;
basketListHtmal+=` <li class="basket_item">
<img src="${item.product.imgSource}" />
<div class="basket_items-info">
  <h3 class="book_name" >${item.product.name}</h3>
  <span class="book_price" >${item.product.price}₺</span><br>
  <span class="book_remove" onclick="removeItemToBasket(${item.product.id})"><i class="bi bi-trash3-fill"></i></span>              
</div>
<div class="book_count">
  <span class="decrease" onclick="decreaseItemToBasket(${item.product.id})"><i class="bi bi-dash"></i></span>
  <span>${item.quantity}</span>
  <span class="increase" onclick="increaseItemToBasket(${item.product.id})"><i class="bi bi-plus"></i></span>
</div>
</li>`;

});
basketlistEl.innerHTML= basketListHtmal ? basketListHtmal : `<li class="basket_item">
<p class="ort">Sepetiniz Şuan Boş </p>

</li>`;
totalPriceEl.innerHTML=totalPrice > 0 ? "Toplam : "+ totalPrice.toFixed(2) + "₺": null;

};

const addBookToBasket = (bookId) => {
 let  findedBook =   bookList.find(book => book.id == bookId );
if(findedBook){
  const basketIAllreadyIndex =  basketList.findIndex( 
(basket) => basket.product.id == bookId);
if(basketIAllreadyIndex == -1){
  let addedItem = {quantity: 1, product: findedBook };

  basketList.push(addedItem);
}
else{
basketList[basketIAllreadyIndex].quantity+=1;
}
ListBasketItems();
  }
};
const removeItemToBasket = (bookId) => {
 const findedIndex = basketList.findIndex(
  (basket) => basket.product.id == bookId);
 

 if(findedIndex != -1){
basketList.splice(findedIndex,1);
 }
 ListBasketItems();

};

const decreaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId);

    if(findedIndex != -1){
      if( basketList[findedIndex].quantity !=1)
      basketList[findedIndex].quantity -=1;
      else {
        removeItemToBasket(bookId);
      }
      ListBasketItems();
       }

};
const increaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId);

    if(findedIndex != -1){
      if( basketList[findedIndex].quantity !=basketList[findedIndex].product.stock)
      basketList[findedIndex].quantity +=1;
      else {
        
      }
      ListBasketItems();
  }

};


setTimeout(() =>{
    createBookItemsHtml();
    createBookTypeHtml(); 
}, 100);

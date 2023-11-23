import axios from 'axios';
import { renderFile } from 'ejs';

const regionSearch = document.querySelector("#regionSearch");
const ticketCardArea = document.querySelector(".ticketCard-area");
const addTicketBtn = document.querySelector(".addTicket-btn");

const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketRegion = document.querySelector("#ticketRegion");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate");
const ticketDescription = document.querySelector("#ticketDescription");

const alertMessage = document.querySelectorAll(".alert-message");
const addTicketForm = document.querySelector(".addTicket-form");
const totalNum = document.querySelector(".totalNum");
const cantFindArea = document.querySelector(".cantFind-area");


let data;

axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
  .then(function (response) {
    data = response.data.data;
    renderList(data);
    renderC3();
});


function renderList(data){
    let str = "";
    let searchCount = 0;
    data.forEach(function(item){
        let content = 
        `
            <li class="ticketCard">
                <div class="ticketCard-img">
                    <a href="#">
                        <img src="${item.imgUrl}" alt="">
                    </a>
                    <div class="ticketCard-region">${item.area}</div>
                    <div class="ticketCard-rate">${item.rate}</div>
                </div>
                <div class="ticketCard-content">
                    <div>
                        <h2 class="ticketCard-title">${item.name}</h2>
                        <p class="ticketCard-text">${item.description}</p>
                    </div>
                    <div class="ticketCard-info">
                        <p class="ticketCard-num">
                            <span class="material-symbols-rounded material-symbols-rounded-fill">
                                error
                            </span>剩下最後 ${item.group} 組
                        </p>
                        <p class="ticketCard-price">
                            TWD<span id="ticketCard-price">${item.price}</span>
                        </p>
                    </div>
                </div>
            </li>
        `;
        str += content;
        searchCount += 1;
        totalNum.textContent = `本次搜尋共 ${searchCount} 筆資料`;
    });
    ticketCardArea.innerHTML = str;
};

function alertClear(){
    for (let index = 0; index < 7; index++) {
        alertMessage[index].innerHTML = "";
    };
};

function renderC3(){
    let areaNumObj = {};
    data.forEach(function(item){
        if(areaNumObj[item.area] == undefined){
            areaNumObj[item.area] = 1;
        }else{
            areaNumObj[item.area] += 1;
        };
    });
    console.log(areaNumObj);
    let areaAry = Object.keys(areaNumObj);
    let newData = [];
    areaAry.forEach(function(item){
        let areaNumAry = [];
        areaNumAry.push(item);
        areaNumAry.push(areaNumObj[item]);
        newData.push(areaNumAry)
    });
    var chart = c3.generate({
        data: {
            columns: newData,
            colors: {
                '台北': '#26BFC7',
                '台中': '#5151D3',
                '高雄': '#E68618',
                '台南': '#F0419C',
            },
            type : 'donut',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: "套票地區比重",
            width: 10,
            label: {
                show: false
            }
        },
        size: {
            width: 200,
            height: 180
        }
    });
}


//篩選器邏輯
regionSearch.addEventListener("change",function(e){
    ticketCardArea.innerHTML == "";
    cantFindArea.classList.remove("display-block");
    let filterArea = data.filter(function(el){
        return e.target.value == el.area;
    })
    console.log(filterArea);
    let allArea = data.filter(function(el){
        return e.target.value == "";
    });
    renderList(allArea);
    renderList(filterArea);
    
    if(ticketCardArea.innerHTML == ""){
        ticketCardArea.innerHTML == "";
        cantFindArea.classList.add("display-block");
        totalNum.textContent = `本次搜尋共 0 筆資料`;
    };
});

//新增卡片
addTicketBtn.addEventListener("click",function (e) {
    alertClear();
    if(ticketRegion.value==""||ticketDescription.value==""||ticketNum.value==""||ticketImgUrl.value==""||ticketName.value==""||ticketPrice.value==""||ticketRate.value==""){
        if(ticketName.value==""){
            alertMessage[0].innerHTML = 
            `<p>
                <span class="material-symbols-rounded material-symbols-rounded-fill">
                    error
                </span>
                必填
            </p>`;
        };
        if(ticketImgUrl.value==""){
            alertMessage[1].innerHTML = 
            `<p>
                <span class="material-symbols-rounded material-symbols-rounded-fill">
                    error
                </span>
                必填
            </p>`;
        };
        if(ticketRegion.value==""){
            alertMessage[2].innerHTML = 
            `<p>
                <span class="material-symbols-rounded material-symbols-rounded-fill">
                    error
                </span>
                必填
            </p>`;
        };
        if(ticketPrice.value==""){
            alertMessage[3].innerHTML = 
            `<p>
                <span class="material-symbols-rounded material-symbols-rounded-fill">
                    error
                </span>
                必填
            </p>`;
        };
        if(ticketNum.value==""){
            alertMessage[4].innerHTML = 
            `<p>
                <span class="material-symbols-rounded material-symbols-rounded-fill">
                    error
                </span>
                必填
            </p>`;
        };
        if(ticketRate.value==""){
            alertMessage[5].innerHTML = 
            `<p>
                <span class="material-symbols-rounded material-symbols-rounded-fill">
                    error
                </span>
                必填
            </p>`;
        };
        if(ticketDescription.value==""){
            alertMessage[6].innerHTML = 
            `<p>
                <span class="material-symbols-rounded material-symbols-rounded-fill">
                    error
                </span>
                必填
            </p>`;
        };
    }else{
        let obj = {};
        obj.area = ticketRegion.value;
        obj.description = ticketDescription.value;
        obj.group = ticketNum.value;
        obj.id = data.length;
        obj.imgUrl = ticketImgUrl.value;
        obj.name = ticketName.value;
        obj.price = ticketPrice.value;
        obj.rate = ticketRate.value;
        data.push(obj);
        renderList(data);
        renderC3();
        addTicketForm.reset();
        regionSearch.value = "地區搜尋";
    };
});






const checker = require("C:\\Users\\nbabr\\AppData\\Roaming\\npm\\node_modules\\ikea-availability-checker");
const codes = ['30346934', '80262489', '60263244'];
const names = ["Elemento angolare supplem/4 ripiani","Appenditutto estraibile","Binario estraibile per cestelli"];
const stores = ["233","295",'455'];
const stores_names = ["Carugate", "San Giuliano",'Corsico'];
let items =[];
let stocks=[];
let restocks=[];

console.log("Sto scaricando i dati..");

(async function() {
    for (let tmp in codes){
        for (let tmp2 in stores){
            const result = await checker.availability(stores[tmp2], codes[tmp]);
            stocks[tmp2] = result.stock;
            (result.restockDate != null) ? restocks[tmp2]= result.restockDate.toISOString().split('T')[0] : restocks[tmp2]="";
        }
        items.push(new item(
            codes[tmp],
            names[tmp],
            [stocks[0],stocks[1],stocks[2]],
            [restocks[0],restocks[1],restocks[2]],
        ));
    }
    plot_table();
})();

function item(code, name, stock=[], restock=[]) {
    this.code = code;
    this.name = name;
    this.stock = stock;
    this.restock = restock;
}

function max_length(data,idx){
    let length=0;
    if (data=="stock" | "data"=="restock")
        for (let i in items){
            if (items[i][data][idx].toString().length>length)
                length=items[i][data][idx].toString().length;
        }
    else
        for (let i in items){
            if (items[i][data].length>length)
                length=items[i][data].length;
        }
    return length;
}

function plot_table(){

    //COMPUTE INTERSPACES
    let spaces=[max_length("name",0)];
    for (let i in items[0].stock){
        spaces.push(max_length("stock",i));
    }

    //PLOT TABLE
    let row = "Codice   | Nome"+" ".repeat(spaces[0]-4)+" | ";
    for (let i in stores_names){
        row+=stores_names[i] + " ".repeat(spaces[parseInt(i)+1] + 18 - stores_names[i].length) + " | ";
    }
    console.log(row);
    for (let i in items){
        row=codes[i]+" | ";
        if (check_red_line(i))
            row+="\x1b[31m"+names[i]+"\x1b[0m"+" ".repeat(spaces[0]-names[i].length)+" | ";
        else
            row+=names[i]+" ".repeat(spaces[0]-names[i].length)+" | ";
        for (let j=0; j< items[i].stock.length; j++){
            if (items[i].stock[j]==0)
                row+= "S: \x1b[31m"+items[i].stock[j]+"\x1b[0m" +" ".repeat(spaces[j+1] - items[i].stock[j].toString().length)+" RS: " + items[i].restock[j] +" ".repeat(10 - items[i].restock[j].length) + " | ";
            else
                row+= "S: " + items[i].stock[j] + " ".repeat(spaces[j+1] - items[i].stock[j].toString().length) + " RS: " + items[i].restock[j] +" ".repeat(10 - items[i].restock[j].length) + " | ";
        }

        console.log(row);
    }
}


function check_red_line(index){ 
    for (let i in items[index].stock)
        if (items[index].stock[i]>0)
            return false;
    return true;
}
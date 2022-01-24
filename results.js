const getProjectFromSpreadSheet = require("./spreadsheet.js");

document.getElementById("submitButton").onclick = function () { separateNamesAndHours() };

document.getElementById("checkResults").onclick = function () { showResults() };
function NimictoZero(valoare) {
    if (valoare === null || valoare === undefined)
        return "";
    return valoare.toString();
}

async function separateNamesAndHours() {
    var fullNameAndHours = document.getElementById("text1").value;
    var i = 0;
    var state = 0;
    var projectIndex = 6;
    var k = 0;
    var arrayWIthAllTheNames = new Array(300);
    var str = "";
    while (fullNameAndHours[i] != undefined) {
        str = ""
        for (; fullNameAndHours[i] != '\n' && fullNameAndHours[i] != undefined; i++) {
            str = str + fullNameAndHours[i];
        }
        if (state == 0) {
            projectIndex = await getProjectFromSpreadSheet.getProjectIndexFromSpreadSheet(str);
        }
        var j = 0;
        if (state != 0) {
            arrayWIthAllTheNames[k] = new Array(2);
            arrayWIthAllTheNames[k+1] = new Array(2);
            arrayWIthAllTheNames[k+1][0]="";
            arrayWIthAllTheNames[k][0] = "";
            while (str[j]!= "-" && str[j]!= "–" && str[j]!="—") {
                console.log(arrayWIthAllTheNames[k][0]);
                arrayWIthAllTheNames[k][0] = arrayWIthAllTheNames[k][0] + NimictoZero(str[j]);
                j++;
            }
            arrayWIthAllTheNames[k][0] = NimictoZero(arrayWIthAllTheNames[k][0]);
            arrayWIthAllTheNames[k][1] = "";
            while (str[j]!= "o" && str[j]!="\n") {
                arrayWIthAllTheNames[k][1] = arrayWIthAllTheNames[k][1] + NimictoZero( str[j]);
                j++;
            }
            arrayWIthAllTheNames[k][1] = parseInt(arrayWIthAllTheNames[k][1].replace(/-| /gi, "").replace(/\D/g, ''));
            k++;
        }
        state++;
        i++
    }
    var result = await getProjectFromSpreadSheet.getArray()
    await getProjectFromSpreadSheet.writeInSheet(arrayWIthAllTheNames, result[0], result[1], projectIndex,k);
}

async function showResults() {
    var fullNameAndHours = document.getElementById("text1").value;
    var i = 0;
    var state = 0;
    var projectIndex = 6;
    var k = 0;
    var arrayWIthAllTheNames = new Array(300);
    var str = "";
    while (fullNameAndHours[i] != undefined) {
        str = ""
        for (; fullNameAndHours[i] != '\n' && fullNameAndHours[i] != undefined; i++) {
            str = str + fullNameAndHours[i];
        }
        if (state == 0) {
            projectIndex = await getProjectFromSpreadSheet.getProjectIndexFromSpreadSheet(str);
        }
        var j = 0;
        if (state != 0) {
            arrayWIthAllTheNames[k] = new Array(2);
            arrayWIthAllTheNames[k][0] = "";
            while (str[j]!= "-" && str[j]!= "–" && str[j]!="—") {
                console.log(arrayWIthAllTheNames[k][0]);
                arrayWIthAllTheNames[k][0] = arrayWIthAllTheNames[k][0] + NimictoZero(str[j]);
                j++;
            }
            
            arrayWIthAllTheNames[k+1] = new Array(2);
            arrayWIthAllTheNames[k][1] = "";
            while (str[j]!= "o" && str[j]!="\n") {
                arrayWIthAllTheNames[k][1] = arrayWIthAllTheNames[k][1] + NimictoZero( str[j]);
                j++;
            }
            arrayWIthAllTheNames[k][1] = parseInt(arrayWIthAllTheNames[k][1].replace(/-| /gi, "").replace(/\D/g, ''));
            k++;
        }
        state++;
        i++
    }
    console.log(arrayWIthAllTheNames);
    var Table = document.getElementById("tableID");
    Table.innerHTML = "";
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    var th1 = document.createElement("th");
    var th2 = document.createElement("th");
    var th3 = document.createElement("th");
    var textnode1 = document.createTextNode("Nume");
    var textnode2 = document.createTextNode("Ore");
    var textnode3 = document.createTextNode("Proiect");
    th1.appendChild(textnode1);
    th2.appendChild(textnode2);
    th3.appendChild(textnode3);
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);
    document.getElementById("tableID").appendChild(thead);

    var result = await getProjectFromSpreadSheet.getArray()
    await getProjectFromSpreadSheet.showNameFromSheet(arrayWIthAllTheNames, result[0], result[1], projectIndex,k);
}
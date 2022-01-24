const { GoogleSpreadsheet } = require('google-spreadsheet');

const creds = require('./client_secret.json');
const doc = new GoogleSpreadsheet('1nlct-MRL15QdGwv5r337WY4PFsfn5nxTAQRZOn-YzeA');
function columnToLetter(column) {
  let temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function NimictoZero(valoare) {
  if (valoare === null || valoare==undefined)
    return "";
  return valoare.toString();
}
function getPercentageOfNameFromName(name1, name2) {
  let k = 0;
  let ff = new Array(26).fill(0);
  for (let i = 0; i < name2.length; i++)
    ff[name2[i].charCodeAt(0) - "a".charCodeAt(0)]++;
  for (let i = 0; i < name1.length; i++)
    ff[name1[i].charCodeAt(0) - "a".charCodeAt(0)]--;
  for (let i = 0; i < 27 && k < 2; i++)
    if (ff[i] != 0)
      k++;
  return k < 2;
}

async function getProjectIndexFromSpreadSheet(str) {

  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  let sheet = doc.sheetsByIndex[0];
  let a = sheet.columnCount;
  let A = "A1:" + columnToLetter(a) + "1";
  await sheet.loadCells(A);
  for (i = 2; i < sheet.columnCount; i++) {
    let projectFromSheet = NimictoZero(sheet.getCell(0, i).value);
    if (getPercentageOfNameFromName(NimictoZero(str).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/-| /gi, ""), NimictoZero(projectFromSheet).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/-| /gi, "")))
      return i;
  }
  return 0;
}
async function getArray() {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  let sheet = doc.sheetsByIndex[0];
  var A = "A1:A" + sheet.rowCount;
  let array = new Array(sheet.rowCount);
  await sheet.loadCells(A);
  for (let i = 0; i < sheet.rowCount; i++) {
    array[i] = NimictoZero(sheet.getCell(i, 0).value);
  }
  return [array, sheet.rowCount];
}
async function writeInSheet(arrayWIthAllTheNames, array, totalRows, index,k) {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  let sheet = doc.sheetsByIndex[0];
  let A = columnToLetter(index) + "1:" + columnToLetter(index + 1) + totalRows;
  await sheet.loadCells(A);
  for (let i = 0; i < k; i++) {
    for (let j = 0; j <= totalRows; j++) {
      console.log(i +' '+ j);
      if (getPercentageOfNameFromName(NimictoZero(arrayWIthAllTheNames[i][0]).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/-| /gi, ""), NimictoZero(array[j]).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/-| /gi, ""))) {
        console.log(1);
        sheet.getCell(j,index).value=parseInt(arrayWIthAllTheNames[i][1]);
        await sheet.saveUpdatedCells();
        break;
      }
    }
  }
}
async function showNameFromSheet(arrayWIthAllTheNames, array, totalRows, index,k) {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  var ok;
  let sheet = doc.sheetsByIndex[0];
  let A = columnToLetter(index) + "1:" + columnToLetter(index + 1) + totalRows;
  await sheet.loadCells(A);
  for (let i = 0; i < k; i++) {
    ok=1;
    for (let j = 0; j < totalRows; j++) {
      if (getPercentageOfNameFromName(arrayWIthAllTheNames[i][0].normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/-| /gi, ""), NimictoZero(array[j]).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/-| /gi, ""))) {
        var tr=document.createElement("tr");
        var tbody=document.createElement("tbody");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var textnode1 = document.createTextNode(array[j]);
        var textnode2 = document.createTextNode(parseInt(arrayWIthAllTheNames[i][1]));
        var textnode3 = document.createTextNode(sheet.getCell(0, index).value);
        td1.appendChild(textnode1);
        td2.appendChild(textnode2);
        td3.appendChild(textnode3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbody.appendChild(tr);
        document.getElementById("tableID").appendChild(tbody);
        ok = 0;
        break;
      }
    }
      if (ok==1) {
        var tr=document.createElement("tr");
        var tbody=document.createElement("tbody");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var textnode1 = document.createTextNode(arrayWIthAllTheNames[i][0]);
        var textnode2 = document.createTextNode("Eroare");
        var textnode3 = document.createTextNode("Eroare");
        td1.appendChild(textnode1);
        td2.appendChild(textnode2);
        td3.appendChild(textnode3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbody.appendChild(tr);
        document.getElementById("tableID").appendChild(tbody);
        break;
      }
    }
  }

module.exports = {
  writeInSheet,
  getArray,
  showNameFromSheet,
  getProjectIndexFromSpreadSheet
};
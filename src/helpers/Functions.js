export const getDistance = (distance) => {
  let distanceString = distance.toString();
  if (distance < 100) {
    return `A menos de ${distanceString[0]}0 metros de você`;
  } else if (distance < 1000) {
    return `A ${distanceString[0]}00 metros de você`;
  } else if (distance < 10000) {
    return `A ${distanceString[0]} km de você`;
  } else if (distance <= 100000) {
    return `A ${distanceString[0]}0 km de você`;
  }
};


export const validateMobilePhone = (item) => {

  let auxPhone = item.replace(/\D/ig, "");

  if (auxPhone.length === 11) {
    if (["68", "82", "96", "92", "97", "71", "72", "73", "74", "75", "77", "85", "88", "61", "27", "28", "62", "64", "98", "99", "65", "66", "67", "31", "32", "33", "34", "35", "37", "38", "91", "93", "94", "83", "41", "42", "43", "44", "45", "46", "81", "87", "86", "89", "21", "22", "24", "84", "51", "53", "54", "55", "69", "95", "47", "48", "49", "11", "12", "13", "14", "15", "16", "17", "18", "19", "79", "63"].includes(auxPhone.substr(0, 2))) {
      if (["99", "98", "97", "96", "95", "94", "93"].includes(auxPhone.substr(2, 2))) {
        return true;
      }
    }
  }
  return false;
};

export const maskReal = (value) => {
  let aux = value;
  if (value !== "") {
    if (value[value.length - 2] === ",") {
      aux = value.replace(",0", "");
      aux = aux.slice(0, -1);
    } else {
      aux = value.replace(",00", "");
    }
  }
  let a = aux.replace(/[^0-9]/g, "");

  switch (a.length) {
    case 0:
      a = "";
      break;
    case 1:
      a = a.charAt(0) + ",00";
      break;
    case 2:
      a = a.charAt(0) + a.charAt(1) + ",00";
      break;
    case 3:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + ",00";
      break;
    case 4:
      a = a.charAt(0) + "." + a.charAt(1) + a.charAt(2) + a.charAt(3) + ",00";
      break;
    case 5:
      a = a.charAt(0) + a.charAt(1) + "." + a.charAt(2) + a.charAt(3) + a.charAt(4) + ",00";
      break;
    case 6:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4) + a.charAt(5) + ",00";
      break;
    default:
      a = a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4) + a.charAt(5) + ",00";
      break;
  }
  return a;
};


export const maskDate = (value) => {
  if (value) {
    let a = value.replace(/[^0-9]/g, "");

    switch (a.length) {
      case 0:
        a = "";
        break;
      case 1:
        a = a.charAt(0);
        break;
      case 2:
        a = a.charAt(0) + a.charAt(1);
        break;
      case 3:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2);
        break;
      case 4:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3);
        break;
      case 5:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4);
        break;
      case 6:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5);
        break;
      case 7:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6);
        break;
      case 8:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6) + a.charAt(7);
        break;
      default:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6) + a.charAt(7);
        break;
    }
    if (a !== null) {
      return a;
    } else {
      return null;
    }
  }
};

export const maskDate2 = (value) => {
  if (value) {
    let a = value.replace(/[^0-9]/g, "");

    switch (a.length) {
      case 0:
        a = "";
        break;
      case 1:
        a = a.charAt(0);
        break;
      case 2:
        a = a.charAt(0) + a.charAt(1);
        break;
      case 3:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2);
        break;
      case 4:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3);
        break;
      case 5:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + a.charAt(4);
        break;
      case 6:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + a.charAt(4) + a.charAt(5);
        break;
      default:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + a.charAt(4) + a.charAt(5);
        break;
    }
    return a;
  }
};

export const maskDateTime = (value) => {
  if (value) {
    let a = value.replace(/[^0-9]/g, "");

    switch (a.length) {
      case 0:
        a = "";
        break;
      case 1:
        a = a.charAt(0);
        break;
      case 2:
        a = a.charAt(0) + a.charAt(1);
        break;
      case 3:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2);
        break;
      case 4:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3);
        break;
      case 5:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4);
        break;
      case 6:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5);
        break;
      case 7:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6);
        break;
      case 8:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6) + a.charAt(7);
        break;
      case 9:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6) + a.charAt(7) + " " + a.charAt(8);
        break;
      case 10:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6) + a.charAt(7) + " " + a.charAt(8) + a.charAt(9);
        break;
      case 11:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6) + a.charAt(7) + " " + a.charAt(8) + a.charAt(9) + ":" + a.charAt(10);
        break;
      case 12:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6) + a.charAt(7) + " " + a.charAt(8) + a.charAt(9) + ":" + a.charAt(10) + a.charAt(11);
        break;
      case 13:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6) + a.charAt(7) + " " + a.charAt(8) + a.charAt(9) + ":" + a.charAt(10) + a.charAt(11);
        break;
      default:
        a = a.charAt(0) + a.charAt(1) + "/" + a.charAt(2) + a.charAt(3) + "/" + a.charAt(4) + a.charAt(5) + a.charAt(6) + a.charAt(7);
        break;
    }
    if (a !== null) {
      return a;
    } else {
      return null;
    }
  }
};

export const maskHour = (value) => {
  if (value) {
    let a = value.replace(/[^0-9]/g, "");

    switch (a.length) {
      case 0:
        a = "";
        break;
      case 1:
        a = a.charAt(0);
        break;
      case 2:
        a = a.charAt(0) + a.charAt(1);
        break;
      case 3:
        a = a.charAt(0) + a.charAt(1) + ":" + a.charAt(2);
        break;
      case 4:
        a = a.charAt(0) + a.charAt(1) + ":" + a.charAt(2) + a.charAt(3);
        break;
      default:
        a = a.charAt(0) + a.charAt(1) + ":" + a.charAt(2) + a.charAt(3);
        break;
    }
    return a;
  }
};

export const maskCPF = (value) => {
  let a = value.replace(/[^0-9]/g, "");

  switch (a.length) {
    case 0:
      a = "";
      break;
    case 1:
      a = a.charAt(0);
      break;
    case 2:
      a = a.charAt(0) + a.charAt(1);
      break;
    case 3:
      a = a.charAt(0) + a.charAt(1) + " " + a.charAt(2);
      break;
    case 4:
      a = a.charAt(0) + a.charAt(1) + " " + a.charAt(2) + a.charAt(3);
      break;
    case 5:
      a = a.charAt(0) + a.charAt(1) + " " + a.charAt(2) + a.charAt(3) + a.charAt(4);
      break;
    case 6:
      a = a.charAt(0) + a.charAt(1) + " " + a.charAt(2) + a.charAt(3) + a.charAt(4) + "-" + a.charAt(5);
      break;
    case 7:
      a = a.charAt(0) + a.charAt(1) + " " + a.charAt(2) + a.charAt(3) + a.charAt(4) + "-" + a.charAt(5) + a.charAt(6);
      break;
    case 8:
      a = a.charAt(0) + a.charAt(1) + " " + a.charAt(2) + a.charAt(3) + a.charAt(4) + "-" + a.charAt(5) + a.charAt(6) + a.charAt(7);
      break;
    default:
      a = null;
      break;
  }
  if (a !== null) {
    return a;
  } else {
    return null;
  }
};

export const maskCpf = (value) => {
  let a = value.replace(/[^0-9]/g, "");

  switch (a.length) {
    case 0:
      a = "";
      break;
    case 1:
      a = a.charAt(0);
      break;
    case 2:
      a = a.charAt(0) + a.charAt(1);
      break;
    case 3:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2);
      break;
    case 4:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3);
      break;
    case 5:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4);
      break;
    case 6:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4) + a.charAt(5);
      break;
    case 7:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4) + a.charAt(5) + "." + a.charAt(6);
      break;
    case 8:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4) + a.charAt(5) + "." + a.charAt(6) + a.charAt(7);
      break;
    case 9:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4) + a.charAt(5) + "." + a.charAt(6) + a.charAt(7) + a.charAt(8);
      break;
    case 10:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4) + a.charAt(5) + "." + a.charAt(6) + a.charAt(7) + a.charAt(8) + "-" + a.charAt(9);
      break;
    case 11:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4) + a.charAt(5) + "." + a.charAt(6) + a.charAt(7) + a.charAt(8) + "-" + a.charAt(9) + a.charAt(10);
      break;
    case 12:
      a = a.charAt(0) + a.charAt(1) + a.charAt(2) + "." + a.charAt(3) + a.charAt(4) + a.charAt(5) + "." + a.charAt(6) + a.charAt(7) + a.charAt(8) + "-" + a.charAt(9) + a.charAt(10);
      break;
    default:
      a = null;
      break;
  }
  if (a !== null) {
    return a;
  } else {
    return null;
  }
};
export const maskViewPhone = (item) => {
  if (item) {
    if (item.substring(0, 3) === "+55") {
      item = item.substring(3);
    } else if (item.substring(0, 2) === "55") {
      item = item.substring(2);
    }
    var x = item.replace(/\D/g, "").match(/(\d{2})(\d{5})(\d{4})/);
    if (x && x[1] && x[2] && x[3]) {
      item = "(" + x[1] + ") " + x[2] + "-" + x[3];
    } else {
      var y = item.replace(/\D/g, "").match(/(\d{2})(\d{4})(\d{4})/);
      if (y && y[1] && y[2] && y[3]) {
        item = "(" + y[1] + ") " + y[2] + "-" + y[3];
      }
    }
    return item;
  }
  return null;
};

export const maskPhone = (value) => {
  if (value) {
    let a = value.replace(/[^0-9]/g, "");

    switch (a.length) {
      case 0:
        a = "";
        break;
      case 1:
        a = "(" + a.charAt(0);
        break;
      case 2:
        a = "(" + a.charAt(0) + a.charAt(1);
        break;
      case 3:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2);
        break;
      case 4:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2) + a.charAt(3);
        break;
      case 5:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2) + a.charAt(3) + a.charAt(4);
        break;
      case 6:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2) + a.charAt(3) + a.charAt(4) + a.charAt(5);
        break;
      case 7:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2) + a.charAt(3) + a.charAt(4) + a.charAt(5) + a.charAt(6);
        break;
      case 8:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2) + a.charAt(3) + a.charAt(4) + a.charAt(5) + "-" + a.charAt(6)  + a.charAt(7);
        break;
      case 9:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2) + a.charAt(3) + a.charAt(4) + a.charAt(5) + "-" + a.charAt(6) + a.charAt(7) + a.charAt(8);
        break;
      case 10:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2) + a.charAt(3) + a.charAt(4) + a.charAt(5) + "-" + a.charAt(6) + a.charAt(7) + a.charAt(8) + a.charAt(9);
        break;
      case 11:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2) + a.charAt(3) + a.charAt(4) + a.charAt(5) + a.charAt(6) + "-" + a.charAt(7) + a.charAt(8) + a.charAt(9) + a.charAt(10);
        break;
      case 12:
        a = "(" + a.charAt(0) + a.charAt(1) + ") " + a.charAt(2) + a.charAt(3) + a.charAt(4) + a.charAt(5) + a.charAt(6) + "-" + a.charAt(7) + a.charAt(8) + a.charAt(9) + a.charAt(10);
        break;
      default:
        a = null;
        break;

    }
    if (a !== null) {
      return a;
    } else {
      return null;
    }
  }
};

export function formatDate(date, fmt) {
  fmt = fmt ? fmt.toUpperCase() : "Y-M-D H:M:S";
  let y = date.getFullYear(),
    m = zeroFill((date.getMonth() + 1)),
    d = zeroFill(date.getDate()),
    h = zeroFill(date.getHours()),
    min = zeroFill(date.getMinutes()),
    s = zeroFill(date.getSeconds());
  if (fmt.indexOf("Y") >= 0 && fmt.indexOf("M") >= 0) {
    return fmt.replace(/Y/, y).replace(/M/, m).replace(/D/, d).replace(/H/, h).replace(/M/, min)
      .replace(/S/, s);
  }
  return fmt.replace(/D/, d).replace(/H/, h).replace(/M/, min).replace(/S/, s);
}

export function formatLongDate(longTime, fmt) {
  if (!longTime || longTime <= 0) {
    return "";
  }
  return formatDate(new Date(Number(longTime)), fmt)
}

export function zeroFill(str) {
  if (str != null && parseInt(str) < 10) {
    return '0' + str;
  }
  return str;
}
// JavaScript Document
// winnerlib.js

function sprintf() {
  //  discuss at: http://phpjs.org/functions/sprintf/
  // original by: Ash Searle (http://hexmen.com/blog/)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Jack
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Dj
  // improved by: Allidylls
  //    input by: Paulo Freitas
  //    input by: Brett Zamir (http://brett-zamir.me)
  //   example 1: sprintf("%01.2f", 123.1);
  //   returns 1: 123.10
  //   example 2: sprintf("[%10s]", 'monkey');
  //   returns 2: '[    monkey]'
  //   example 3: sprintf("[%'#10s]", 'monkey');
  //   returns 3: '[####monkey]'
  //   example 4: sprintf("%d", 123456789012345);
  //   returns 4: '123456789012345'
  //   example 5: sprintf('%-03s', 'E');
  //   returns 5: 'E00'

  var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
  var a = arguments;
  var i = 0;
  var format = a[i++];

  // pad()
  var pad = function(str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' ';
    }
    var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
      .join(chr);
    return leftJustify ? str + padding : padding + str;
  };

  // justify()
  var justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
    var diff = minWidth - value.length;
    if (diff > 0) {
      if (leftJustify || !zeroPad) {
        value = pad(value, minWidth, customPadChar, leftJustify);
      } else {
        value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
      }
    }
    return value;
  };

  // formatBaseX()
  var formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
      '2': '0b',
      '8': '0',
      '16': '0x'
    }[base] || '';
    value = prefix + pad(number.toString(base), precision || 0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
  };

  // formatString()
  var formatString = function(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
    if (precision != null) {
      value = value.slice(0, precision);
    }
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
  };

  // doFormat()
  var doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
    var number, prefix, method, textTransform, value;

    if (substring === '%%') {
      return '%';
    }

    // parse flags
    var leftJustify = false;
    var positivePrefix = '';
    var zeroPad = false;
    var prefixBaseX = false;
    var customPadChar = ' ';
    var flagsl = flags.length;
    for (var j = 0; flags && j < flagsl; j++) {
      switch (flags.charAt(j)) {
        case ' ':
          positivePrefix = ' ';
          break;
        case '+':
          positivePrefix = '+';
          break;
        case '-':
          leftJustify = true;
          break;
        case "'":
          customPadChar = flags.charAt(j + 1);
          break;
        case '0':
          zeroPad = true;
          customPadChar = '0';
          break;
        case '#':
          prefixBaseX = true;
          break;
      }
    }

    // parameters may be null, undefined, empty-string or real valued
    // we want to ignore null, undefined and empty-string values
    if (!minWidth) {
      minWidth = 0;
    } else if (minWidth === '*') {
      minWidth = +a[i++];
    } else if (minWidth.charAt(0) == '*') {
      minWidth = +a[minWidth.slice(1, -1)];
    } else {
      minWidth = +minWidth;
    }

    // Note: undocumented perl feature:
    if (minWidth < 0) {
      minWidth = -minWidth;
      leftJustify = true;
    }

    if (!isFinite(minWidth)) {
      throw new Error('sprintf: (minimum-)width must be finite');
    }

    if (!precision) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
    } else if (precision === '*') {
      precision = +a[i++];
    } else if (precision.charAt(0) == '*') {
      precision = +a[precision.slice(1, -1)];
    } else {
      precision = +precision;
    }

    // grab value using valueIndex if required?
    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

    switch (type) {
      case 's':
        return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
      case 'c':
        return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
      case 'b':
        return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'o':
        return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'x':
        return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'X':
        return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
          .toUpperCase();
      case 'u':
        return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
      case 'i':
      case 'd':
        number = +value || 0;
        number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
        prefix = number < 0 ? '-' : positivePrefix;
        value = prefix + pad(String(Math.abs(number)), precision, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
      case 'e':
      case 'E':
      case 'f': // Should handle locales (as per setlocale)
      case 'F':
      case 'g':
      case 'G':
        number = +value;
        prefix = number < 0 ? '-' : positivePrefix;
        method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
        textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
        value = prefix + Math.abs(number)[method](precision);
        return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
      default:
        return substring;
    }
  };

  return format.replace(regex, doFormat);
}

function today() {       // 今天
  var d = new Date();
  return dateFormat(d);
}

function thisMonth() {   // 本月
  var d = new Date();
  return sprintf("%04d", d.getFullYear()) + "/" + sprintf("%02d", d.getMonth()+1) ;
}
function lastMonth() {  // 上個月
  var d = new Date();
  return sprintf("%04d", (d.getMonth()==0?d.getFullYear()-1:d.getFullYear())) + "/" + sprintf("%02d", (d.getMonth()==0?12:d.getMonth())  ) ;
}
function YearMonth(d) {
  if (d==null) d = new Date();
  if (typeof d =='object') return sprintf("%04d", d.getFullYear()) + "/" + sprintf("%02d", d.getMonth()+1);
  if (typeof d =='string') return d.substr(0,7);
  return "";
}

// 日期以 yyyy/mm/dd string 表示
function dateFormat(d) {
  if (d === '' || d == null || (typeof d == 'object' && !d.getMonth())) return '';
  var d1 = new Date(d);
  return sprintf("%04d", d1.getFullYear()) + "/" + sprintf("%02d", d1.getMonth()+1) + "/" + sprintf("%02d", d1.getDate());
}

// 經由 iframe POST 傳值來開新分頁
function openWindowWithPost(url, name, postData) {
  var html = "";
  html += "<html><head></head><body><form id='postformid' method='post' action='" + url + "' target='_blank'>";
  for ( data in postData) {
    itm = postData[data];
    if ((typeof itm)=="object") {
      for (v in itm) {
        vv = itm[v];
        html += "<input type='hidden' name='" + data+"["+v+"]" + "' value='" + vv + "'/>";
      }
    } else {
      html += "<input type='hidden' name='" + data + "' value='" + itm + "'/>";
    }
  }
  html += "</form><script type='text/javascript'>document.getElementById(\"postformid\").submit()</script></body></html>";
  var iframe = $('<iframe />').appendTo($('body'));
  var target = $(iframe).contents()[0];
  target.write(html);
  setTimeout(function() {    $("iframe:last").remove();  } , 1000);
  return ;
}

// 密碼
function encodepass(n_pass1)  {
   var n_pass1, n_pass2, n_count, n_pass3 ;
   n_pass2 = "" ;
   n_count = 1  ;
   n_len = n_pass1.length ;
   while (n_count <= n_len) {
      //n_code = n_pass1.toUpperCase().charCodeAt(n_count-1) + 17 + n_count * 2;
      //if (n_code==92) n_code = 32;  // \ => space
      //n_pass3 = String.fromCharCode( n_code );
      n_pass3 = String.fromCharCode(n_pass1.toUpperCase().charCodeAt(n_count-1) + 17 + n_count * 2);
      //n_pass3:= Chr(Asc(Upper(SubStr(n_pass1, n_count, 1))) + 17 + ;
      //   n_count * 2)
      n_pass2 = n_pass2 + n_pass3 ;
      n_count = n_count + 1 ;
   }
   //consoleLog(n_pass2);
   if (n_len < 7) {
      //n_pass2 = n_pass2 + SubStr(Space(14), 1, 7 - Len(n_pass2))
      for (i=n_count; i<8; i++) {
        //n_pass2 = n_pass2 + " ";  //String.formCharCode(32);
        n_pass2 = n_pass2 + String.fromCharCode(32 + 17 + i * 2);
      }
   }
   //consoleLog(n_pass2);
   return escape(n_pass2) ;
}
function decodepass(n_pass) {
   var n_pass1, n_pass2, n_count, n_pass3 ;
   n_pass1 = unescape(n_pass);
   n_pass2 = "" ;
   n_count = 1  ;
   n_len = n_pass1.length ;
   while (n_count <= n_len) {
      //n_code =  n_pass1.charCodeAt(n_count-1) - 17 - n_count * 2;
      //if (n_code==32 ) n_pass3 = "\\";  // \ => space
      //else
      //n_pass3 = String.fromCharCode(n_code).toUpperCase();
      n_pass3 = String.fromCharCode(n_pass1.charCodeAt(n_count-1) - 17 - n_count * 2).toUpperCase();
      //n_pass3:= Chr(Asc(Upper(SubStr(n_pass1, n_count, 1))) + 17 + ;
      //   n_count * 2)
      n_pass2 = n_pass2 + n_pass3 ;
      n_count = n_count + 1 ;
   }
   //consoleLog(n_pass2);
   if (n_len < 7) {
      //n_pass2 = n_pass2 + SubStr(Space(14), 1, 7 - Len(n_pass2))
      for (i=n_count; i<8; i++) {
        //n_pass2 = n_pass2 + " ";  //String.formCharCode(32);
        n_pass2 = n_pass2 + String.fromCharCode(32 + 17 + i * 2);
      }
   }
   //consoleLog(n_pass2);
   return n_pass2 ;
}

function pfString(str) {
  if (str==null || str=='') return 0;
  return parseFloat(str.replace(/,/g,''));
}

// form1欄位 去千位逗號 轉浮點數值
function pfForm1(fld) {
  //consoleLog(fld+" "+form1.get(fld).el.value+" "+form1.get(fld).el.value.replace(/,/g,''));
  return pfString(form1.get(fld).el.value);
}

// form2欄位 去千位逗號 轉浮點數值
function pfForm2(fld) {
  return pfString(form2.get(fld).el.value);
}


// form1 combo欄位 開窗以 | 分隔欄位  將其分解
function spForm1(src,fld) {
  var rtn=true;
  var v  = form1.record[src] = form1.get(src).el.value;
  if ((v!=null || v!='') && v.indexOf(' | ')>=0 ) {
    var afld = fld.split(',');
    var aval = v.split(' | ');
    if (afld.length>aval.length) rtn=false;
    else {
      for (i=0; i<afld.length; i++) {
        f = afld[i];
        form1.record[f]= aval[i];
        g = form1.get(f);
        if (g!=null && typeof g=='object') form1.record[f]=form1.get(f).el.value= aval[i];
      }
    }
  }
  return rtn;
}

// form2 combo欄位 開窗以 | 分隔欄位  將其分解
function spForm2(src,fld) {
  var rtn=true;
  var v  = form2.record[src] =  form2.get(src).el.value;
  if ((v!=null || v!='') && v.indexOf(' | ')>=0) {
    var afld = fld.split(',');
    var aval = v.split(' | ');
    if (afld.length>aval.length) rtn=false;
    else {
      for (i=0; i<afld.length; i++) {
        f = afld[i];
        form2.record[f]= aval[i];
        g = form2.get(f);
        if (g!=null && typeof g=='object') form2.record[f]=form2.get(f).el.value= aval[i];
      }
    }
  }
  return rtn;
}

// formp列表彈出對話框 combo欄位 開窗以 | 分隔欄位  將其分解
function spFormp(src,fld) {
  var rtn=true;
  var v  = formp.record[src] =  formp.get(src).el.value;
  if ((v!=null || v!='') && v.indexOf(' | ')>=0) {
    var afld = fld.split(',');
    var aval = v.split(' | ');
    if (afld.length>aval.length) rtn=false;
    else {
      for (i=0; i<afld.length; i++) {
        f = afld[i];
        formp.record[f]= aval[i];
        g = formp.get(f);
        if (g!=null && typeof g=='object') formp.record[f]=formp.get(f).el.value= aval[i];
      }
    }
  }
  return rtn;
}



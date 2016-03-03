//<script>
$(document).ready(function(){
  var MenuLock =false;
  jQuery.support.cors = true;   // IE 9.0 bug fix
  $(".MenuBlock").mouseover(function()  { if (MenuLock==false) $(this).children(".SubMenu").show(); } );
  $(".MenuBlock").mouseout( function()  { if (MenuLock==false) $(this).children(".SubMenu").hide(); } );
  $(".MenuBlock").css('width', $(window).width()/($(".MenuBlock").length+1));
  $(".SubMenu").hide();
  $(".MenuItem").mouseover(function() { $(this).addClass("MenuItemActive"); });
  $(".MenuItem").mouseout(function()  { $(this).removeClass("MenuItemActive"); });
  $(".MenuItem").click(function(event) {
      //consoleLog(this.id,$(this).attr("alt"));
      ReadJS(event.target.id , $(this).attr("alt"));
  });
  $(".MainMenu").click(function(event) {
    //consoleLog(MenuLock,event.target);
    if (MenuLock==false) {      MenuLock =event.target;    }
    else if (MenuLock==event.target) {$(this).children(".SubMenu").hide(); MenuLock=false; }
    else  {  MenuLock= event.target;  $(this).children(".SubMenu").show();}
  });
    $('#myLayout').w2layout({
        name: 'myLayout',
        panels: [
            { type: 'main', style: 'border: 1px solid #cfcfcf; padding: 5px;' }
        ],
        onRefresh: function() {
          $("#myLayout").css('height', $(window).height()-85);
          $("#myLayout").css('width', $(window).width()-10);
        }
     });
  $("#fixed-footer").css('width', $(window).width());
   $("#foot-left").click(function(event) {
      //consoleLog(w2ui['myLayout']);
      if (w2ui['myLayout'].panels[0].content!='')  {
        m = w2ui['myLayout'].panels[0].content.name;
        consoleLog(m);
        if(event.ctrlKey) {
          $.cookie("run_module",m);
          consoleLog("set cookie run_module");
        }
      }
   });
});

  $.ajaxSetup({cache:false, async:true})
  w2utils.locale('zh-tw');
  var isDebug=true;
  var JSconfig={};
  var pubConfig = {
    formc: {
      name: "formcusw0100",
      url: "cusm0100.php",
      fields: [
         { name  : "cust_no"   , type:"text"  }
        ,{ name  : "cust_na"   , type:"text"  }
        ,{ name  : "cust_fn"   , type:"text"  }
        ,{ name  : "tel1"      , type:"text"  }
        ,{ name  : "fax"       , type:"text"  }
        ,{ name  : "co_addr1"  , type:"text"  }
        ,{ name  : "co_addr3"  , type:"text"  }
        ,{ name  : "fsn"       , type:"text"  }
        ,{ name  : "remail"    , type:"text"  }
        ,{ name  : "pay_kind"  , type:"text"  }
      ]     }
    ,formv: {
       name: "formvenw0100"
      ,url: "venm0100.php"
      ,fields: [
         { name  : "cust_no"   , type:"text"  }
        ,{ name  : "cust_na"   , type:"text"  }
        ,{ name  : "cust_fn"   , type:"text"  }
        ,{ name  : "tel1"      , type:"text"  }
        ,{ name  : "fax"       , type:"text"  }
        ,{ name  : "co_addr1"  , type:"text"  }
        ,{ name  : "co_addr3"  , type:"text"  }
        ,{ name  : "fsn"       , type:"text"  }
      ]     }
    ,forms: {
       name: "formstkw0100"
      ,url: "stkm0100.php"
      ,fields: [
         { name  : "stk_no"   , type:"text"  }
        ,{ name  : "stk_na"   , type:"text"  }
        ,{ name  : "spec"     , type:"text"  }
        ,{ name  : "unit"     , type:"text"  }
      ]     }
    ,formb: {
      name: "formbomw0100",
      url: "bomm0100.php",
      fields: [
        { name  : "bom_no"   , type:"text"  },
        { name  : "stk_no"   , type:"text"  },
        { name  : "qty"      , type:"float"  }
      ]     }
    ,formw: {
      name: "formwktw0100",
      url: "wktm0100.php",
      fields: [
        { name  : "wkt_no"   , type:"text"  },
        { name  : "wkt_na"   , type:"text"  },
        { name  : "spec"     , type:"text"  }
      ]     }
    ,formk: {
      name: "formswkw0100",
      url: "swkm0100.php",
      fields: [
        { name  : "autoid"   , type:"text"  },
        { name  : "stk_no"   , type:"text"  },
        { name  : "stk_na"   , type:"text"  },
        { name  : "wkt_no"   , type:"text"  },
        { name  : "wkt_na"   , type:"text"  },
        { name  : "price"    , type:"text"  },
        { name  : "note"     , type:"text"  }
      ]     }
    ,forme: {
      name: "formempw0100",
      url: "empm0100.php",
      fields: [
        { name  : "emp_no"   , type:"text"  },
        { name  : "emp_name" , type:"text"  },
        { name  : "id_no"  , type:"text"  },
        { name  : "job"  , type:"text"  },
        { name  : "in_date"  , type:"text"  },
        { name  : "fr_date"  , type:"text"  },
        { name  : "mate"  , type:"text"  },
        { name  : "sons"  , type:"text"  },
        { name  : "bank"  , type:"text"  },
        { name  : "acc"  , type:"text"  },
        { name  : "base"  , type:"float"  },
        { name  : "base1"  , type:"float"  },
        { name  : "plus3"  , type:"float"  },
        { name  : "plus4"  , type:"float"  },
        { name  : "plus5"  , type:"float"  },
        { name  : "mnus3"  , type:"float"  },
        { name  : "mnus4"  , type:"float"  },
        { name  : "mnus5"  , type:"float"  },
        { name  : "mnus9"  , type:"float"  }
      ]    }
  };
  if (pubConfig.formc) formc = w2ui[pubConfig.formc.name] || $().w2form(pubConfig.formc);    // cusm0100    客戶
  if (pubConfig.formv) formv = w2ui[pubConfig.formv.name] || $().w2form(pubConfig.formv);    // venm0100    廠商
  if (pubConfig.formw) formw = w2ui[pubConfig.formw.name] || $().w2form(pubConfig.formw);    // wktm0100    加工
  if (pubConfig.forms) forms = w2ui[pubConfig.forms.name] || $().w2form(pubConfig.forms);    // stkm0100    貨品
  if (pubConfig.formb) formb = w2ui[pubConfig.formb.name] || $().w2form(pubConfig.formb);    // bomm0100    零件
  if (pubConfig.formk) formk = w2ui[pubConfig.formk.name] || $().w2form(pubConfig.formk);    // swkmm0100   工序
  if (pubConfig.forme) forme = w2ui[pubConfig.forme.name] || $().w2form(pubConfig.forme);    // empmm0100   員工

function consoleLog(){
  if(isDebug)
    for (i=0; i<arguments.length; i++) {
      console.log(arguments[i]);
    }
}

function ReadJS(jsFile , altMgrp) {
  loginMgrp = $.cookie("login_mgrp");
  //consoleLog(loginMgrp,altMgrp)
  if (altMgrp=='' || altMgrp==null || altMgrp==undefined || typeof altMgrp=='undefined') runIt = true;
  else if (loginMgrp.indexOf(altMgrp)<0) {w2alert("您無權限使用該項目功能...","權限不足"); runIt=false;}
  else runIt=true;
  if (runIt) {
    if (JSconfig[jsFile]) {
      config = JSconfig[jsFile];
      config.rePlay();
    } else {
      //consoleLog("Loading "+jsFile);
      $.getScript( jsFile+".js" , function( data, textStatus, jqxhr ) {
        //consoleLog( jsFile +" Load was performed." );
        })
        .done(function( script, textStatus ) {
          consoleLog( jsFile + " " +textStatus );
        })
        .fail(function( jqxhr, settings, exception ) {
          consoleLog("jqxhr",jqxhr);
          consoleLog("settings",settings);
          consoleLog("exception",exception);
          consoleLog( jsFile + " Triggered ajaxError handler." );
          w2alert("程式載入出錯, 請按 F5 鍵 , 重新整理畫面", "重整畫面" , function() {
            location.reload();
          });
      });
    }
  }
}

function padLeftZero(str,length){
    if(str.toString().length >= length)     {        return str;    }
    else    {        return padLeftZero("0" +str,length);    }
}

// JavaScript Document
// crcp0101.js
// 應收帳款明細表

$(function(){
  // 設定
  var config = {
     name: "crcp0101"
    ,dbMTable : "outh0100"
    ,dbMkey   : "doc_no"
    ,formp: {
       name: "formpcrcp0101"
      ,url: "crcp0101.php"
      //,header: "應收帳款明細表"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "bgn_ym", type:"text", required: true , html: {caption:"月份  從", span:11, attr:"size=10 "} }
        ,{ name : "end_ym", type:"text", required: true , html: {caption:"至"      , span:15, attr:"size=10 "} }
        ,{ name : "recf"  , type:"list", required: false, html: {caption:"收款條件", span:11 }
          , options:{items:[{id:"1",text:"未收"},{id:"2",text:"全部"} ] }  }
        ,{ name : "usdtwd", type:"list", required: false, html: {caption:"幣別", span:11 }
          , options:{items:[{id:"TWD",text:"台幣"},{id:"USD",text:"美金"} ] }  }
        ,{ name : "sort"  , type:"list", required: false, html: {caption:"排序", page:1, span:11 }
          , options:{items:[{id:"date,cust_no",text:"日期-客戶(升冪)"},{id:"cust_no,date",text:"客戶-日期(升冪)"} ] }  }
        ,{ name : "paper" , type:"list", required: false, html: {caption:"紙張", page:1,span:11}
        , options:{items:[{id:"A4P",text:"A4紙-直印"},{id:"A4L",text:"A4紙-橫印"}
        ,{id:"Letter",text:"Letter連續報表紙-11吋"},{id:"Letter2",text:"Letter連續報表紙-中一刀"}]} }
        ,{ name : "rows" , type:"int"  , required: false, html: {caption:"每頁筆數", page:1,span:11}}
      ]
      ,tabs: [
          { id: 'tab1', caption: '條件' }
         ,{ id: 'tab2', caption: '選項' }
      ]
      ,onRender: function(event)  {
         formp.record['paper']="A4L";
         formp.record['rows']=25;
         consoleLog(config.name+" load default "+formp.record['paper']+" "+formp.record['rows']+" rows");
         var d = new Date()
         formp.record['bgn_ym']=lastMonth().replace("/","");
         formp.record['end_ym']=lastMonth().replace("/","");
         formp.record['recf']="1";
         formp.record['usdtwd']="TWD";
         formp.record['sort']="date,cust_no";
      }
      ,actions: {
        print: {caption:"製表" , "class":"btnwodmSave" ,onClick:function(event) {
          //consoleLog(formp.record);
            postData={};
            postData['range']={};
            postData['param']={};
            postData['config']={};
            postData['cmd']='print-data';
            postData['range']['bgn_ym']=formp.record['bgn_ym'] ;
            postData['range']['end_ym']=formp.record['end_ym'] ;
            postData['param']['recf']=formp.record['recf'].id ;
            postData['param']['usdtwd']=formp.record['usdtwd'].id ;
            postData['param']['sort']=formp.record['sort'].id;
            postData['config']['paper']=formp.record['paper'].id;
            postData['config']['rows'] =formp.record['rows'];
            consoleLog(postData);
            url= config.name + ".php";
            openWindowWithPost(url,"_blank", postData);
            $().w2popup('close');
        }}
        ,cancel: {caption:"取消" , "class":"btnwodmCancel" , onClick: function(event) {
            $().w2popup('close');
        }  }
      }
    }
    , rePlay : function () {
        if (config.formp) formp = w2ui[config.formp.name] || $().w2form(config.formp);
        $().w2popup('open', {
            title   : '應收帳款明細表',
            body    : '<div id="pop_print" style="width:99%; height:96%"></div>',
            style   : 'padding: 15px 0px 0px 0px',
            width   : 480,
            height  : 400,
            onOpen  : function (event) {
                event.onComplete = function () {
                    $('#w2ui-popup #pop_print').w2render(config.formp.name);
                }
            }
        });
    }
  };

  procid=config.name;
  if ( ! w2ui[config.name]) {
    JSconfig[config.name]=config;
  }
  config.rePlay();

})
//open('','_blank','width=400,height=100,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes')


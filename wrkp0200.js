// JavaScript Document
// wrkp0200.js
// 廠商己訂未交貨明細表

$(function(){
  // 設定
  var config = {
     name: "wrkp0200"
    ,dbMTable : "wrkm0100"
    ,dbMkey   : "doc_no"
    ,formp: {
       name: "formpwrkp0200"
      ,url: "wrkp0200.php"
      //,header: "廠商己訂未交貨明細表"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "bom_no",type:"combo", required: true , html: {caption:"機種代號", span:11, attr:"size=10 "}, options:{url:"bomm0100.php"} }
        ,{ name : "bom_na",type:"text" , required: false, html: {caption:"品名", span:11, attr:"size=30 readonly"} }
        ,{ name : "end_dt", type:"date", required: true , html: {caption:"預定交貨  至", span:11, attr:"size=10 "} }
        ,{ name : "sort"  , type:"list", required: false, html: {caption:"排序", page:1, span:11 }
          , options:{items:[{id:"cust_no,date",text:"廠商-日期(升冪)"},{id:"date,doc_no",text:"日期-單號(升冪)"},{id:"stk_no,date",text:"貨品-日期(升冪)"}
              ,{id:"qty DESC",text:"訂購量(降冪)"},{id:"qty1 DESC",text:"不足數(降冪)"}]
          }  }
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
         //var d = new Date()
         //formp.record['bgn_dt']=d.getFullYear()+"/01/01";
         formp.record['end_dt']=today();
         formp.record['sort']="cust_no,date";
      }
      ,onChange: function(event)  {
          switch(event.target)  {
            case "bom_no"  :
                if (!spFormp('bom_no','bom_no,bom_na'))  w2alert('欄位選擇不正確');
                break;
        }
      }
      ,actions: {
        print: {caption:"製表" , "class":"btnSave" ,onClick:function(event) {
          //consoleLog(formp.record);
            postData={};
            postData['range']={};
            postData['param']={};
            postData['config']={};
            postData['cmd']='print-data';
            if(formp.record['bom_no']) {
                if (!spFormp('bom_no','bom_no,bom_na'))  w2alert('欄位選擇不正確');
            }
            postData['range']['bom_no']=formp.record['bom_no'] ;
            postData['range']['end_dt']=formp.record['end_dt'] ;
            postData['param']['bom_na']=formp.record['bom_na'] ;
            postData['param']['sort']=formp.record['sort'].id;
            postData['config']['paper']=formp.record['paper'].id;
            postData['config']['rows'] =formp.record['rows'];
            consoleLog(postData);
            url= config.name + ".php";
            openWindowWithPost(url,"_blank", postData);
            $().w2popup('close');
        }}
        ,cancel: {caption:"取消" , "class":"btnCancel" , onClick: function(event) {
            $().w2popup('close');
        }  }
      }
    }
    , rePlay : function () {
      if (config.formp) formp = w2ui[config.formp.name] || $().w2form(config.formp);
      $().w2popup('open', {
          title   : '廠商己訂未交貨明細表',
          body    : '<div id="pop_print" style="width:99%; height:96%"></div>',
          style   : 'padding: 15px 0px 0px 0px',
          width   : 480,
          height  : 300,
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


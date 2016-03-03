// JavaScript Document
// bomp0100.js
// 機種庫存表

$(function(){
  // 設定
  var config = {
     name: "bomp0100"
    ,dbMTable : "bomm0100"
    ,dbMkey   : "bom_no"
    ,formp: {
       name: "formpbomp0100"
      ,url: "bommm0100.php"
      //,header: "機種庫存表"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "bom_no", type:"combo",required: true , html: {caption:"機種", span:11, attr:"size=20 "}, options:{url:"stkm0100.php"} }
        ,{ name : "bom_na", type:"text", required: true , html: {caption:"名稱", span:11, attr:"size=30 readonly"} }
        ,{ name : "qty"   , type:"int" , required: true , html: {caption:"基數", span:11, attr:"size=10 "} }
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
         formp.record['paper']="A4P";
         formp.record['rows']=40;
         consoleLog(config.name+" load default "+formp.record['paper']+" "+formp.record['rows']+" rows");
      }
      ,onChange: function(event)  {
          switch(event.target)  {
            case "bom_no"  :
                if (!spFormp('bom_no','bom_no,bom_na'))  w2alert('欄位選擇不正確');
                break;
        }
      }
      ,actions: {
        print: {caption:"製表" , "class":"btnwodmSave" ,onClick:function(event) {
          //consoleLog(formp.record);
            postData={};
            postData['range']={};
            postData['param']={};
            postData['config']={};
            postData['cmd']='print-data';
            if (!spFormp('bom_no','bom_no,bom_na'))  w2alert('欄位選擇不正確');
            postData['range']['bom_no']=formp.record['bom_no'] ;
            postData['range']['bom_na']=formp.record['bom_na'] ;
            postData['param']['qty']=formp.record['qty'] ;
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
            title   : '機種庫存表',
            body    : '<div id="pop_print" style="width:99%; height:96%"></div>',
            style   : 'padding: 15px 0px 0px 0px',
            width   : 480,
            height  : 320,
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


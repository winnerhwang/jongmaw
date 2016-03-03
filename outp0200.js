// JavaScript Document
// outp0200.js
// 客戶出貨帳款統計表

$(function(){
  // 設定
  var config = {
     name: "outp0200"
    ,dbMTable : "outh0100"
    ,dbMkey   : "doc_no"
    ,formp: {
       name: "formpoutp0200"
      ,url: "outp0200.php"
      //,header: "客戶出貨帳款統計表"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "yymm"  , type:"text", required: true , html: {caption:"帳款月份", span:11, attr:"size=10 "} }
        ,{ name : "tran"  , type:"list", required: false, html: {caption:"更新帳款", span:11 }, options:{items: [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]}}
        ,{ name : "trlst" , type:"list", required: false, html: {caption:"結轉前期", span:11 }, options:{items: [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]}}
        ,{ name : "sort"  , type:"list", required: false, html: {caption:"排序", page:1, span:11 }
          , options:{items:[{id:"cust_no ASC",text:"客戶編號(升冪)"},{id:"amt DESC",text:"出貨金額(降冪)"}]
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
         formp.record['paper']="A4P";
         formp.record['rows']=40;
         consoleLog(config.name+" load default "+formp.record['paper']+" "+formp.record['rows']+" rows");
         formp.record['yymm']=lastMonth().replace("/","");
         formp.record['tran']="Y";
         formp.record['trlst']="N";
         formp.record['sort']="cust_no ASC";
      }
      ,actions: {
        print: {caption:"製表" , "class":"btnwodmSave" ,onClick:function(event) {
          //consoleLog(formp.record);
            postData={};
            postData['range']={};
            postData['param']={};
            postData['config']={};
            postData['cmd']='print-data';
            postData['range']['yymm']=formp.record['yymm'] ;
            postData['param']['tran']=formp.record['tran'].id;
            postData['param']['trlst']=formp.record['trlst'].id;
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
          title   : '客戶出貨帳款統計表',
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


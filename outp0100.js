// JavaScript Document
// outp0100.js
// 應收帳款請款單

$(function(){
  // 設定
  var config = {
     name: "outp0100"
    ,dbMTable : "outh0100"
    ,dbMkey   : "doc_no"
    ,formp: {
       name: "formpoutp0100"
      ,url: "outp0100.php"
      //,header: "應收帳款請款單"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "doc_no" ,type:"text" , required: true , html: {caption:"出貨單號", span:11, attr:"size=10 "} }
        ,{ name : "sort"  , type:"list", required: false, html: {caption:"排序", page:1, span:11 }
          , options:{items:[{id:"doc_no",text:"出貨單號(升冪)"}]
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
         formp.record['paper']="Letter2";
         formp.record['rows']=10;
         consoleLog(config.name+" load default "+formp.record['paper']+" "+formp.record['rows']+" rows");
         //var d = new Date()
         //formp.record['bgn_dt']=d.getFullYear()+"/01/01";
         //formp.record['end_dt']=today();
         formp.record['sort']="doc_no";
         if (typeof print_doc!='undefined' && print_doc!=null && print_doc!='') formp.record['doc_no']= print_doc;
      }
      ,actions: {
        print: {caption:"製表" , "class":"btnSave" ,onClick:function(event) {
          //consoleLog(formp.record);
            postData={};
            postData['range']={};
            postData['param']={};
            postData['config']={};
            postData['cmd']='print-data';
            postData['range']['doc_no']=formp.record['doc_no'] ;
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
          title   : '應收帳款請款單-列印',
          body    : '<div id="pop_print" style="width:99%; height:96%"></div>',
          style   : 'padding: 15px 0px 0px 0px',
          width   : 520,
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


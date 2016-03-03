// JavaScript Document
// outp0501.js
// 外銷貨品成本統計分析表

$(function(){
  // 設定
  var config = {
     name: "outp0501"
    ,dbMTable : "outh0100"
    ,dbMkey   : "doc_no"
    ,formp: {
       name: "formpoutp0501"
      ,url: "outp0501.php"
      //,header: "外銷貨品成本統計分析表"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "bgn_dt", type:"date", required: true , html: {caption:"日期　從", span:11, attr:"size=10 "} }
        ,{ name : "end_dt", type:"date", required: true , html: {caption:"至"      , span:15, attr:"size=10 "} }
        ,{ name : "sort"  , type:"list", required: false, html: {caption:"排序"    , page:1, span:11 }
          , options:{items:[{id:"stk_no ASC",text:"貨品編號(升冪)"},{id:"amt DESC",text:"銷售金額(降冪)"}]
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
         formp.record['bgn_dt']=lastMonth()+("/01");
         formp.record['end_dt']=today();
         formp.record['sort']="stk_no ASC";
      }
      ,actions: {
        print: {caption:"製表" , "class":"btnSave" ,onClick:function(event) {
          //consoleLog(formp.record);
            postData={};
            postData['range']={};
            postData['param']={};
            postData['config']={};
            postData['cmd']='print-data';
            postData['range']['bgn_dt']=formp.record['bgn_dt'] ;
            postData['range']['end_dt']=formp.record['end_dt'] ;
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
          title   : '外銷貨品成本統計分析表',
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


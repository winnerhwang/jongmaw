// JavaScript Document
// isup0400.js
// 廠商入庫明細表

$(function(){
  // 設定
  var config = {
     name: "isup0402"
    ,dbMTable : "isuh0100"
    ,dbMkey   : "doc_no"
    ,formp: {
       name: "formpisup0402"
      ,url: "isup0402.php"
      //,header: "廠商入庫明細表"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "cust_no",type:"combo",required: true , html: {caption:"廠商編號", span:11, attr:"size=20 "}, options:{url:"venm0100.php"} }
        ,{ name : "cust_na",type:"text", required: false, html: {caption:"廠商簡稱", span:11, attr:"size=30 readonly"} }
        ,{ name : "bgn_dt", type:"date", required: true , html: {caption:"日期  從", span:11, attr:"size=10 "} }
        ,{ name : "end_dt", type:"date", required: true , html: {caption:"至"      , span:15, attr:"size=10 "} }
        ,{ name : "stk_no", type:"combo",required: false, html: {caption:"貨品編號", span:11, attr:"size=20 "}, options:{url:"stkm0100.php"} }
        ,{ name : "stk_na", type:"text", required: false, html: {caption:"貨品名稱", span:11, attr:"size=30 readonly"} }
        ,{ name : "spec"  , type:"text", required: false, html: {caption:"貨品規格", span:11, attr:"size=30 readonly"} }
        ,{ name : "sort"  , type:"list", required: false, html: {caption:"排序", page:1, span:11 }
          , options:{items:[{id:"date,doc_no",text:"日期-單號(升冪)"},{id:"stk_no,date",text:"貨品-日期(升冪)"}
              ,{id:"qty DESC",text:"入庫量(降冪)"},{id:"amt DESC",text:"入庫額(降冪)"}]
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
         var d = new Date()
         formp.record['bgn_dt']=d.getFullYear()+"/01/01";
         formp.record['end_dt']=today();
         formp.record['sort']="date,doc_no";
      }
      ,onChange: function(event)  {
          switch(event.target)  {
            case "stk_no"  :
                if (!spFormp('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
                forms.recid=forms.postData['stk_no']=formp.record['stk_no']
                forms.reload( function(data){
                  if (data.status="success") {
                    formp.record['spec']=formp.get('spec').el.value= forms.record['spec'];
                  } else consoleLog("stk spec not set");
                });
                break;
            case "cust_no"  :
                if (!spFormp('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
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
            if(formp.record['stk_no']) {
                if (!spFormp('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
            }
            if(formp.record['cust_no']) {
                if (!spFormp('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
            }
            postData['range']['cust_no']=formp.record['cust_no'] ;
            postData['range']['stk_no']=formp.record['stk_no'] ;
            postData['param']['stk_na']=formp.record['stk_na'] ;
            postData['param']['spec']=formp.record['spec'] ;
            postData['range']['bgn_dt']=formp.record['bgn_dt'] ;
            postData['range']['end_dt']=formp.record['end_dt'] ;
            postData['param']['cust_na']=formp.record['cust_na'] ;
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
          title   : '廠商入庫明細表',
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


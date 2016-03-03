// JavaScript Document
// isup0300.js
// 應付帳款對帳單

$(function(){
  // 設定
  var config = {
     name: "isup0300"
    ,dbMTable : "isuh0100"
    ,dbMkey   : "doc_no"
    ,formp: {
       name: "formpisup0300"
      ,url: "isup0300.php"
      //,header: "應付帳款對帳單"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "yymm"   , type:"text",required: true , html: {caption:"帳款月份", span:11, attr:"size=10 "} }
        ,{ name : "cust_no",type:"combo",required: true , html: {caption:"廠商編號", span:11, attr:"size=10 "}, options:{url:"venm0100.php"} }
        ,{ name : "cust_na",type:"text", required: false, html: {caption:"廠商簡稱", span:15, attr:"size=10 readonly"} }
        ,{ name : "cust_fn",type:"text" ,required: false, html: {caption:"全名"    , span:11, attr:"size=30 readonly"} }
        ,{ name : "tel1"   ,type:"text" ,required: false, html: {caption:"電話"    , span:11, attr:"size=20 readonly"} }
        ,{ name : "fax"    ,type:"text" ,required: false, html: {caption:"傳真"    , span:15, attr:"size=20 readonly"} }
        ,{ name : "addr1"  ,type:"text" ,required: false, html: {caption:"公司地址", span:11, attr:"size=40 readonly"} }
        ,{ name : "sort"   , type:"list",required: false, html: {caption:"排序", page:1, span:11 }
          , options:{items:[{id:"date,doc_no,stk_no",text:"日期-單號(升冪)"},{id:"amt DESC",text:"進貨金額(降冪)"}]
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
         formp.record['yymm']=lastMonth().replace("/","");
         formp.record['sort']="date,doc_no,stk_no";
      }
      ,onChange: function(event)  {
          switch(event.target)  {
            case "cust_no"  :
                if (!spFormp('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
                formv.recid=formv.postData['cust_no']= formp.record['cust_no'];
                formv.reload( function(data){
                  if (data.status="success") {
                    consoleLog("set fullname",data,formv);
                    formp.record['cust_fn']=formp.get('cust_fn').el.value= formv.record['cust_name'];
                    formp.record['tel1']   =formp.get('tel1'   ).el.value= formv.record['tel1'];
                    formp.record['fax']    =formp.get('fax'    ).el.value= formv.record['fax'];
                    formp.record['addr1']  =formp.get('addr1'  ).el.value= formv.record['co_addr1'];
                  } else consoleLog("cust fullname not set");
                });
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
            if(formp.record['cust_no']) {
                if (!spFormp('cust_no','cust_no'))  w2alert('欄位選擇不正確');
            }
            postData['range']['cust_no']=formp.record['cust_no'] ;
            postData['range']['yymm']   =formp.record['yymm'] ;
            postData['param']['cust_fn']=formp.record['cust_fn'] ;
            postData['param']['tel1'   ]=formp.record['tel1'] ;
            postData['param']['fax'    ]=formp.record['fax'] ;
            postData['param']['addr1'  ]=formp.record['addr1'] ;
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
          title   : '應付帳款對帳單',
          body    : '<div id="pop_print" style="width:99%; height:96%"></div>',
          style   : 'padding: 15px 0px 0px 0px',
          width   : 520,
          height  : 360,
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


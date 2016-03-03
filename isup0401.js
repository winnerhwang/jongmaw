// JavaScript Document
// isup0401.js
// 託工入庫統計表

$(function(){
  // 設定
  var config = {
     name: "isup0401"
    ,dbMTable : "outh0100"
    ,dbMkey   : "doc_no"
    ,formp: {
       name: "formpisup0401"
      ,url: "isup0401.php"
      //,header: "託工入庫統計表"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "bgn_dt", type:"date", required: true , html: {caption:"日期  從", span:11, attr:"size=10 "} }
        ,{ name : "end_dt", type:"date", required: true , html: {caption:"至"      , span:15, attr:"size=10 "} }
        ,{ name : "base"  , type:"text", required: false, html: {caption:"平均基數", span:11, attr:"size=10 "} }
        ,{ name : "sort"  , type:"list", required: false, html: {caption:"排序", page:1, span:11 }
          , options:{items:[{id:"stk_no ASC",text:"貨品編號(升冪)"},{id:"out_cnt DESC",text:"筆數(降冪)"}
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
         formp.record['base']=1;
         formp.record['sort']="stk_no ASC";
      }
      ,onChange: function(event)  {
          switch(event.target)  {
            case "bgn_dt"  :
            case "bgn_dt"  :
                var v  = formp.get(event.target).el.value;
                formp.record['bgn_dt']=formp.get('bgn_dt').el.value=dateFormat(v);
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
            postData['range']['bgn_dt']=formp.record['bgn_dt'] ;
            postData['range']['end_dt']=formp.record['end_dt'] ;
            postData['param']['base']=formp.record['base'] ;
            postData['param']['sort']=formp.record['sort'].id;
            postData['config']['paper']=formp.record['paper'].id;
            postData['config']['rows'] =formp.record['rows'];
            consoleLog(postData);
            url= config.name + ".php";
            openWindowWithPost(url,"_blank", postData);
            //winOptions="";      // 無參數 以 分頁開啟
            //winOptions="height="+(screen.availHeight-100)+",width="+(screen.availWidth-60)
            //    +",menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes";
            //postData = (typeof postData == 'object' ? String($.param(postData, false)).replace(/%5B/g, '[').replace(/%5D/g, ']') : postData);
            //url = url + "?" + postData;
            //window.open(url, "_blank", winOptions);
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
          title   : '託工入庫統計表',
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


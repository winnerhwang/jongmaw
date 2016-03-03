// JavaScript Document
// sryp0102.js
// 薪資月總表

$(function(){
  // 設定
  var config = {
     name: "sryp0102"
    ,dbMTable : "srym0100"
    ,dbMkey   : "autoid"
    ,formp: {
       name: "formpsryp0102"
      ,url: "sryp0102.php"
      //,header: "薪資月總表"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "yymm"   , type:"text" , required: true , html: {caption:"發薪月份", span:11, attr:"size=10 "} }
        ,{ name : "bgn_emp", type:"combo", required: true , html: {caption:"員工  從", span:11, attr:"size=10 "}, options:{url:"empm0100.php"} }
        ,{ name : "end_emp", type:"combo", required: true , html: {caption:"至"      , span:15, attr:"size=10 "}, options:{url:"empm0100.php"} }
        ,{ name : "sort"  , type:"list", required: false, html: {caption:"排序", page:1, span:11 }
          , options:{items:[{id:"emp_no ASC",text:"員工(升冪)"},{id:"emp_no DESC",text:"員工(降冪)"}
          ]}  }
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
         formp.record['yymm']=lastMonth().replace("/","");
         formp.record['bgn_emp']="";
         formp.record['end_emp']="ZZZ";
         formp.record['sort']="emp_no ASC";
      }
      ,onChange: function(event)  {
          switch(event.target)  {
            case "bgn_emp"  :
                if (!spFormp('bgn_emp','bgn_emp'))  w2alert('欄位選擇不正確');
                break;
            case "end_emp"  :
                if (!spFormp('end_emp','end_emp'))  w2alert('欄位選擇不正確');
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
            postData['range']['yymm']=formp.record['yymm'] ;
            if(formp.record['bgn_emp']) {
                if (!spFormp('bgn_emp','bgn_emp'))  w2alert('欄位選擇不正確');
            }
            if(formp.record['end_emp']) {
                if (!spFormp('end_emp','end_emp'))  w2alert('欄位選擇不正確');
            }
            postData['range']['bgn_emp']=formp.record['bgn_emp'] ;
            postData['range']['end_emp']=formp.record['end_emp'] ;
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
          title   : '薪資月總表',
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


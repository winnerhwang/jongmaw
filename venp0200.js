// JavaScript Document
// bomp0101.js
// 機種成本表

$(function(){
  // 設定
  var config = {
     name: "venp0200"
    ,dbMTable : "venm0100"
    ,dbMkey   : "cust_no"
    ,formp: {
       name: "formpvenp0200"
      ,url: "venp0200.php"
      //,header: "廠商資料對照表"
      //,itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]
      ,fields: [
         { name : "bgn_cus", type:"combo", required: true , html: {caption:"廠商  從", span:11, attr:"size=10 "}, options:{url:"venm0100.php"} }
        ,{ name : "end_cus", type:"combo", required: true , html: {caption:"至"      , span:15, attr:"size=10 "}, options:{url:"venm0100.php"} }
        ,{ name : "cuslist", type:"enum" , required: false, html: {caption:"廠商(複選)", span:11, attr:"size=50 "}, options:{url:"venm0100.php"} }
        ,{ name : "sort"  , type:"list", required: false, html: {caption:"排序", page:1, span:11 }
          , options:{items:[{id:"cust_no",text:"編號(升冪)"},{id:"cust_abbr",text:"簡稱(升冪)"},{id:"tel1",text:"電話(升冪)"}
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
         formp.record['paper']="A4P";
         formp.record['rows']=40;
         consoleLog(config.name+" load default "+formp.record['paper']+" "+formp.record['rows']+" rows");
         formp.record['bgn_cus']="";
         formp.record['end_cus']="ZZZ";
         formp.record['addrx']="co_addr1";
         formp.record['sort']="cust_no";
         formp.record['cuslist']='';
         if (typeof print_lst=='object')  formp.record['cuslist']=print_lst;
         else if (typeof print_cus!='undefined' && print_cus!=null && print_cus!='') formp.record['bgn_cus']=formp.record['end_cus']= print_cus;
      }
      ,onChange: function(event)  {
          switch(event.target)  {
            case "bgn_cus"  :
                if (!spFormp('bgn_cus','bgn_cus'))  w2alert('欄位選擇不正確');
                break;
            case "end_cus"  :
                if (!spFormp('end_cus','end_cus'))  w2alert('欄位選擇不正確');
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
            if (!spFormp('bgn_cus','bgn_cus'))  w2alert('欄位選擇不正確');
            if (!spFormp('end_cus','end_cus'))  w2alert('欄位選擇不正確');
            postData['range']['bgn_cus']=formp.record['bgn_cus'] ;
            postData['range']['end_cus']=formp.record['end_cus'] ;
            cuslst = "";
            for (e in formp.record['cuslist']) {
              cus = formp.record['cuslist'][e];
              cuslst += (cuslst==''?'':',') + ((typeof cus=='object') ? cus.id : cus);
            }
            postData['param']['cuslist']=cuslst;
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
            title   : '廠商資料對照表',
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


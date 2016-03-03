// JavaScript Document
// stkb0200.js
$(function(){
  // 設定
  var config = {
    name: "stkb0200",
    dbMTable : "stkm0100",
    dbMkey   : "skt_no",
    //dbSTable : "outi0100",
    //dbSkey   : "autoid",
    dbRelVal : "",
    opMode   : "browse",
    mainscr: {
      name: "stkb0200" ,
      panels:[
        {type: "left"    , "size":"30%", "resizable": true } ,
        {type: "main"    , "size":"25%", "resizable": true } ,
        {type: "preview" , "size":"75%", "resizable": true }
      ]
    } ,
    grid1: {
        name: "grid1stkb0200",
        url: "stkm0200.php",
        header: "貨品資料清單",
        columns: [
            { field: "stk_no"  , caption: "貨品編號", size: "20%" , sortable: true },
            { field: "stk_namc", caption: "貨品名稱", size: "40%" , sortable: true },
            { field: "qty"     , caption: "庫存量"  , size: "40%" , sortable: true  , style:"text-align:right;" , render:'float:0' }
        ],
        multiSort: true,
        multiSelect:true,
         sortData: [
            { field: 'stk_no', direction: 'asc' },
            { field: 'stk_namc', direction: 'asc' },
            { field: 'spec', direction: 'asc' }
        ],
        show: {
            header        : true,
            toolbar       : true,
            footer        : true,
            toolbarAdd    : false,
            toolbarEdit   : false,
            toolbarDelete : false
        },
        multiSearch: true,
        searches: [
            { field: "stk_no"  , caption: "貨品編號", type: "text", operator: "contains" },
            { field: "stk_namc", caption: "貨品名稱", type: "text", operator: "contains" },
            { field: "spec"    , caption: "規格"    , type: "text", operator: "contains" }
        ],
        onLoad: function(event){
            event.onComplete = function () {
              grid1.click(lstRecid);
            };
        },
        onClick: function(event){
            config.opMode = "browse";
            var rcd=grid1.get(event.recid);
            if (rcd==null)                 rcd=grid1.records[0];
            if (rcd!=null)  {
              form1.record['stk_no']= event.recid;
              //consoleLog(form1.record['stk_no']);
              form1.refresh();
                //form1.postData[config.dbMkey]= rcd[config.dbMkey];
                //form1.recid=rcd['recid'];
                //form1.reload();
                //grid2.searchData[0].value= rcd[config.dbMkey];
                //grid2.reload();
                lstRecid=rcd[config.dbMkey];
            } else {
              //grid2.clear();
                lstRecid=0;
            }
            //form1.disable(form1.fields);
            //$(".w2ui-input:input").attr('disabled',true);
            //$(".w2ui-btn:button").attr('disabled',false);
        }
    } ,
    form1: {
      name: "form1stkb0200",
      //url: "stkm0100.php",
      header: "庫存異動資料明細-瀏覽",
      fields: [
        { name  : "stk_no"  , type:"text" , required: true , html: {caption:"貨品編號", span:11 ,attr:'size="10" readonly'} },
        { name  : "bgn_dt"  , type:"date" , required: false, html: {caption:"起始日期", span:15 ,attr:'size="10"' }}
      ],
        onRender: function(event){
            event.onComplete = function () {
              form1.record['bgn_dt']=lastMonth()+'/01';
            };
        },
      actions: {
        "Search": {caption:"查詢",onClick:function(event) {
                grid2.searchData[0].value= form1.record['stk_no'];
                grid2.searchData[1].value= form1.record['bgn_dt'];
                grid2.reload();

        }}
      }
    },
    grid2: {
        name: "grid2stkb0200",
        url: "stkb0200.php",
        //header: "庫存異動資料明細",
        multiSelect:true,
        columns: [
            { field: "stk_no"   , caption: "貨品編號", size: "1% " , hidden:true },
            { field: "date"     , caption: "異動日期", size: "15%"    },
            { field: "tr"       , caption: "異動別"  , size: "10%"  },
            { field: "doc_no"   , caption: "異動單號", size: "15%"  },
            { field: "cust_no"  , caption: "異動對象", size: "15%"  },
            { field: "srqty"    , caption: "異動數量", size: "10%" , style:"text-align:right;" , render:'float:0'  },
            { field: "pm"       , caption: "進出"  , size: "5%"  },
            { field: "inqty"    , caption: "進數量"  , size: "10%" , style:"text-align:right;" , render:'float:0'  },
            { field: "outqty"   , caption: "出數量"  , size: "10%" , style:"text-align:right;" , render:'float:0'  }
            //{ field: "bnqty"    , caption: "結餘數量", size: "10%" , style:"text-align:right;" , render:'float:0'  },
        ],
        searchData : [
            { field : 'stk_no', value : "" , operator : 'is'   , type: 'text' }
          , { field : 'date'  , value : "" , operator : 'begin', type: 'date' }
        ],
        show: {
            header        : false,
            toolbar       : false,
            footer        : true
        },
        onLoad: function(event){
            event.onComplete = function () {
              if (grid2.total == grid2.records.length) {
                consoleLog(grid2.total);
                grid2.summary[0] = new Array();
                grid2.summary[0]['recid']= grid2.total;
                grid2.summary[0]['srqty']=grid2.summary[0]['inqty']=grid2.summary[0]['outqty'] =0;
                for (i=0; i<grid2.total; i++) {
                  grid2.summary[0]['inqty'] += pfString(grid2.records[i]['inqty']);
                  grid2.summary[0]['outqty']+= pfString(grid2.records[i]['outqty']);
                }
                  grid2.summary[0]['srqty']  = grid2.summary[0]['inqty'] - grid2.summary[0]['outqty'] ;
              }
            }
        },
    }
    , rePlay : function () {
        if (config.grid1) grid1 = w2ui[config.grid1.name] || $().w2grid(config.grid1);
        if (config.form1) form1 = w2ui[config.form1.name] || $().w2form(config.form1);
        if (config.grid2) grid2 = w2ui[config.grid2.name] || $().w2grid(config.grid2);
        if (config.form2) form2 = w2ui[config.form2.name] || $().w2form(config.form2);
        if (config.formc) formc = w2ui[config.formc.name] || $().w2form(config.formc);    // cusm0100    客戶
        if (config.formv) formv = w2ui[config.formv.name] || $().w2form(config.formv);    // venm0100    廠商
        if (config.formw) formw = w2ui[config.formw.name] || $().w2form(config.formw);    // wktm0100    加工
        if (config.forms) forms = w2ui[config.forms.name] || $().w2form(config.forms);    // stkm0100    貨品
        if (config.formb) formb = w2ui[config.formb.name] || $().w2form(config.formb);    // bomm0100    零件
        if (config.formk) formk = w2ui[config.formk.name] || $().w2form(config.formk);    // swkmm0100   工序
        if (config.forme) forme = w2ui[config.forme.name] || $().w2form(config.forme);    // empmm0100   員工
        w2ui.myLayout.content('main'   , w2ui[config.name]);
        w2ui[config.name].content('left'   , grid1);
        w2ui[config.name].content('main'  , form1);
        w2ui[config.name].content('preview', grid2);
    }
  };


  procid=config.name;
  if ( ! w2ui[config.name]) {
    lstRecid=0;
    JSconfig[config.name]=config;
    $().w2layout(config.mainscr);
  }
  config.rePlay();

});
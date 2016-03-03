// JavaScript Document
// wktm0100.js
$(function(){
  // 設定
  var config = {
    name: "wktm0100",
    dbMTable : "wktm0100",
    dbMkey   : "wkt_no",
    opMode   : "browse",
    mainscr: {
      name: "wktm0100" ,
      panels:[
        {type: "main" , size:"450px", resizable: true } ,
        {type: "right", size:"60%", resizable: true }
      ]
    }
    ,
    grid1: {
        name: "grid1wktm0100",
        url: "wktm0100.php",
        header: "加工資料清單",
        columns: [
            { field: "wkt_no", caption: "加工代號", size: "30%", sortable: true },
            { field: "wkt_na", caption: "加工名稱", size: "70%" , sortable: true },
        ],
        multiSort : true,
        sortData: [
            { field: 'wkt_no', direction: 'asc' },
            { field: 'wkt_na', direction: 'asc' }
        ],
        show: {
            header        : true,
            toolbar       : true,
            footer        : true,
            toolbarAdd    : true,
            toolbarEdit   : true,
            toolbarDelete : true
        },
        multiSearch: true,
        searches: [
            { field: "wkt_no", caption: "加工代號", type: "text", operator: "contains" },
            { field: "wkt_na", caption: "加工名稱", type: "text", operator: "contains" }
        ],
        onLoad: function(event){
            //consoleLog("Render ");
            event.onComplete = function () {
              //consoleLog("Render complete");
              //consoleLog(0,w2ui['grid1wktm0100'].get(1));
              w2ui['grid1wktm0100'].click(1);
            };
        },
        onClick: function(event){
            config.opMode = "browse";
            var rcd=grid1.get(event.recid);
            if (rcd==null)                 rcd=grid1.records[0];
            if (rcd!=null)  {
                form1.postData[config.dbMkey]= rcd[config.dbMkey];
                form1.recid=rcd['recid'];
                form1.reload();
                lstRecid=rcd[config.dbMkey];
            } else {
              form1.clear();
                lstRecid=0;
            }
            form1.disable(form1.fields);
            $(".w2ui-input:input").attr('disabled',true);
            $(".w2ui-btn:button").attr('disabled',true);
        },
        onDblClick: function(event){
            var rcd=grid1.get(event.recid);
            form1.recid=rcd['recid'];
            config.opMode = "edit";
            form1.render();
            $(".w2ui-input:input").attr('disabled',false);
            form1.disable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
        },
        onEdit: function(event){
            this.dblClick(event.recid);
        },
        onAdd: function (event) {
            form1.recid="";
            config.opMode = "new";
            $(".w2ui-input:input").attr('disabled',false);
            form1.enable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
            form1.clear();
        }
    }
    ,
    form1: {
      name: "form1wktm0100",
      url: "wktm0100.php",
      header: "加工資料明細-瀏覽",
      fields: [
        { name  : "wkt_no", type:"text", required: true, html: {caption:"加工代號", span:11} },
        { name  : "wkt_na", type:"text", required: true, html: {caption:"加工名稱", class:"fldwkt_na", span:16 ,attr:'size="40"'} },
      ],
      onRefresh: function(event)  {
          switch (config.opMode)  {
            case "new" : this.header =this.header.substr(0,this.header.indexOf("-"))+"-新增"; break;
            case "edit": this.header =this.header.substr(0,this.header.indexOf("-"))+"-修改"; break;
            default    : this.header =this.header.substr(0,this.header.indexOf("-"))+"-瀏覽"; break;
          }
      },
      onLoad : function(event)  {
          //defineFieldFocus();
      },
      onFocus: function(event)  {
          consoleLog(event);
          switch(event.target)  {
            case "date_set" : consoleLog("date_set"); break;
            case "cust_name" : consoleLog("cust_name"); break;
            default   :  consoleLog("default"); break;
          }
      },
      actions: {
//        "Log":  {caption:"除錯",onClick:function(event) {
//                consoleLog("debug", this);
//        }},
        "save": {caption:"存檔",onClick:function(event) {
                this.save(function (data) {
                    if (data.status == 'success') {
                        w2ui['grid1wktm0100'].reload();
                    }
                });
        }}
      }
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
        w2ui[config.name].content('main'   , grid1);
        w2ui[config.name].content('right'  , form1);
        //w2ui[config.name].content('preview', grid2);
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


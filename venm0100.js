// JavaScript Document
// venm0100.js
$(function(){
  // 設定
  var config = {
    name: "venm0100",
    dbMTable : "venm0100",
    dbMkey   : "cust_no",
    opMode   : "browse",
    mainscr: {
      name: "venm0100" ,
      panels:[
        {type: "main" , size:"40%", resizable: true } ,
        {type: "right", size:"60%", resizable: true  }
      ]
    }
    ,
    grid1: {
        name: "grid1venm0100",
        url: "venm0100.php",
        header: "廠商資料清單",
        columns: [
            { field: "cust_no"  , caption: "廠商編號" , size: "20%" , sortable: true },
            { field: "cust_abbr", caption: "廠商簡稱" , size: "40%" , sortable: true },
            { field: "tel1"     , caption: "聯絡電話1", size: "40%" , sortable: true }
        ]
        ,
        sortData: [
            { field: 'cust_no', direction: 'asc' },
            { field: 'cust_abbr', direction: 'asc' },
            { field: 'tel1', direction: 'asc' }
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
            { field: "cust_no", caption: "廠商編號", type: "text", operator: "contains" },
            { field: "cust_abbr", caption: "廠商簡稱", type: "text", operator: "contains" },
            { field: "tel1", caption: "聯絡電話1", type: "text", operator: "contains" }
        ],
        onLoad: function(event){
            event.onComplete = function () {
              grid1.click(lstRecid);
            };
        } ,
        onClick: function(event){
            config.opMode = "browse";
            var rcd=grid1.get(event.recid);
            if (rcd==null)                 rcd=grid1.records[0];
            if (rcd!=null)  {
                form1.postData[config.dbMkey]= rcd[config.dbMkey];
                form1.recid=rcd['recid'];
                form1.reload();
                //grid2.searchData[0].value= rcd[config.dbMkey];
                //grid2.reload();
                lstRecid=rcd[config.dbMkey];
            } else {
              form1.clear();
                lstRecid=0;
            }
            form1.disable(form1.fields);
            $(".w2ui-input:input").attr('disabled',true);
            $(".w2ui-btn:button").attr('disabled',false);
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
    } ,
    form1: {
      name: "form1venm0100",
      url: "venm0100.php",
      header: "廠商資料明細-瀏覽",
      fields: [
        { name  : "cust_no"   , type:"text", required: true, html: {caption:"廠商編號"  , span:11} },
        { name  : "cust_abbr" , type:"text", required: true, html: {caption:"廠商簡稱"  , class:"fldCust_abbr", span:15} },
        { name  : "cust_name" , type:"text", required: true, html: {caption:"廠商全名"  , class:"fldCust_name", span:16 ,attr:'size="40"'} },
        { name  : "tel1"      , type:"text", required: true, html: {caption:"聯絡電話1" , span:11} },
        { name  : "tel2"      , type:"text", required: false, html: {caption:"聯絡電話2", span:15} },
        { name  : "tel3"      , type:"text", required: false, html: {caption:"聯絡電話3", span:11} },
        { name  : "fax"       , type:"text", required: false, html: {caption:"傳真電話" , span:15} },
        { name  : "boss"      , type:"text", required: false, html: {caption:"負責人"    , span:11, onFocus:function(event){console.log("boss");}} },
        { name  : "contact"   , type:"text", required: false, html: {caption:"聯絡人"    , span:15} },
        { name  : "email1"    , type:"email", required: false, html: {caption:"電子郵件1", span:11} },
        { name  : "email2"    , type:"email", required: false, html: {caption:"電子郵件2", span:15} },
        { name  : "co_addr1"  , type:"text", required: false, html: {caption:"公司地址" , span:16 ,attr:'size="40"'} },
        { name  : "co_addr2"  , type:"text", required: false, html: {caption:"發票地址" , span:16 ,attr:'size="40"'} },
        { name  : "co_addr3"  , type:"text", required: false, html: {caption:"送貨地址" , span:16 ,attr:'size="40"'} },
        { name  : "co_addr4"  , type:"text", required: false, html: {caption:"住家地址" , span:16 ,attr:'size="40"'} },
        { name  : "fsn"       , type:"text", required: false, html: {caption:"統一編號" , span:11} },
        { name  : "date_set"  , type:"date", required: false, html: {caption:"建檔日期" , span:15, class:"fldDate"} },
        { name  : "remark1"   , type:"text", required: false, html: {caption:"備註"     , span:16 ,attr:'size="40"'} },
        { name  : "remark2"   , type:"text", required: false, html: {caption:" ", span:16 ,attr:'size="40"'} },
        { name  : "remark3"   , type:"text", required: false, html: {caption:" ", span:16 ,attr:'size="40"'} }
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
            case "date" : consoleLog("date"); break;
            case "cust_name" : consoleLog("cust_name"); break;
            default   :  consoleLog("default"); break;
          }
      },
      actions: {
        "save": {caption:"存檔",onClick:function(event) {
                this.save(function (data) {
                    if (data.status == 'success') {
                        w2ui['grid1venm0100'].reload();
                    }
                });
        }}
        ,"list": {caption:"對照表", "class":"btnVenp0200" ,onClick:function(event) {
            print_lst = '';
            if (grid1.getSelection().length>1)   print_lst = grid1.getSelection();
            else  print_cus = form1.record['cust_no'];
            ReadJS('venp0200');
        }}
        ,"letter": {caption:"印信封", "class":"btnVenp0100" ,onClick:function(event) {
            print_lst = '';
            if (grid1.getSelection().length>1)   print_lst = grid1.getSelection();
            else  print_cus = form1.record['cust_no'];
            ReadJS('venp0100');
        }}
        ,"alabel": {caption:"地址標", "class":"btnVenp0101" ,onClick:function(event) {
            print_lst = '';
            if (grid1.getSelection().length>1)   print_lst = grid1.getSelection();
            else  print_cus = form1.record['cust_no'];
            ReadJS('venp0101');
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


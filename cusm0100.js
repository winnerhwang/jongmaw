// JavaScript Document
// cusm0100.js
$(function(){
  // 設定
  var config = {
    name: "cusm0100",
    dbMTable : "cusm0100",
    dbMkey   : "cust_no",
    opMode   : "browse",
    mainscr: {
      name: "cusm0100" ,
      panels:[
        {type: "main" , size:"40%", resizable: true } ,
        {type: "right", size:"60%", resizable: true  }
      ]
    }
    ,
    grid1: {
        name: "grid1cusm0100",
        url: "cusm0100.php",
        header: "客戶資料清單",
        columns: [
            { field: "cust_no"  , caption: "客戶編號" , size: "20%" , sortable: true },
            { field: "cust_abbr", caption: "客戶簡稱" , size: "40%" , sortable: true },
            { field: "tel1"     , caption: "聯絡電話1", size: "40%" , sortable: true }
        ],
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
            { field: "cust_no", caption: "客戶編號", type: "text", operator: "contains" },
            { field: "cust_abbr", caption: "客戶簡稱", type: "text", operator: "contains" },
            { field: "tel1", caption: "聯絡電話1", type: "text", operator: "contains" }
        ],
        onLoad: function(event){
            event.onComplete = function () {
              w2ui['grid1cusm0100'].click(1);
            };
        },
        onClick: function(event){
            config.opMode = "browse";
            var grd=w2ui['grid1cusm0100'];
            var frm=w2ui['form1cusm0100'];
            var rcd=grd.get(event.recid);
            if (rcd==null)                 rcd=grd.records[0];
            if (rcd!=null)  {
                frm.postData[config.dbMkey]= rcd[config.dbMkey];
                frm.recid=rcd['recid'];
                frm.reload();
            } else frm.clear();
            frm.disable(frm.fields);
            $(".w2ui-input:input").attr('disabled',true);
            $(".w2ui-btn:button").attr('disabled',false);
        },
        onDblClick: function(event){
            var grd=w2ui['grid1cusm0100'];
            var frm=w2ui['form1cusm0100'];
            var rcd=grd.get(event.recid);
            //consoleLog("doubl click ",rcd);
            frm.recid=rcd['recid'];
            config.opMode = "edit";
            //frm.header= frm.header.substr(0,frm.header.indexOf("-"))+"-修改";
            frm.render();
            $(".w2ui-input:input").attr('disabled',false);
            frm.disable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
        },
        onEdit: function(event){
            this.dblClick(event.recid);
        },
        onAdd: function (event) {
            var frm=w2ui['form1cusm0100'];
            frm.recid="";
            config.opMode = "new";
            //frm.header= frm.header.substr(0,frm.header.indexOf("-"))+"-新增";
            $(".w2ui-input:input").attr('disabled',false);
            frm.enable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
            frm.clear();
            fldDate=frm.get('date_set').el;
            var nowDate= new Date();
            fldDate.value=nowDate.format('yyyy-mm-dd');
            //consoleLog( frm.get('date'));
        }
    }
    ,
    form1: {
      name: "form1cusm0100",
      url: "/jm/cusm0100.php",
      header: "客戶資料明細-瀏覽",
      itemsClass : [{id:'A',text:'A.良'},{id:'B',text:'B.普通'},{id:'C',text:'C.差'}],
      itemsBuy   : [{id:'A',text:'A.已'},{id:'B',text:'B.欲'},{id:'C',text:'C.不購'}],
      //itemsPay   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}],
      itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}],
      fields: [
        { name  : "cust_no"  , type:"text", required: true , html: {caption:"客戶編號", span:11} },
        { name  : "cust_abbr", type:"text", required: true , html: {caption:"客戶簡稱", class:"fldCust_abbr", span:15} },
        { name  : "date_set" , type:"date", required: false, html: {caption:"建檔日期", class:"fldDate", span:15} },
        { name  : "cust_name", type:"text", required: true , html: {caption:"客戶全名", class:"fldCust_name", span:11 ,attr:'size="40"'} },
        { name  : "cust_taxn", type:"text", required: true , html: {caption:"發票抬頭", class:"fldCust_name", span:15 ,attr:'size="40"'} },
        { name  : "tel1"     , type:"text", required: true , html: {caption:"聯絡電話1", span:11} },
        { name  : "tel2"     , type:"text", required: false, html: {caption:"聯絡電話2", span:15} },
        { name  : "tel3"     , type:"text", required: false, html: {caption:"聯絡電話3", span:15} },
        { name  : "fax"      , type:"text", required: false, html: {caption:"傳真電話", span:11} },
        { name  : "boss"     , type:"text", required: false, html: {caption:"負責人", span:15, onFocus:function(event){console.log("boss");}} },
        { name  : "contact"  , type:"text", required: false, html: {caption:"聯絡人", span:15} },
        { name  : "email1"   , type:"email",required: false, html: {caption:"電子郵件1", span:11} },
        { name  : "email2"   , type:"email",required: false, html: {caption:"電子郵件2", span:15} },
        { name  : "fsn"      , type:"text", required: false, html: {caption:"統一編號", span:15} },
        { name  : "co_addr1" , type:"text", required: false, html: {caption:"公司地址", span:11 ,attr:'size="40"'} },
        { name  : "co_addr2" , type:"text", required: false, html: {caption:"發票地址", span:15 ,attr:'size="40"'} },
        { name  : "co_addr3" , type:"text", required: false, html: {caption:"送貨地址", span:11 ,attr:'size="40"'} },
        { name  : "co_addr4" , type:"text", required: false, html: {caption:"住家地址", span:15 ,attr:'size="40"'} },
        { name  : "remail"   , type:"list", required: false, html: {caption:"回郵", span:11 ,attr:'size="1"' } },
        { name  : "c_class"  , type:"list", required: false, html: {caption:"憑估等級", span:15} },
        { name  : "c_buy"    , type:"list", required: false, html: {caption:"購物狀態", span:15} },
        { name  : "pay_kind" , type:"list", required: false, html: {caption:"請款方式", span:11 , attr: "size=1  " }
          , options:{items:[{id:"1",text:"普通"},{id:"2",text:"特殊"},{id:"3",text:"貿易"},{id:"4",text:"國外"},{id:"5",text:"現金"},{id:"6",text:"刷卡"} ] }  },
        { name  : "vip"      , type:"list", required: false, html: {caption:"優惠價", span:15  ,attr:'size="1"'} },
        { name  : "remark1"  , type:"text", required: false, html: {caption:"備註", span:16 ,attr:'size="40"'} },
        { name  : "remark2"  , type:"text", required: false, html: {caption:" ", span:16 ,attr:'size="40"'} },
        { name  : "remark3  ", type:"text", required: false, html: {caption:" ", span:16 ,attr:'size="40"'} }
      ],
      onRefresh: function(event)  {
          switch (config.opMode)  {
            case "new" : this.header =this.header.substr(0,this.header.indexOf("-"))+"-新增"; break;
            case "edit": this.header =this.header.substr(0,this.header.indexOf("-"))+"-修改"; break;
            default    : this.header =this.header.substr(0,this.header.indexOf("-"))+"-瀏覽"; break;
          }
          form1.get('remail').options.items = form1.itemsYN;
          form1.get('c_class').options.items = form1.itemsClass;
          form1.get('c_buy').options.items = form1.itemsBuy;
          form1.get('vip').options.items = form1.itemsYN;
      },
      onLoad : function(event)  {
          defineFieldFocus();
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
//        "Log":  {caption:"除錯",onClick:function(event) {
//                consoleLog("debug", this);
//        }},
        "save": {caption:"存檔",onClick:function(event) {
                this.save(function (data) {
                    if (data.status == 'success') {
                        w2ui['grid1cusm0100'].reload();
                    }
                });
        }}
        ,"letter": {caption:"印信封", "class":"btnCuspp0100" ,onClick:function(event) {
            print_lst = '';
            if (grid1.getSelection().length>1)   print_lst = grid1.getSelection();
            else  print_cus = form1.record['cust_no'];
            ReadJS('cusp0100');
        }}
        ,"alabel": {caption:"地址標", "class":"btnCuspp0101" ,onClick:function(event) {
            print_lst = '';
            if (grid1.getSelection().length>1)   print_lst = grid1.getSelection();
            else  sprint_cus = form1.record['cust_no'];
            ReadJS('cusp0101');
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
}
;


  procid=config.name;
  if ( ! w2ui[config.name]) {
    lstRecid=0;
    JSconfig[config.name]=config;
    $().w2layout(config.mainscr);
  }
  config.rePlay();


});

function defineFieldFocus(){
  $("input#cust_name").on('focus', function (event) {
    //consoleLog(event.target.value);
    v =$("input#cust_name")[0].value;
    //consoleLog("focus cust_name",v);
    //consoleLog($("input#cust_abbr"),$("input#cust_abbr").value);
    if (v==null || v=='')
      $("input#cust_name")[0].value= $("input#cust_abbr")[0].value;
  });
}
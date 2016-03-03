// JavaScript Document
// bomm0100.js
$(function(){
  // 設定
  var config = {
    name: "bomm0100",
    dbMTable : "bomm0100",
    dbMkey   : "autoid",
    opMode   : "browse",
    mainscr: {
      name: "bomm0100" ,
      panels:[
        {type: "main" , size:"60%", resizable: true } ,
        {type: "right", size:"40%", resizable: true }
      ]
    }
    ,
    grid1: {
        name: "grid1bomm0100",
        url: "bomm0100.php",
        header: "零件資料清單",
        columns: [
            { field: "autoid"  , caption: "ID"      , size: " 4%" , sortable: false, hidden:true },
            { field: "bom_no"  , caption: "機種編號", size: "10%" , sortable: true },
            { field: "bom_na"  , caption: "機種名稱", size: "20%" , sortable: false },
            { field: "ser_no"  , caption: "件號"    , size: " 6%" , sortable: false },
            { field: "stk_no"  , caption: "零件料號", size: "10%" , sortable: true },
            { field: "stk_na"  , caption: "零件名稱", size: "20%" , sortable: false },
            { field: "qty"     , caption: "數量"    , size: " 6%" , sortable: false ,style:'text-align:right;'},
            { field: "wkcost"  , caption: "單價"    , size: "10%" , sortable: false ,style:'text-align:right;' , render:'float:2'}
        ],
        multiSort: true,
        sortData: [
            { field: 'bom_no', direction: 'asc' },
            { field: 'ser_no', direction: 'asc' },
            { field: 'stk_no', direction: 'asc' }
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
            { field: "bomm0100.bom_no", caption: "機種編號", type: "text", operator: "contains" },
            { field: "bomm0100.stk_no", caption: "貨品編號", type: "text", operator: "contains" }
        ],
        onLoad: function(event){
            event.onComplete = function () {
              w2ui['grid1bomm0100'].click(1);
            };
        },
        onClick: function(event){
            config.opMode = "browse";
            var grd=w2ui['grid1bomm0100'];
            var frm=w2ui['form1bomm0100'];
            var rcd=grd.get(event.recid);
            if (rcd==null)                 rcd=grd.records[0];
            if (rcd!=null)  {
                frm.postData[config.dbMkey]= rcd[config.dbMkey];
                frm.recid=rcd['recid'];
                frm.reload();
            } else frm.clear();
            frm.disable(frm.fields);
            $(".w2ui-input:input").attr('disabled',true);
            $(".w2ui-btn:button").attr('disabled',true);
        },
        onDblClick: function(event){
            var grd=w2ui['grid1bomm0100'];
            var frm=w2ui['form1bomm0100'];
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
            var frm=w2ui['form1bomm0100'];
            frm.recid="";
            config.opMode = "new";
            //frm.header= frm.header.substr(0,frm.header.indexOf("-"))+"-新增";
            $(".w2ui-input:input").attr('disabled',false);
            frm.enable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
            frm.clear();
        }
    }
    ,
    form1: {
      name: "form1bomm0100",
      url: "bomm0100.php",
      header: "零件資料明細-瀏覽",
      fields: [
        //{ name  : "autoid", type:"text" , required: false, html: {caption:"ID"      , span:11  , attr: 'size=10 readonly' }},
        { name  : "bom_no", type:"combo", required: true , html: {caption:"機種編號", span:11 }, options:{url:"stkm0100.php"} },
        { name  : "bom_na", type:"text" , required: false, html: {caption:"機種名稱", span:15  , attr: 'size="40" readonly'} },
        { name  : "ser_no", type:"text" , required: true , html: {caption:"件號"    , span:11  , attr: 'size="10"'} },
        { name  : "stk_no", type:"combo", required: true , html: {caption:"零件料號", span:11 }, options:{url:"stkm0100.php"} },
        { name  : "stk_na", type:"text" , required: false, html: {caption:"零件名稱", span:15  , attr: 'size="40" readonly'} },
        { name  : "qty"   , type:"int"  , required: false, html: {caption:"數量"    , span:11  , attr: "style='text-align:right;'"} },
        { name  : "wkcost", type:"float", required: false, html: {caption:"單價"    , span:11  , attr: "style='text-align:right;' readonly" } , options:{precision:"2"} },
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
      onChange: function(event)  {
          switch(event.target)  {
            case "bom_no"  :
                if (!spForm1('bom_no','bom_no,bom_na'))  w2alert('欄位選擇不正確');
                break;
            case "stk_no"  :
                if (!spForm1('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
                break;
            default   :
                //consoleLog("change none process");
                break;
          }
      },
      actions: {
        "save": {caption:"存檔",onClick:function(event) {
            if (!spForm1('bom_no','bom_no,bom_na'))  w2alert('欄位選擇不正確');
            if (!spForm1('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
            this.save(function (data) {
                if (data.status == 'success') {
                  w2ui['grid1bomm0100'].reload();
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

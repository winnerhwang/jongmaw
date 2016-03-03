// JavaScript Document
// empm0100.js
$(function(){
  // 設定
  var config = {
    name: "empm0100",
    dbMTable : "empm0100",
    dbMkey   : "emp_no",
    opMode   : "browse",
    mainscr: {
      name: "empm0100" ,
      panels:[
        {type: "main" , "size":"450px", "resizable": "true" } ,
        {type: "right", "size":"60%" }
      ]
    }
    ,
    grid1: {
        name: "grid1empm0100",
        url: "empm0100.php",
        header: "員工資料清單",
        columns: [
            { field: "emp_no"  , caption: "員工編號"  , size: "20%" , sortable: true },
            { field: "emp_name", caption: "中文姓名"  , size: "20%" , sortable: true },
            { field: "id_no"   , caption: "身份証字號", size: "20%" , sortable: true },
            { field: "br_date" , caption: "出生日期"  , size: "20%" , sortable: true }
        ],
        sortData: [
            { field: 'emp_no'  , direction: 'asc' },
            { field: 'emp_name', direction: 'asc' },
            { field: 'id_no'   , direction: 'asc' },
            { field: 'br_date' , direction: 'asc' }
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
            { field: "emp_no"  , caption: "員工編號"  , type: "text", operator: "contains" },
            { field: "emp_name", caption: "員工名稱"  , type: "text", operator: "contains" },
            { field: "id_no"   , caption: "身份証字號", type: "text", operator: "contains" },
            { field: "br_date" , caption: "出生日期"  , type: "date", operator: "between" }
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
            //frm.header= frm.header.substr(0,frm.header.indexOf("-"))+"-新增";
            $(".w2ui-input:input").attr('disabled',false);
            form1.enable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
            form1.clear();
                  for (i=0; i<form1.fields.length; i++) {
                    if (form1.fields[i].type=='float' || form1.fields[i].type=='int' || form1.fields[i].type=='number' )
                        form1.record[form1.fields[i].name] = form1.get(form1.fields[i].name).el.value= 0 ;
                  }
        }
    }
    ,
    form1: {
      name: "form1empm0100",
      url: "empm0100.php",
      header: "員工資料明細-瀏覽",
      itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}],
      fields: [
        { name  : "emp_no"  , type:"text" , required: true , html: {caption:"員工編號", span:11 ,attr:'size=10'} },
        { name  : "emp_name", type:"text" , required: true , html: {caption:"中文姓名", span:15 ,attr:'size=10' }},
        { name  : "name"    , type:"text" , required: false, html: {caption:"英文姓名", span:15 ,attr:'size=20' }},
        { name  : "id_no"   , type:"text" , required: false, html: {caption:"身份証字號",span:11,attr:'size=10' }},
        { name  : "passport", type:"text" , required: false, html: {caption:"護照號碼", span:15 ,attr:'size=10' }},
        { name  : "br_date" , type:"date" , required: false, html: {caption:"出生日期", span:15 ,attr:'size=10'}, options:{format:'yyyy/mm/dd'}  },
        { name  : "addr1"   , type:"text" , required: false, html: {caption:"戶籍地址", span:11 ,attr:'size=40'} },
        { name  : "addr2"   , type:"text" , required: false, html: {caption:"通訊地址", span:15 ,attr:'size=40'} },
        { name  : "tel"     , type:"text" , required: false, html: {caption:"聯絡電話", span:11 ,attr:'size=20'} },
        { name  : "mate"    , type:"list" , required: false, html: {caption:"有無配偶", span:15 ,attr:'size=4'} },
        { name  : "sons"    , type:"int"  , required: false, html: {caption:"扶養人數", span:15 ,attr:"size=4 style='text-align:right;'"} },
        { name  : "job"     , type:"text" , required: false, html: {caption:"職務"    , span:11 }   },
        { name  : "in_date" , type:"date" , required: false, html: {caption:"到職日期", span:15} , options:{format:'yyyy/mm/dd'}  },
        { name  : "fr_date" , type:"date" , required: false, html: {caption:"離職日期", span:15} , options:{format:'yyyy/mm/dd'}  },
        { name  : "bank"    , type:"text" , required: false, html: {caption:"郵局局號", span:11}   },
        { name  : "acc"     , type:"text" , required: false, html: {caption:"存簿帳號", span:15}   },
        { name  : "sry_no"  , type:"text" , required: false, html: {caption:"轉存代號", span:15}   },
        { name  : "base"    , type:"int"  , required: false, html: {caption:"本薪"    , span:11, attr:"size=8 style='text-align:right;'" } , options:{precision:"0"}  },
        { name  : "base1"   , type:"int"  , required: false, html: {caption:"申報"    , span:15, attr:"size=8 style='text-align:right;'" } , options:{precision:"0"}  },
        { name  : "plus3"   , type:"int"  , required: false, html: {caption:"津貼"    , span:11, attr:"size=8 style='text-align:right;'" } , options:{precision:"0"}  },
        { name  : "plus4"   , type:"int"  , required: false, html: {caption:"工作獎金", span:15, attr:"size=8 style='text-align:right;'" } },
        { name  : "plus5"   , type:"int"  , required: false, html: {caption:"職務津貼", span:15, attr:"size=8 style='text-align:right;'" } },
        { name  : "mnus3"   , type:"int"  , required: false, html: {caption:"扣所得稅", span:11, attr:"size=8 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "mnus4"   , type:"int"  , required: false, html: {caption:"扣勞保費", span:15, attr:"size=8 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "mnus5"   , type:"int"  , required: false, html: {caption:"扣健保費", span:11, attr:"size=8 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "mnus9"   , type:"int"  , required: false, html: {caption:"扣其他"  , span:15, attr:"size=8 style='text-align:right;'"} , options:{precision:"0"}  }
      ],
      onRefresh: function(event)  {
          switch (config.opMode)  {
            case "new" : this.header =this.header.substr(0,this.header.indexOf("-"))+"-新增"; break;
            case "edit": this.header =this.header.substr(0,this.header.indexOf("-"))+"-修改"; break;
            default    : this.header =this.header.substr(0,this.header.indexOf("-"))+"-瀏覽"; break;
          }
          //form1.get('kind').options.items = form1.itemsKind;
          //form1.get('sal_knd').options.items = form1.itemsSal;
          form1.get('mate').options.items = form1.itemsYN;
      },
      onLoad : function(event)  {
          //defineFieldFocus();
      },
      onChange: function(event)  {
          switch(event.target)  {
            default   :
                //consoleLog("change none process");
                break;
          }
      },
      onSave : function (data) {
        if (data.status=='success') {
          config.opMode='browse';
          grid1.reload();

        }
      },
      actions: {
        "save": {caption:"存檔",onClick:function(event) {

            this.save(function (data) {
                if (data.status == 'success') {
                  w2ui['grid1empm0100'].reload();
                }
            });
        }}
        ,"letter": {caption:"印信封", "class":"btnEmpp0100" ,onClick:function(event) {
            print_lst = '';
            if (grid1.getSelection().length>1)   print_lst = grid1.getSelection();
            else  print_emp = form1.record['emp_no'];
            ReadJS('empp0100');
        }}
        ,"alabel": {caption:"地址標", "class":"btnEmpp0101" ,onClick:function(event) {
            print_lst = '';
            if (grid1.getSelection().length>1)   print_lst = grid1.getSelection();
            else  print_emp = form1.record['emp_no'];
            ReadJS('empp0101');
        }}
        ,"nlabel": {caption:"姓名標", "class":"btnEmpp0102" ,onClick:function(event) {
            print_lst = '';
            if (grid1.getSelection().length>1)   print_lst = grid1.getSelection();
            else  print_emp = form1.record['emp_no'];
            ReadJS('empp0102');
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

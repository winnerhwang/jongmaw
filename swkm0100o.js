// JavaScript Document
// stkm0100.js
$(function(){
  // 設定
  var config = {
    name: "swkm0100",
    dbMTable : "stkm0100",
    dbMkey   : "stk_no",
    dbSTable : "swkm0100",
    dbSkey   : "ser_no",
    dbRelVal : "",
    opMode   : "browse",
    mainscr: {
      name: "swkm0100" ,
      panels:[
        {type: "left"    , "size":"30%", "resizable": true } ,
        {type: "main"    , "size":"70%", "resizable": true } ,
        {type: "preview" , "size":"50%"  , "resizable": true }
      ]
    },
    grid1: {
        name: "grid1swkm0100",
        url: "stkm0100.php",
        header: "貨品資料清單",
        columns: [
            { field: "stk_no"  , caption: "貨品編號", size: "30%" , sortable: true },
            { field: "stk_namc", caption: "貨品名稱", size: "70%" , sortable: true }
        ],
        sortData: [
            { field: 'stk_no', direction: 'asc' },
            { field: 'stk_namc', direction: 'asc' }
        ],
        show: {
            header        : true,
            toolbar       : true,
            footer        : true,
//            toolbarAdd    : true,
//            toolbarEdit   : true,
//            toolbarDelete : true
        },
        multiSearch: true,
        searches: [
            { field: "stk_no"  , caption: "貨品編號", type: "text", operator: "contains" },
            { field: "stk_namc", caption: "貨品名稱", type: "text", operator: "contains" }
        ],
        onLoad: function(event){
            event.onComplete = function () {
              grid1.click(1);
            };
        },
        onClick: function(event){
            config.opMode = "browse";
            var rcd=grid1.get(event.recid);
            if (rcd==null)                 rcd=grid1.records[0];
            if (rcd!=null)  {
                config.dbRelVal = rcd[config.dbMkey];
                form1.postData[config.dbMkey]= rcd[config.dbMkey];
                form1.recid=rcd['recid'];
                grid2.recid=0;
                grid2.searchData[0].value= rcd[config.dbMkey];
                form1.reload();
                grid2.reload();
                lstRecid=rcd[config.dbMkey];
            } else {
              form1.clear();
                lstRecid=0;
            }
            form1.disable(form1.fields);
            $(".w2ui-input:input").attr('disabled',true);
            $(".w2ui-btn:button").attr('disabled',true);
        }
    }
    ,
    form1: {
      name: "form1swkm0100",
      url: "stkm0100.php",
//      header: "貨品資料明細-瀏覽",
      fields: [
        { name  : "stk_no"  , type:"text"  , required: true , html: {caption:"貨品編號"   , span:11 } },
        { name  : "kind"    , type:"list"  , required: false, html: {caption:"貨品類別"   , span:15 }
             , options : {items : [{id:'1',text:'1.鈑金'},{id:'2',text:'2.特殊'},{id:'3',text:'3.套筒'},{id:'4',text:'4.板手'},{id:'5',text:'5.引擎'},{id:'6',text:'6.機械設備'},{id:'7',text:'7.氣動'}]}},
        { name  : "sal_knd" , type:"list"  , required: false, html: {caption:"內外銷別"   , span:15 }
             , options : {items : [{id:'A',text:'A.內銷'},{id:'B',text:'B.外銷'},{id:'C',text:'C.均有'}]} },
        { name  : "always"  , type:"list"  , required: false, html: {caption:"永久保固"   , span:15 }
             , options : {items : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]} },
        { name  : "stk_namc", type:"text"  , required: true , html: {caption:"貨品名稱"   , span:11 ,attr:'size=40'} },
        { name  : "stk_name", type:"text"  , required: false, html: {caption:"英文品名"   , span:15 ,attr:'size=40'} },
        { name  : "spec"    , type:"text"  , required: false, html: {caption:"規格"       , span:11 ,attr:'size=40'} },
        { name  : "mtrl"    , type:"text"  , required: false, html: {caption:"材質"       , span:15 ,attr:'size=40'} },
        { name  : "ntcost"  , type:"float" , required: false, html: {caption:"成本價-台幣", span:11, attr:"size=10 style='text-align:right;'" } , options:{precision:"2"}  },
        { name  : "uscost"  , type:"float" , required: false, html: {caption:"成本價-美金", span:15, attr:"size=10 style='text-align:right;'" } , options:{precision:"2"}  },
        { name  : "qty"     , type:"float" , required: false, html: {caption:"庫存數量"   , span:11, attr:"size=10 style='text-align:right;'" } , options:{precision:"2"}  },
        { name  : "safe_qty", type:"int"   , required: false, html: {caption:"安全庫存-低", span:15, attr:"size=10 style='text-align:right;'" } },
        { name  : "ord_qty" , type:"int"   , required: false, html: {caption:"安全庫存-高", span:15, attr:"size=10 style='text-align:right;'" } },
        { name  : "netkg"   , type:"float" , required: false, html: {caption:"重量-淨重"  , span:11, attr:"size=10 style='text-align:right;'" } , options:{precision:"2"}  },
        { name  : "grwkg"   , type:"float" , required: false, html: {caption:"重量-毛重"  , span:15, attr:"size=10 style='text-align:right;'" } , options:{precision:"2"}  },
        { name  : "flow"    , type:"text"  , required: false, html: {caption:"加工流程"   , span:11} },
        { name  : "flow_pri", type:"float" , required: false, html: {caption:"加工單價"   , span:15, attr:"size=10 style='text-align:right;'"}  , options:{precision:"2"}  },
        { name  : "wkcost"  , type:"float" , required: false, html: {caption:"加工成本"   , span:19, attr:"size=10 style='text-align:right;'"}  , options:{precision:"2"}  }
      ],
      onRefresh: function(event)  {
          switch (config.opMode)  {
            case "new" :
                //this.header =this.header.substr(0,this.header.indexOf("-"))+"-新增";
                break;
            case "edit":
                //this.header =this.header.substr(0,this.header.indexOf("-"))+"-修改";
                break;
            default    :
                //this.header =this.header.substr(0,this.header.indexOf("-"))+"-瀏覽";
                $('Button.w2ui-btn.btnOuthAdd' ).attr('disabled',false);
                $('Button.w2ui-btn.btnOuthEdit').attr('disabled',false);
                $('Button.w2ui-btn.btnOuthDel' ).attr('disabled',false);
                $('Button.w2ui-btn.btnOuthSave').attr('disabled',true);
                $('Button.w2ui-btn.btnOuthCancel').attr('disabled',true);
                form1.disable(form1.fields);
                break;
          }
      },
      onLoad : function(event)  {
//          defineFieldFocus();
      }
    },

    grid2: {
        name: "grid2swkm0100",
        url: "swkm0100.php",
        header: "加工流程資料明細",
        columns: [
            { field: "autoid"   , caption: "ID", size: "1%" , hidden:true },
            { field: "stk_no"   , caption: "貨號", size: "1%" , hidden:true },
            { field: "ser_no"   , caption: "序"  , size: "10%"  },
            { field: "wkt_no"   , caption: "加工", size: "10%"  },
            { field: "wkt_na"   , caption: "名稱", size: "20%"   },
            { field: "cust_no"  , caption: "廠商", size: "10%"  },
            { field: "cust_na"  , caption: "簡稱", size: "20%"   },
            { field: "price"    , caption: "單價", size: "10%" , style:"text-align:right;" , render:'float:2' },
            { field: "note"     , caption: "說明", size: "20%"  }
        ],
        searchData : [
            { field : 'stk_no', value : "" , operator : 'is', type: 'text' }
        ],
        show: {
            header        : true,
            toolbar       : true,
            footer        : true,
            toolbarSearch : false,
            toolbarAdd    : true,
            toolbarEdit   : true,
            toolbarSave   : true,
            toolbarDelete : true
        },
        onDblClick: function(event) {
            editSwkItem(event.recid);
        },
        onEdit: function(event){
            editSwkItem(event.recid);
        },
        onAdd: function (event) {
            editSwkItem(0);
        }
    },
    form2: {
      name: "form2swkm0100",
      url: "swkm0100.php",
      fields: [
        { name  : "autoid"  , type:"text" , required: false, html: {caption:"ID"      , span:11 , attr: 'size=10 readonly' }},
        { name  : "stk_no"  , type:"text" , required: false, html: {caption:"貨品編號", span:15 , attr: 'size=10 readonly' }},
        { name  : "ser_no"  , type:"text" , required: false, html: {caption:"序號"    , span:11} },
        { name  : "wkt_no"  , type:"combo", required: true , html: {caption:"加工編號", span:11}, options:{url:'wktm0100.php'} },
        { name  : "wkt_na"  , type:"text" , required: false, html: {caption:"加工名稱", span:15 , attr: 'size=20 readonly' }},
        { name  : "cust_no" , type:"combo", required: false, html: {caption:"廠商編號", span:11}, options:{url:'venm0100.php'} },
        { name  : "cust_na" , type:"text" , required: false, html: {caption:"廠商簡稱", span:15 , attr: 'size=20 readonly' }},
        { name  : "price"   , type:"float", required: false, html: {caption:"單價"    , span:11 , attr: "style='text-align:right;' " } , options:{precision:"2"}  },
        { name  : "note"    , type:"text" , required: false, html: {caption:"說明"    , span:11} }
      ],
      searchData : [
            { field : 'autoid', value : "" , operator : 'is', type: 'text' } ,
            { field : 'stk_no', value : "" , operator : 'is', type: 'text' }
      ],
      onRender: function(event){
            event.onComplete = function () {
              if (form2.recid==0) {
                consoleLog('default stk_no');
                form2.record['stk_no'] =  form1.get('stk_no'   ).el.value ;
              } else {
              }
              if (form2.recid==0 || form2.recid=='') {
                  for (i=0; i<form2.fields.length; i++) {
                    if (form2.fields[i].type=='float' || form2.fields[i].type=='number' )  form2.record[form2.fields[i].name] = 0;
                  }
              }
            };
      },
      onChange: function(event)  {
          switch(event.target)  {
            case "cust_no"  :
                if (!spForm2('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
               break;
            case "wkt_no"  :
                if (!spForm2('wkt_no','wkt_no,wkt_na'))  w2alert('欄位選擇不正確');
                break;
            default   :
                //consoleLog("change none process");
                break;
          }
      },
        actions: {
            "save": { caption:"存檔"  , onClick:function () {
                if (!spForm2('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
                if (!spForm2('wkt_no','wkt_no,wkt_na'))  w2alert('欄位選擇不正確');
                this.save(function (data) {
                    if (data.status == 'success') {
                        form1.render();
                        grid2.reload();
                        $().w2popup('close');
                    }
                    // if error, it is already displayed by w2form
                });
            }},
            "cancel": { caption:"取消"  , onClick:function () {
                $().w2popup('close');
            }},
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
        w2ui[config.name].content('left'   , grid1);
        w2ui[config.name].content('main'   , form1);
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

  function editSwkItem(recid) {
    $().w2popup('open', {
        title   : ((recid == 0 || recid=='') ? '新增' : '編輯'),
        body    : '<div id="pop_edit" style="width: 100%; height: 100%"></div>',
        style   : 'padding: 15px 0px 0px 0px',
        width   : 600,
        height  : 400,
        onOpen  : function (event) {
            event.onComplete = function () {
                form2.clear();
                form2.recid = recid;
                if (recid==0 || recid=='')  {
                  form2.searchData[0].value= recid;
                  form2.searchData[1].value= form1.record['stk_no'];
                } else {
                  form2.searchData[0].value= recid;
                  form2.searchData[1].value= grid2.get(recid)['stk_no'];
                }
                consoleLog(form2.searchData);
                $('#w2ui-popup #pop_edit').w2render(form2.name);
            }
        }
    });
  }


});


// JavaScript Document
// outb0100.js
$(function(){
  // 設定
  var config = {
    name: "outb0100",
    dbMTable : "outh0100",
    dbMkey   : "doc_no",
    dbSTable : "outi0100",
    dbSkey   : "autoid",
    dbRelVal : "",
    opMode   : "browse",
    mainscr: {
      name: "outb0100" ,
      panels:[
        {type: "left"    , "size":"25%", "resizable": true } ,
        {type: "main"    , "size":"45%", "resizable": true } ,
        {type: "preview" , "size":"55%", "resizable": true }
      ]
    } ,
    grid1: {
        name: "grid1outb0100",
        url: "outh0100.php",
        header: "出貨資料清單",
        columns: [
            { field: "doc_no"  , caption: "出貨單號", size: "40%" , sortable: true, hidden:false },
            { field: "date"    , caption: "出貨日期", size: "30%" , sortable: true, render:'date:yyyy/mm/dd' },
            { field: "cust_no" , caption: "客戶編號", size: "30%" , sortable: true, hidden:false }
        ],
        multiSort: true,
        multiSelect:false,
        sortData: [
            { field: 'date'    , direction: 'desc' },
            { field: 'doc_no'  , direction: 'desc' },
            //{ field: 'cust_no' , direction: 'asc' }
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
            { field: "doc_no"  , caption: "出貨單號", type: "text", operator: "begins" },
            { field: "date"    , caption: "出貨日期", type: "date", operator: "between" },
            { field: "cust_no" , caption: "客戶編號", type: "text", operator: "contains" }
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
                grid2.searchData[0].value= rcd[config.dbMkey];
                grid2.reload();
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
            form1.disable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
            form1.clear();
        }
    }
    ,
    form1: {
      name: "form1outb0100",
      url: "outh0100.php",
      header: "出貨資料明細-瀏覽",
      tabs: [
          { id: 'tab1', caption: '出貨.摘要' }
         ,{ id: 'tab2', caption: '發票.費用' }
         ,{ id: 'tab3', caption: '收款.外滙' }
      ],
      fields: [
        { name  : "doc_no"  , type:"text" , required: true , html: {caption:"出貨單號", span:11  , attr: 'size=10 ' } },
        { name  : "date"    , type:"date" , required: true , html: {caption:"出貨日期", span:15  , attr: 'size=10 ' } , options:{format:'yyyy/mm/dd'}},
        { name  : "yymm"    , type:"text" , required: true , html: {caption:"帳款月份", span:15  , attr: 'size=7  ' }  },
        { name  : "date1"   , type:"date" , required: true , html: {caption:"交貨日期", span:15  , attr: 'size=10'  }, options:{format:'yyyy/mm/dd'}},
        { name  : "cust_no" , type:"combo", required: true , html: {caption:"客戶編號", span:11  , attr: 'size=10'}, options:{url:"cusm0100.php"} },
        { name  : "cust_na" , type:"text" , required: false, html: {caption:"客戶簡稱", span:15  , attr: 'size=10 readonly'} },
        //{ name  : "car"     , type:"text" , required: false, html: {caption:"運送"    , span:15  , attr: "size=1  " }},
        { name  : "mail"    , type:"text" , required: false, html: {caption:"回郵"    , span:15  , attr: "size=1  " }},
        { name  : "toaddr"  , type:"text" , required: false, html: {caption:"送貨地址", span:15  , attr: "size=40 "} },
        { name  : "pay_kind", type:"list" , required: false, html: {caption:"請款"    , span:11  , attr: "size=4  " }
          , options:{items:[{id:"1",text:"1.普通"},{id:"2",text:"2.特殊"},{id:"3",text:"3.貿易"},{id:"4",text:"4.國外"},{id:"5",text:"5.現金"},{id:"6",text:"6.刷卡"} ] }  },
        { name  : "inv"     , type:"text" , required: false, html: {caption:"發票"    , page:1 , span:15  , attr: "size=1  " }},
        { name  : "tax_no"  , type:"text" , required: false, html: {caption:"發票號碼", page:1 , span:15  , attr: "size=12 " }},
        { name  : "tax"     , type:"text" , required: false, html: {caption:"含稅"    , page:1 , span:15  , attr: "size=1  " }},
        { name  : "taxamt"  , type:"float", required: false, html: {caption:"稅額"    , page:1 , span:15  , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "portcar" , type:"float", required: false, html: {caption:"扣港工捐", page:1 , span:11  , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "caramt"  , type:"float", required: false, html: {caption:"運費"    , page:1 , span:15  , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "dscnt"   , type:"float", required: false, html: {caption:"折讓金額", page:1 , span:15  , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "rec_f"   , type:"text" , required: false, html: {caption:"收款"    , page:2 , span:11  , attr: "size=1  " }},
        { name  : "car1"    , type:"date" , required: false, html: {caption:"收款日期", page:2 , span:15  , attr: "size=10 " }},
        { name  : "cash3p"  , type:"float", required: false, html: {caption:"收款折讓", page:2 , span:15  , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "cash"    , type:"float", required: false, html: {caption:"收款金額", page:2 , span:19  , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "amt"     , type:"float", required: false, html: {caption:"出貨金額", page:2 , span:19  , attr: "size=10 style='text-align:right;' readonly" } , options:{precision:"2"} },
        { name  : "usdtwd"  , type:"list" , required: false, html: {caption:"幣別"    , page:2 , span:11  , attr: "size=8  " }, options:{items:[{id:"TWD",text:"TWD.台幣"},{id:"USD",text:"USD.美金"}]}},
        { name  : "currate" , type:"float", required: false, html: {caption:"滙率"    , page:2 , span:15  , attr: "size=10  style='text-align:right;'" } , options:{precision:"4"}},
        { name  : "usd_amt" , type:"float", required: false, html: {caption:"外幣金額", page:2 , span:15  , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "remark"  , type:"text" , required: false, html: {caption:"備註"    , span:15  , attr: "size=40 " }},
      ],
      onRefresh: function(event)  {
          switch (config.opMode)  {
            case "new" :
                this.header =this.header.substr(0,this.header.indexOf("-"))+"-新增";
                grid2.toolbar.disable('w2ui-add');
                break;
            case "edit":
                this.header =this.header.substr(0,this.header.indexOf("-"))+"-修改";
                break;
            default    :
                this.header =this.header.substr(0,this.header.indexOf("-"))+"-瀏覽";
                $('Button.w2ui-btn.btnOuthAdd' ).attr('disabled',false);
                $('Button.w2ui-btn.btnOuthEdit').attr('disabled',false);
                  grid2.toolbar.enable('w2ui-add');
                if (grid1.getSelection().length>0) {
                  $('Button.w2ui-btn.btnOuthDel' ).attr('disabled',false);
                } else {
                  $('Button.w2ui-btn.btnOuthDel' ).attr('disabled',true);
                }
                $('Button.w2ui-btn.btnOuthSave').attr('disabled',true);
                $('Button.w2ui-btn.btnOuthCancel').attr('disabled',true);
                break;
          }
          //on("complete", function() {form1.record['cust_no'].id = form1.record['cust_no'];});
      },
      onLoad : function(event)  {
          //defineFieldFocus();
          //if (typeof form1.record['cust_no']=='object')  form1.record['cust_no'].id = form1.record['cust_no'];
      },
      onChange: function(event)  {
          if (config.opMode=='browse')  return;
          consoleLog('opMode:',config.opMode);
          switch(event.target)  {
            case "date"      :
                var ym = YearMonth(form1.get('date').el.value).replace("/","");
                form1.record['yymm']=form1.get('yymm').el.value = ym;
                if  (config.opMode=='new')      autoDocno("outh0100.php","doc_no",ym,4);
                break;
            case "cust_na"  :
                consoleLog(form1.get('cust_no').el.value);
                break;
            case "cust_no"  :
                if (!spForm1('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
                formc.postData['cust_no']= formc.recid= form1.record['cust_no'];
                formc.reload( function(data){
                  if (data.status="success") {
                    form1.record['toaddr']=form1.get('toaddr').el.value= formc.record['co_addr3'];
                    form1.record['mail']  =form1.get('mail').el.value= formc.record['remail'];
                    form1.record['pay_kind']=form1.get('pay_kind').el.value= formc.record['pay_kind'];
                    form1.record['inv']   =form1.get('inv').el.value= ((formc.record['fsn']!=null)?"Y":"N");
                  } else consoleLog("cust toaddr not set");
                });
                break;
            case "inv"  :
            case "tax"  :
            case "tax_no"  :
                if (form1.get('inv').el.value.toUpperCase()=="Y" && form1.get('tax').el.value.toUpperCase()!="Y") {
                  form1.record['taxamt']=form1.get('taxamt').el.value = pfForm1('amt') * 0.05;
                } else {
                  form1.record['taxamt']=form1.get('taxamt').el.value = 0;
                }
                break;
            default   :
                //consoleLog("change none process");
                break;
          }
      },
      onSave: function (data) {
           if (data.status == 'success') {
                  lstRecid=form1.record['doc_no'];
                  grid1.render();
             }
      },
      actions: {
        add: {caption:"新增" , "class":"btnOuthAdd"  , onClick:function(event) {
            editOutData("");
        }},
        edit: {caption:"編輯" , "class":"btnOuthEdit" , onClick:function(event) {
            editOutData(this.recid);
        }},
        "delete" : {caption:"刪除" , "class":"btnOuthDel" , onClick:function(event) {
            consoleLog('delete', grid1.getSelection());
                w2confirm({
                    title : w2utils.lang('Delete Confirmation'),
                    msg   : "確定刪除本筆資料 及 明細項目資料嗎？",
                    yes_class : 'w2ui-btn-red',
                    callBack: function (result) {
                        if (result == 'Yes') grid1['delete'](true);
                    }
                });
        }},
        "save": {caption:"存檔" , "class":"btnOuthSave" ,onClick:function(event) {
            if (!spForm1('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
            if (form1.record['pay_kind']!=null && typeof form1.record['pay_kind']=='object')  form1.record['pay_kind']=  form1.record['pay_kind'].id;
            if (form1.record['pay_kind']!=null && typeof form1.record['usdtwd'  ]=='object')  form1.record['usdtwd']=  form1.record['usdtwd'].id;
            this.save(function (data) {
              if (data.status == 'success') {
                lstRecid=form1.record['doc_no'];
                grid1.render();
              }
            });
        }} ,
        cancel: {caption:"取消" , "class":"btnOuthCancel" , onClick: function(event) {
            config.opMode="browse";
            grid1.click(lstRecid);
        }  }
        ,print: {caption:"請款單" , "class":"btnOutp0100" , onClick: function(even) {
            print_doc = form1.record['doc_no'];
            ReadJS('outp0100');
        } }
      }
    },
    grid2: {
        name: "grid2outb0100",
        url: "outi0100.php",
        header: "出貨資料明細",
        columns: [
            { field: "autoid"   , caption: "ID"      , size: "1% " , hidden:true },
            { field: "doc_no"   , caption: "單號"    , size: "1% " , hidden:true },
            { field: "stk_no"   , caption: "產品編號", size: "10%"  },
            { field: "stk_na"   , caption: "產品名稱", size: "20%"  },
            { field: "spec"     , caption: "規格"    , size: "20%"  },
            { field: "qty"      , caption: "數量"    , size: "10%" , style:"text-align:right;" , render:'float:0'  },
            { field: "unitc"    , caption: "單位"    , size: "6%"   },
            { field: "price"    , caption: "單價"    , size: "10%" , style:"text-align:right;" , render:'float:2'  },
            { field: "amt"      , caption: "金額"    , size: "10%" , style:"text-align:right;" , render:'float:2' }
        ],
        searchData : [
            { field : 'doc_no', value : "" , operator : 'is', type: 'text' }
        ],
        show: {
            header        : false,
            toolbar       : true,
            footer        : true,
            toolbarSearch : false,
            toolbarAdd    : true,
            toolbarEdit   : true,
            toolbarSave   : false,
            toolbarDelete : true
        },
        onDblClick: function(event) {
            editOutItem(event.recid);
        },
        onEdit: function(event){
            editOutItem(event.recid);
        },
        onAdd: function (event) {
            editOutItem(0);
        },
        onDelete: function (event) {
            event.onComplete = function () {
              form1.render();
            };
        }
    },
    form2: {
      name: "form2outb0100",
      url: "outi0100.php",
      fields: [
        { name  : "autoid"   , type:"text" , required: false, html: {caption:"ID"      , span:11 , attr: 'size=10 readonly' }},
        { name  : "doc_no"   , type:"text" , required: false, html: {caption:"單號"    , span:19 , attr: 'size=10 readonly' }},
        { name  : "stk_no"   , type:"combo", required: true , html: {caption:"產品編號", span:11 , attr: 'size=10' }, options:{url:'stkm0100.php'} },
        { name  : "stk_na"   , type:"text" , required: false, html: {caption:"產品名稱", span:11 , attr: 'size=40 readonly'} },
        { name  : "spec"     , type:"text" , required: false, html: {caption:"規格"    , span:11 , attr: 'size=40 readonly'} },
        { name  : "qty"      , type:"float", required: false, html: {caption:"數量"    , span:11 , attr: "size=10 style='text-align:right;' " }},
        { name  : "unitc"    , type:"text" , required: false, html: {caption:"單位"    , span:11 , attr: 'size=6  readonly'} },
        { name  : "price"    , type:"float", required: false, html: {caption:"單價"    , span:11 , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"}},
        { name  : "amt"      , type:"float", required: false, html: {caption:"金額"    , span:11 , attr: "size=16 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "note"     , type:"text" , required: false, html: {caption:"備註"    , span:11 , attr: 'size=40 '} }
      ],
      searchData : [
            { field : 'autoid', value : "" , operator : 'is', type: 'text' } ,
            { field : 'doc_no', value : "" , operator : 'is', type: 'text' }
      ],
      onRender: function(event){
            event.onComplete = function () {
              form2.record['doc_no'] =  form1.get('doc_no'   ).el.value ;
              if (form2.recid==0 || form2.recid=='') {
                  for (i=0; i<form2.fields.length; i++) {
                    if (form2.fields[i].type=='float' || form2.fields[i].type=='number' )  form2.record[form2.fields[i].name] = 0
                  }
              }
            };
      },
      onChange: function(event)  {
          switch(event.target)  {
            case "stk_no"  :
                if (!spForm2('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
                forms.postData['stk_no']= forms.recid=form2.record['stk_no'];
                forms.reload( function(data){
                  if (data.status="success") {
                    form2.get('spec').el.value= forms.record['spec'];
                    form2.record['spec']=form2.get('spec').el.value= forms.record['spec'];
                  } else consoleLog("stk spec not set");
                });
                break;
            case "price" :
            case "qty" :
                form2.record['amt']=form2.get('amt').el.value= Math.round(pfForm2('qty')*pfForm2('price'),0);
                break;
            default   :
                //consoleLog("change none process");
                break;
          }
      },
      onSave: function (data) {
                    if (data.status == 'success') {
                        $().w2popup('close');
                        form1.render();
                        grid2.reload();
                    }
      },
        actions: {
            "save":{ caption:"存檔"  , onClick:function () {
                if (!spForm2('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
                this.save(function (data) {
                    if (data.status == 'success') {
                        form1.render();
                        grid2.reload();
                        $().w2popup('close');
                    }
                    // if error, it is already displayed by w2form
                });
            }},
            "cancel":{ caption:"取消"  , onClick: function () {
                $().w2popup('close');
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

  function editOutData(recid) {
            config.opMode = ( (recid==0 || recid=='')  ? "new" : "edit");
            if (config.opMode=="new") {
              form1.clear();
              form1.enable(config.dbMkey);
                grid2.searchData[0].value= "";
                grid2.reload();
              var ym = thisMonth().replace("/","");
              autoDocno("outh0100.php","doc_no",ym,4);
              form1.record['date'   ]=form1.get('date'    ).el.value = today() ;
              form1.record['yymm'   ]=form1.get('yymm'    ).el.value = ym;
              form1.record['usdtwd' ]=form1.get('usdtwd'  ).el.value = "TWD";
              for (i=0; i<form1.fields.length; i++) {
                if (form1.fields[i].type=='float' || form1.fields[i].type=='number' )  form1.record[form1.fields[i].name] = form1.get(form1.fields[i].name).el.value=0
              }
              form1.record['currate']=form1.get('currate' ).el.value = 1;
            }
            else {
              form1.recid=recid;
              form1.render();
              form1.disable(config.dbMkey);
            }
            $(".w2ui-input:input").attr('disabled',false);
            $('Button.w2ui-btn.btnOuthAdd' ).attr('disabled',true);
            $('Button.w2ui-btn.btnOuthEdit').attr('disabled',true);
            $('Button.w2ui-btn.btnOuthDel' ).attr('disabled',true);
            $('Button.w2ui-btn.btnOuthSave').attr('disabled',false);
            $('Button.w2ui-btn.btnOuthCancel').attr('disabled',false);
            //$(".w2ui-btn:button").attr('disabled',false);

  }

  function editOutItem(recid) {
    $().w2popup('open', {
        title   : ((recid == 0 || recid=='') ? '新增' : '編輯'),
        body    : '<div id="pop_edit" style="width: 100%; height: 100%"></div>',
        style   : 'padding: 15px 0px 0px 0px',
        width   : 620,
        height  : 420,
        onOpen  : function (event) {
            event.onComplete = function () {
                form2.clear();
                form2.recid = recid;
                if (recid==0 || recid=='')  {
                  form2.searchData[0].value= recid;
                  form2.searchData[1].value= form1.record[config.dbMkey];
                } else {
                  form2.searchData[0].value= recid;
                  form2.searchData[1].value= grid2.get(recid)[config.dbMkey];
                }
                $('#w2ui-popup #pop_edit').w2render(form2.name);
            }
        }
    });
  }

  function autoDocno(url, fldName, prefix, numLen) {
    var cmdRequest = {} ;
    var postData   = {} ;
    cmdRequest['cmd']='auto-no';
    cmdRequest['prefix']=prefix;
    cmdRequest['field'] =fldName;
    //$.extend(cmdRequest, postData);
    var ajaxOptions = {
        type     : 'POST',
        url      : url,
        data     : cmdRequest,
        dataType : 'text'   // expected from server
    };
    lastVal = 0;
    //consoleLog(ajaxOptions);
    ajaxOptions.data =  String($.param(ajaxOptions.data, false)).replace(/%5B/g, '[').replace(/%5D/g, ']');
    var xhr = $.ajax(ajaxOptions)
                .done(function (data, status, xhr) {
                    if (status == 'success') {
                      data = JSON.parse(data);
                      //consoleLog(data);
                      //consoleLog(data.record);
                      if (data.record.length==0) {
                        lastVal=0;
                      } else {
                        //consoleLog(data.record[fldName]);
                        //consoleLog(data.record[fldName].substr(prefix.length));
                        lastVal = parseInt(data.record[fldName].substr(prefix.length));
                      }
                      //consoleLog(lastVal);
                        nextVal = lastVal+1;
                        //consoleLog(nextVal);
                        form1.get(fldName).el.value = prefix + padLeftZero(nextVal, numLen);
                        form1.record[fldName] = prefix + padLeftZero(nextVal, numLen);
                    }
                })
                .fail(function (xhr, status, error) {
                      consoleLog(xhr, status, error);

                });
    //return prefix + padLeftZero(lastVal+1, numLen);
  }

});

// JavaScript Document
// isub0100.js
$(function(){
  // 設定
  var config = {
    name: "isub0100",
    dbMTable : "isuh0100",
    dbMkey   : "doc_no",
    dbSTable : "isui0100",
    dbSkey   : "autoid",
    dbRelVal : "",
    opMode   : "browse",
    mainscr: {
      name: "isub0100" ,
      panels:[
        {type: "left"    , "size":"25%", "resizable": true } ,
        {type: "main"    , "size":"40%", "resizable": true } ,
        {type: "preview" , "size":"60%", "resizable": true }
      ]
    } ,
    grid1: {
        name: "grid1isub0100",
        url: "isuh0100.php",
        header: "入庫資料清單",
        columns: [
            { field: "doc_no"  , caption: "入庫單號", size: "40%" , sortable: true, hidden:false },
            { field: "date"    , caption: "入庫日期", size: "30%" , sortable: true, render:'date:yyyy/mm/dd' },
            { field: "cust_no" , caption: "廠商編號", size: "30%" , sortable: true, hidden:false }
        ],
        multiSort: true,
        multiSelect:false,
        sortData: [
            { field: 'date'    , direction: 'desc' },
            { field: 'doc_no'  , direction: 'desc' },
            { field: 'cust_no' , direction: 'asc' }
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
            { field: "doc_no"  , caption: "入庫單號", type: "text", operator: "begins" },
            { field: "date"    , caption: "入庫日期", type: "date", operator: "between" },
            { field: "cust_no" , caption: "廠商編號", type: "text", operator: "contains" }
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
      name: "form1isub0100",
      url: "isuh0100.php",
      header: "入庫資料明細-瀏覽",
      fields: [
        { name  : "doc_no"  , type:"text" , required: true , html: {caption:"入庫單號", span:11  , attr: 'size=10 ' }},
        { name  : "date"    , type:"date" , required: true , html: {caption:"入庫日期", span:15  , attr: 'size=10 ' } , options:{format:'yyyy/mm/dd'} },
        { name  : "yymm"    , type:"text" , required: true , html: {caption:"帳款月份", span:15  , attr: 'size=7  ' } , options:{format:'yyyy-mm'} },
        { name  : "cust_no" , type:"combo", required: true , html: {caption:"廠商編號", span:11  , attr: 'size=10'}, options:{url:"venm0100.php"} },
        { name  : "cust_na" , type:"text" , required: false, html: {caption:"廠商簡稱", span:15  , attr: 'size=10 readonly'} },
        { name  : "tran_no" , type:"text" , required: false, html: {caption:"原始單號", span:15  , attr: "size=10 " }},
        { name  : "toaddr"  , type:"text" , required: false, html: {caption:"交貨地址", span:11  , attr: "size=40 "} },
        { name  : "remark"  , type:"text" , required: false, html: {caption:"備註"    , span:15  , attr: "size=40 " }},
        { name  : "amt"     , type:"float", required: false, html: {caption:"合計金額", span:19  , attr: "size=16 style='text-align:right;' readonly" } , options:{precision:"2"} }
      ],
      onRefresh: function(event)  {
          switch (config.opMode)  {
            case "new" :
                this.header =this.header.substr(0,this.header.indexOf("-"))+"-新增";
                break;
            case "edit":
                this.header =this.header.substr(0,this.header.indexOf("-"))+"-修改";
                break;
            default    :
                this.header =this.header.substr(0,this.header.indexOf("-"))+"-瀏覽";
                $('Button.w2ui-btn.btnOuthAdd' ).attr('disabled',false);
                $('Button.w2ui-btn.btnOuthEdit').attr('disabled',false);
                if (grid1.getSelection().length>0)
                  $('Button.w2ui-btn.btnOuthDel' ).attr('disabled',false);
                else
                  $('Button.w2ui-btn.btnOuthDel' ).attr('disabled',true);
                $('Button.w2ui-btn.btnOuthSave').attr('disabled',true);
                $('Button.w2ui-btn.btnOuthCancel').attr('disabled',true);
                break;
          }
      },
      onLoad : function(event)  {
          //defineFieldFocus();
      },
      onChange: function(event)  {
          if (config.opMode=='browse')  return;
          consoleLog('opMode:',config.opMode)
          switch(event.target)  {
            case "date"      :
                ym = form1.record['yymm']=form1.get('yymm').el.value=YearMonth(form1.get('date').el.value).replace('/','');
                autoDocno("isuh0100.php","doc_no",ym,4);
                break;
            case "cust_no"  :
                if (!spForm1('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
                formv.postData['cust_no']= formv.recid=form1.record['cust_no'];;
                formv.reload( function(data){
                  if (data.status="success") {
                    form1.record['toaddr']=form1.get('toaddr').el.value= formv.record['co_addr3'];
                  } else consoleLog("cust toaddr not set");
                });
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
            form1.record['toaddr' ] =  form1.get('toaddr' ).el.value ;
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
      }
    },
    grid2: {
        name: "grid2isub0100",
        url: "isui0100.php",
        header: "入庫資料明細",
        columns: [
            { field: "autoid"   , caption: "ID"      , size: "1% " , hidden:true },
            { field: "doc_no"   , caption: "單號"    , size: "1% " , hidden:true },
            { field: "stk_no"   , caption: "貨品編號", size: "10%"  },
            { field: "stk_na"   , caption: "貨品名稱", size: "20%"  },
            { field: "spec"     , caption: "規格"    , size: "20%"  },
            { field: "wrk_no"   , caption: "託工單號", size: "10%"  },
            { field: "wkt_no"   , caption: "加工"    , size: "05%"  },
            { field: "in_stk"   , caption: "入庫"    , size: "05%"  },
            { field: "qty"      , caption: "數量"    , size: "10%" , style:"text-align:right;" , render:'float:0'  },
            { field: "unitc"    , caption: "單位"    , size: "05%"   },
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
      name: "form2isub0100",
      url: "isui0100.php",
      fields: [
        { name  : "autoid"   , type:"text" , required: false, html: {caption:"ID"      , span:11 , attr: 'size=10 readonly' }},
        { name  : "doc_no"   , type:"text" , required: false, html: {caption:"單號"    , span:19 , attr: 'size=10 readonly' }},
        { name  : "wrk_no"   , type:"combo", required: false, html: {caption:"託工單號", span:11 , attr: 'size=16 '}, options:{url:'wrkm0100.php'} },
        { name  : "stk_no"   , type:"combo", required: true , html: {caption:"產品編號", span:11 , attr: 'size=10' }, options:{url:'stkm0100.php'} },
        { name  : "stk_na"   , type:"text" , required: false, html: {caption:"產品名稱", span:11 , attr: 'size=30 readonly'} },
        { name  : "spec"     , type:"text" , required: false, html: {caption:"規格"    , span:15 , attr: 'size=30 readonly'} , options:{url:'wrkm0100.php'}},
        { name  : "wkt_no"   , type:"combo", required: false, html: {caption:"加工"    , span:11 , attr: 'size=10 '}, options:{url:'wktm0100.php'} },
        { name  : "wkt_na"   , type:"text" , required: false, html: {caption:"名稱"    , span:15 , attr: 'size=20 readonly'} },
        { name  : "in_stk"   , type:"text" , required: false, html: {caption:"入庫"    , span:11 , attr: 'size=10 '} },
        { name  : "qty"      , type:"float", required: false, html: {caption:"數量"    , span:11 , attr: "size=10 style='text-align:right;' " }},
        { name  : "unitc"    , type:"text" , required: false, html: {caption:"單位"    , span:15 , attr: 'size=6  readonly'} },
        { name  : "price"    , type:"float", required: false, html: {caption:"單價"    , span:11 , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"}},
        { name  : "amt"      , type:"float", required: false, html: {caption:"金額"    , span:11 , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} }
      ],
      searchData : [
            { field : 'autoid', value : "" , operator : 'is', type: 'text' } ,
            { field : 'doc_no', value : "" , operator : 'is', type: 'text' }
      ],
      onRender: function(event){
            event.onComplete = function () {
              form2.record['doc_no'] =  form1.get('doc_no'   ).el.value ;
              form2.get('wrk_no').options.url = 'wrkm0100.php?cust_no='+form1.record['cust_no'];
              if (form2.recid==0 || form2.recid=='') {
                  for (i=0; i<form2.fields.length; i++) {
                    if (form2.fields[i].type=='float' || form2.fields[i].type=='number' )  form2.record[form2.fields[i].name] = 0
                  }
              }
            };
      },
      onChange: function(event)  {
          switch(event.target)  {
            case "wrk_no"  :
                //if (!spForm1('wrk_no','wrk_no,stk_no,wkt_no,price,qty,amt'))  w2alert('欄位選擇不正確');
                var v  = form2.get('wrk_no').el.value;
                if ((v!=null || v!='') && v.indexOf(' | ')>=0) {
                  tmp=v.split(" | ");
                  form2.record['wrk_no' ]=form2.get('wrk_no' ).el.value= tmp[0];
                  form2.record['stk_no' ]=form2.get('stk_no' ).el.value= tmp[1];
                  form2.record['wkt_no' ]=form2.get('wkt_no' ).el.value= tmp[2];
                  form2.record['price'  ]=form2.get('price'  ).el.value= tmp[3].replace(",","");
                  form2.record['qty'    ]=form2.get('qty'    ).el.value= tmp[4].replace(",","")-tmp[5].replace(",","");
                  form2.record['amt'    ]=form2.get('amt'    ).el.value= Math.round(form2.record['qty'] * form2.record['price'],0);
                  form2.refresh();
                }
                break;
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
            case "wkt_no":
                if (!spForm2('wkt_no','wkt_no,wkt_na'))  w2alert('欄位選擇不正確');
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
                if (!spForm2('wrk_no','wrk_no'))  w2alert('欄位選擇不正確');
                if (!spForm2('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
                if (!spForm2('wkt_no','wkt_no,wkt_na'))  w2alert('欄位選擇不正確');
                this.save(function (data) {
                    if (data.status == 'success') {
                        $().w2popup('close');
                        consoleLog('close pop win');
                        form1.render();
                        grid2.reload();
                    }
                    // if error, it is already displayed by w2form
                    consoleLog(data);
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
        //w2ui[config.name].content('right'  , form1);
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
              form1.record['date'    ] = form1.get('date'    ).el.value = today() ;
              ym = form1.record['yymm']=form1.get('yymm').el.value=thisMonth().replace('/','');
              autoDocno("isuh0100.php","doc_no",ym,4);
              for (i=0; i<form1.fields.length; i++) {
                if (form1.fields[i].type=='float' || form1.fields[i].type=='number' )  form1.record[form1.fields[i].name] = form1.get(form1.fields[i].name).el.value=0
              }
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

// JavaScript Document
// wrkm0100.js
$(function(){
  // 設定
  var config = {
    name: "wrkm0100",
    dbMTable : "wrkm0100",
    dbMkey   : "doc_no",
    //dbSTable : "outi0100",
    //dbSkey   : "autoid",
    dbRelVal : "",
    opMode   : "browse",
    mainscr: {
      name: "wrkm0100" ,
      panels:[
        //{type: "left"    , "size":"20%", "resizable": true } ,
        {type: "main"    , "size":"60%", "resizable": true } ,
        {type: "right"   , "size":"40%", "resizable": true }
      ]
    } ,
    grid1: {
        name: "grid1wrkm0100",
        url: "wrkm0100.php",
        header: "託工資料清單",
        columns: [
            { field: "doc_no"   , caption: "託工單號", size: "14%" , sortable: true, hidden:false },
            { field: "date"     , caption: "託工日期", size: "12%" , sortable: true, render:'date:yyyy/mm/dd' },
            { field: "cust_no"  , caption: "廠商編號", size: "08%" , sortable: true, hidden:false },
            { field: "cust_na"  , caption: "廠商簡稱", size: "10%" , sortable: false, hidden:false },
            { field: "stk_no"   , caption: "貨品編號", size: "10%" , sortable: true },
            { field: "stk_na"   , caption: "貨品名稱", size: "16%"  },
            { field: "qty"      , caption: "數量"    , size: "10%" , style:"text-align:right;" , render:'float:0'  },
            { field: "price"    , caption: "單價"    , size: "10%" , style:"text-align:right;" , render:'float:2'  },
            { field: "amt"      , caption: "金額"    , size: "10%" , style:"text-align:right;" , render:'float:2' }
        ],
//        toolbar: {
//            items: [
//                { type: 'break' },
//                { type: 'html', id: 'grid1title', html: '<b>託工資料清單</b>', text: '託工資料清單', img: 'icon-folder' }
//            ],
//            onClick: function (target, data) {
//                console.log(target);
//            }
//        },
        multiSort: true,
        multiSelect:false,
        sortData: [
            { field: 'date'    , direction: 'desc' },
            { field: 'doc_no'  , direction: 'desc' }
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
            { field: "doc_no"  , caption: "託工單號", type: "text", operator: "begins" },
            { field: "date"    , caption: "託工日期", type: "date", operator: "between" },
            { field: "wrkm0100.cust_no" , caption: "廠商編號", type: "text", operator: "contains" },
            { field: "wrkm0100.stk_no" , caption: "貨品編號", type: "text", operator: "contains" }
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
            $(".w2ui-input:input").attr('disabled',false);
            form1.disable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
            form1.clear();
        }
    } ,
    form1: {
      name: "form1wrkm0100",
      url: "wrkm0100.php",
      header: "託工資料明細-瀏覽",
      fields: [
        { name  : "doc_no"  , type:"text" , required: true , html: {caption:"託工單號", span:11  , attr: 'size=12 ' }},
        { name  : "date"    , type:"date" , required: true , html: {caption:"託工日期", span:15  , attr: 'size=10 ' } , options:{format:'yyyy/mm/dd'} },
        { name  : "cust_no" , type:"combo", required: true , html: {caption:"廠商編號", span:11  , attr: 'size=8  '}, options:{url:"venm0100.php"} },
        { name  : "cust_na" , type:"text" , required: false, html: {caption:"廠商簡稱", span:15  , attr: 'size=10 readonly'} },
        { name  : "stk_no"  , type:"combo", required: true , html: {caption:"產品編號", span:11  , attr: 'size=10'}, options:{url:"stkm0100.php"} },
        { name  : "stk_na"  , type:"text" , required: false, html: {caption:"產品名稱", span:15  , attr: 'size=30 readonly'} },
        { name  : "wkt_no"  , type:"combo", required: false, html: {caption:"加工"    , span:11  , attr: 'size=10'}, options:{url:"wktm0100.php" } },
        { name  : "wkt_na"  , type:"text" , required: false, html: {caption:"流程"    , span:15  , attr: 'size=10 readonly'} },
        { name  : "qty"     , type:"float", required: false, html: {caption:"數量"    , span:11  , attr: "size=10 style='text-align:right;' " } , options:{precision:"0"} },
        { name  : "price"   , type:"float", required: false, html: {caption:"單價"    , span:15  , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "amt"     , type:"float", required: false, html: {caption:"金額"    , span:15  , attr: "size=10 style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "date1"   , type:"text" , required: false, html: {caption:"交貨日期", span:15  , attr: "size=30 " }},
        { name  : "qty1"    , type:"text" , required: false, html: {caption:"交貨數量", span:15  , attr: "size=30 " }},
        { name  : "tocust"  , type:"combo", required: false, html: {caption:"指送廠商", span:15  , attr: 'size=10'}, options:{url:"venm0100.php"} },
        //{ name  : "toabbr"  , type:"text" , required: false, html: {caption:"簡稱"    , span:15  , attr: "size=10 " }},
        { name  : "toaddr"  , type:"text" , required: false, html: {caption:"交貨地址", span:15  , attr: "size=40 " }},
        { name  : "spec"    , type:"text" , required: false, html: {caption:"規格"    , span:15  , attr: "size=40 " }},
        { name  : "ins_qty" , type:"float", required: false, html: {caption:"已交"    , span:15  , attr: "size=10 readonly style='text-align:right;' " } , options:{precision:"2"} },
        { name  : "note"    , type:"text" , required: false, html: {caption:"說明"    , span:11  , attr: "size=30 "} },
        { name  : "bom_no"  , type:"combo", required: false, html: {caption:"機種"    , span:15  , attr: "size=10 " }}
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
                $('Button.w2ui-btn.btnWrkmAdd' ).attr('disabled',false);
                $('Button.w2ui-btn.btnWrkmEdit').attr('disabled',false);
                if (grid1.getSelection().length>0)
                  $('Button.w2ui-btn.btnWrkmDel' ).attr('disabled',false);
                else
                  $('Button.w2ui-btn.btnWrkmDel' ).attr('disabled',true);
                $('Button.w2ui-btn.btnWrkmSave').attr('disabled',true);
                $('Button.w2ui-btn.btnWrkmCancel').attr('disabled',true);
                break;
          }
      },
      onLoad : function(event)  {
          //defineFieldFocus();
      },
      onRefresh: function(event){
        event.onComplete = function () {
          form1.get('wkt_no').options.url = 'swkm0100.php?stk_no='+form1.record['stk_no'];
          //consoleLog(form1.get('stk_no').el.value);
        };
      },
      onChange: function(event)  {
          if (config.opMode=='browse')  return;
          switch(event.target)  {
            case "date"  :
                var ym = form1.get('date').el.value.substr(0,7).replace("-","").replace("/","");
                autoDocno("wrkm0100.php","doc_no",ym,3);
                break;
            case "cust_no"  :
                if (!spForm1('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
                break;
            case "tocust"  :
                if (!spForm1('tocust','tocust'))  w2alert('欄位選擇不正確');
                formv.postData['cust_no']= formv.recid=form1.record['tocust'];
                formv.reload( function(data){
                  if (data.status="success") {
                    form1.record['toaddr']=form1.get('toaddr').el.value= formv.record['co_addr3'];
                  } else consoleLog("cust toaddr not set");
                });
                break;
            case "stk_no"  :
                if (!spForm1('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
                forms.recid=forms.postData['stk_no']=form1.record['stk_no']
                forms.reload( function(data){
                  if (data.status="success") {
                    form1.record['spec']=form1.get('spec').el.value= forms.record['spec'];
                  } else consoleLog("stk spec not set");
                });
                form1.get('wkt_no').options.url = 'swkm0100.php?stk_no='+form1.get('stk_no').el.value;
                form1.refresh();
                break;
            case "wkt_no"  :
                if (!spForm1('wkt_no','wkt_no,wkt_na,price'))  w2alert('欄位選擇不正確');
                //consoleLog(form1.get('wkt_no'));
                break;
            case "price" :
            case "qty" :
                form1.record['amt']=form1.get('amt').el.value= Math.round(pfForm1('qty')*pfForm1('price'),0);
                consoleLog(pfForm1('qty'),pfForm1('price')) ;
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
        add: {caption:"新增" , "class":"btnWrkmAdd"  , onClick:function(event) {
            editWrkmData("");
        }},
        edit: {caption:"編輯" , "class":"btnWrkmEdit" , onClick:function(event) {
            editWrkmData(this.recid);
        }},
        "delete" : {caption:"刪除" , "class":"btnWrkmDel" , onClick:function(event) {
            //consoleLog('delete', grid1.getSelection());
                w2confirm({
                    title : w2utils.lang('Delete Confirmation'),
                    msg   : "確定刪除本筆資料 及 明細項目資料嗎？",
                    yes_class : 'w2ui-btn-red',
                    callBack: function (result) {
                        if (result == 'Yes') grid1['delete'](true);
                    }
                });
        }},
        "save": {caption:"存檔" , "class":"btnWrkmSave" ,onClick:function(event) {
            var newDocno;
            if (!spForm1('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
            if (!spForm1('tocust','tocust'))  w2alert('欄位選擇不正確');
            if (!spForm1('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
            if (!spForm1('wkt_no','wkt_no,wkt_na'))  w2alert('欄位選擇不正確');
            form1.record['qty']=form1.get('qty').el.value=pfForm1('qty');
            form1.record['price']=form1.get('price').el.value=pfForm1('price');
            form1.record['amt']=form1.get('amt').el.value=pfForm1('amt');
            this.save(function (data) {
                if (data.status == 'success') {
                  //grid1.reload();
                  lstRecid=newDocno;
                  grid1.render();
                  //grid1.select(newDocno);
                }
            });
        }} ,
        cancel: {caption:"取消" , "class":"btnWrkmCancel" , onClick: function(event) {
            config.opMode="browse";
            grid1.click(lstRecid);
        }  }
        ,"open": {caption:"展開" , "class":"btnWrkmOpen" ,onClick:function(event) {
            openWrkmData();
        }}
        ,print: {caption:"採購單" , "class":"btnWrkp0100" , onClick: function(even) {
            print_cus = form1.record['cust_no'];
            print_bno = form1.record['doc_no'];
            ReadJS('wrkp0100');
        } }
      }
    } ,
    form2: {
      name: "form2wrkm0101",
      url: "wrkm0100.php",
      //header: "託工資料明細-展開",
      fields: [
        { name  : "date"    , type:"date"  , required: true , html: {caption:"託工日期", span:15  , attr: 'size=10 ' } , options:{format:'yyyy/mm/dd'} },
        { name  : "stk_no"  , type:"combo", required: true , html: {caption:"產品編號", span:11  , attr: 'size=10'}, options:{url:"stkm0100.php"} },
        { name  : "stk_na"  , type:"text" , required: false, html: {caption:"產品名稱", span:15  , attr: 'size=30 readonly'} },
        { name  : "qty"     , type:"float", required: false, html: {caption:"數量"    , span:11  , attr: "size=10 style='text-align:right;' " } , options:{precision:"0"} }
      ],
      onRender: function(event){
        form2.record['date']=today();
      },
      onChange: function(event)  {
          switch(event.target)  {
            case "stk_no"  :
                if (!spForm2('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
                break;
          }
      },
      actions: {
        "open": {caption:"展開" , "class":"btnWrkmOpen"  , onClick:function(event) {
            openWrkmItem("");
            $().w2popup('close');
        }},
        cancel: {caption:"取消" , "class":"btnWrkmCancel" , onClick: function(event) {
            //config.opMode="browse";
            //grid1.click(lstRecid);
            $().w2popup('close');
        }  }
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

  function editWrkmData(recid) {
            config.opMode = ( (recid==0 || recid=='')  ? "new" : "edit");
            if (config.opMode=="new") {
              form1.clear();
              form1.enable(config.dbMkey);
              //  grid2.searchData[0].value= "";
              //  grid2.reload();
              var dt = new Date();
              var ym = dt.getFullYear() + "" + padLeftZero(dt.getMonth()+1,2);
              //consoleLog(dt , ym);
              autoDocno("wrkm0100.php","doc_no",ym,3);
              form1.get('date').el.value = dt.getFullYear() +"-" + padLeftZero(dt.getMonth()+1,2) +"-" + padLeftZero(dt.getDate(),2) ;
              form1.record['date'] = form1.get('date').el.value;
              form1.record['tocust']='Z02';
              for (i=0; i<form1.fields.length; i++) {
                if (form1.fields[i].type=='float' || form1.fields[i].type=='number' )  form1.record[form1.fields[i].name] = form1.get(form1.fields[i].name).el.value=0
              }
              form1.render();
              //defaultYM();
            }
            else {
              //form1.recid=recid;
              //form1.render();
              form1.disable(config.dbMkey);
            }
            $(".w2ui-input:input").attr('disabled',false);
            $('Button.w2ui-btn.btnWrkmAdd' ).attr('disabled',true);
            $('Button.w2ui-btn.btnWrkmEdit').attr('disabled',true);
            $('Button.w2ui-btn.btnWrkmDel' ).attr('disabled',true);
            $('Button.w2ui-btn.btnWrkmSave').attr('disabled',false);
            $('Button.w2ui-btn.btnWrkmCancel').attr('disabled',false);
            //$(".w2ui-btn:button").attr('disabled',false);
                form1.record['amt']=form1.get('amt').el.value= Math.round(pfForm1('qty')*pfForm1('price'),0);
  }

  function openWrkmData(recid) {
    $().w2popup('open', {
        title   : '託工資料明細-展開',
        body    : '<div id="pop_edit" style="width: 100%; height: 100%"></div>',
        style   : 'padding: 15px 0px 0px 0px',
        width   : 420,
        height  : 320,
        onOpen  : function (event) {
            event.onComplete = function () {
                form2.clear();
                form2.recid = recid;
                $('#w2ui-popup #pop_edit').w2render(form2.name);
            }
        }
    });
  }

  function openWrkmItem(op) {
    var cmdRequest = {} ;
    var postData   = {} ;
    cmdRequest['cmd']='open-item';
    cmdRequest['opdate']=form2.record['date'].replace("-","/");
    cmdRequest['stk_no']=form2.record['stk_no'] = form2.get('stk_no').el.value;
    cmdRequest['qty'   ]=form2.record['qty'];
    //cmdRequest['price' ]=form2.record['price'];
    var ajaxOptions = {
        type     : 'POST',
        url      : form2.url,
        data     : cmdRequest,
        dataType : 'text'   // expected from server
    };
    //consoleLog(ajaxOptions);
    ajaxOptions.data =  String($.param(ajaxOptions.data, false)).replace(/%5B/g, '[').replace(/%5D/g, ']');
    var xhr = $.ajax(ajaxOptions)
                .done(function (data, status, xhr) {
                    if (status == 'success') {
                      data = JSON.parse(data);
                      //consoleLog(data);
                      //consoleLog(data.records);
                      if (data.records.length==0) {
                        //lstRecid=0;
                      } else {
                        //consoleLog(data.records);
                        //consoleLog(data.record[fldName].substr(prefix.length));
                        lstRecid = data.records[0]['doc_no'];
                        config.opMode="browse";
                        grid1.reload();
                      }
                      //consoleLog("moveToNewDocno",lstRecid);
                    }
                })
                .fail(function (xhr, status, error) {
                      consoleLog(xhr, status, error);

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

  function defaultYM() {
                ym = form1.get('date').el.value;
                //consoleLog("yymm" , ym);
                if (ym=='') return "";
                var d = form1.get('date').el.value;
                  //consoleLog(d, typeof d);
                  yymm = d.substr(0,7);
                if (d!='') {
                  form1.get('yymm').el.value = d.substr(0,7);
                  form1.record['yymm']=form1.get('yymm').el.value;
                  //consoleLog(d, form1.get('yymm').el.value);
                }
                return  form1.record['yymm'];
  }

  function searchSwkm(event){
    fldStk = form1.get('stk_no');
    fldWkt = form1.get('wkt_no');
    //consoleLog(fldStk, fldWkt);
    fldWkt.options.postData['stk_no']=fldStk.el.value;
    //consoleLog(fldStk.el.value, fldWkt.options);
    //consoleLog("search SWKM", event.target, event.url, event.postData);
    //consoleLog("request"    , event.target, event.url, event.postData);
  }
});

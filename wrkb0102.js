// JavaScript Document
// wrkm0100.js
$(function(){
  // 設定
  var config = {
    name: "wrkb0102",
    dbMTable : "wrkm0100",
    dbMkey   : "doc_no",
    //dbSTable : "outi0100",
    //dbSkey   : "autoid",
    dbRelVal : "",
    opMode   : "browse",
    mainscr: {
      name: "wrkb0102" ,
      panels:[
        //{type: "left"    , "size":"20%", "resizable": true } ,
        {type: "main"    , "size":"60%", "resizable": true } ,
        {type: "preview" , "size":"40%", "resizable": true }
      ]
    } ,
    grid1: {
        name: "grid1wrkb0102",
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
            { field: "ins_qty"  , caption: "已入庫量", size: "10%" , style:"text-align:right;" , render:'float:0'  },
            { field: "price"    , caption: "單價"    , size: "10%" , style:"text-align:right;" , render:'float:2'  },
            { field: "amt"      , caption: "金額"    , size: "10%" , style:"text-align:right;" , render:'float:2' }
        ],
        multiSort: true,
        multiSelect:true,
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
        toolbar: {
            items: [
                { type: 'break' },
                { type: 'button', id: 'reCount', caption: '重算已入量', img: 'w2ui-icon-pencil'
                    ,onClick: function (target, data) {
                        nowSel = grid1.getSelection();
                        consoleLog(target, data);
                        consoleLog(lstRecid, nowSel);
                        grid1.save();         // save-records
                    }
                }
            ]
        },
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
                //form1.postData[config.dbMkey]= rcd[config.dbMkey];
                //form1.recid=rcd['recid'];
                //form1.reload();
                grid2.searchData[0].value= rcd[config.dbMkey];
                grid2.reload();
                lstRecid=rcd[config.dbMkey];
            } else {
              grid2.clear();
                lstRecid=0;
            }
            //form1.disable(form1.fields);
            //$(".w2ui-input:input").attr('disabled',true);
            //$(".w2ui-btn:button").attr('disabled',false);
        }
        ,onSave: function(event) {
            consoleLog("save-records for recount")
            event.onComplete = function () {
              grid1.reload();
            };
        }
    } ,
    grid2: {
        name: "grid2wrkb0102",
        url: "isui0100.php",
        header: "入庫資料明細",
        columns: [
            { field: "autoid"   , caption: "ID"      , size: "1% " , hidden:true },
            { field: "wrk_no"   , caption: "託工單號", size: "1% " , hidden:true },
            { field: "doc_no"   , caption: "入庫單號", size: "10%"  },
            { field: "date"     , caption: "入庫日期", size: "10%" , render:'date:yyyy/mm/dd'   },
            { field: "tran_no"  , caption: "原始單號", size: "10%"  },
            { field: "qty"      , caption: "數量"    , size: "10%" , style:"text-align:right;" , render:'float:0'  },
            { field: "price"    , caption: "單價"    , size: "10%" , style:"text-align:right;" , render:'float:2'  },
            { field: "amt"      , caption: "金額"    , size: "10%" , style:"text-align:right;" , render:'float:2' },
            { field: "in_stk"   , caption: "入庫"    , size: "5% " , hidden:true },
            { field: "remark"   , caption: "備註"    , size: "20%"  }
        ],
        searchData : [
            { field : 'wrk_no', value : "" , operator : 'is', type: 'text' }
        ],
        show: {
            header        : true,
            toolbar       : false,
            footer        : true
        },
        onDblClick: function(event) {
            //editOutItem(event.recid);
        },
        onEdit: function(event){
            //editOutItem(event.recid);
        },
        onAdd: function (event) {
            //editOutItem(0);
        },
        onDelete: function (event) {
            event.onComplete = function () {
              form1.render();
            };
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
              autoDocno("wrkm0100.php","doc_no",ym,4);
              form1.get('date').el.value = dt.getFullYear() +"-" + padLeftZero(dt.getMonth()+1,2) +"-" + padLeftZero(dt.getDate(),2) ;
              form1.record['date'] = form1.get('date').el.value;
              //defaultYM();
            }
            else {
              form1.recid=recid;
              form1.render();
              form1.disable(config.dbMkey);
            }
            $(".w2ui-input:input").attr('disabled',false);
            $('Button.w2ui-btn.btnWrkmAdd' ).attr('disabled',true);
            $('Button.w2ui-btn.btnWrkmEdit').attr('disabled',true);
            $('Button.w2ui-btn.btnWrkmDel' ).attr('disabled',true);
            $('Button.w2ui-btn.btnWrkmSave').attr('disabled',false);
            $('Button.w2ui-btn.btnWrkmCancel').attr('disabled',false);
            //$(".w2ui-btn:button").attr('disabled',false);
  }

  function openWrkmData(recid) {
    $().w2popup('open', {
        title   : '託工資料明細-展開',
        body    : '<div id="pop_edit" style="width: 100%; height: 100%"></div>',
        style   : 'padding: 15px 0px 0px 0px',
        width   : 620,
        height  : 420,
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
    cmdRequest['opdate']=form2.record['date'];
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

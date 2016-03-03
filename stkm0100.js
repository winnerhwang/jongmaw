// JavaScript Document
// stkm0100.js
$(function(){
  // 設定
  var config = {
    name: "stkm0100",
    dbMTable : "stkm0100",
    dbMkey   : "stk_no",
    opMode   : "browse",
    mainscr: {
      name: "stkm0100" ,
      panels:[
        {type: "main" , size:"35%", resizable: true } ,
        {type: "right", size:"65%", resizable: true  }
      ]
    }
    ,
    grid1: {
        name: "grid1stkm0100",
        url: "stkm0100.php",
        header: "貨品資料清單",
        columns: [
            { field: "stk_no"  , caption: "貨品編號", size: "20%" , sortable: true },
            { field: "stk_namc", caption: "貨品名稱", size: "40%" , sortable: true },
            { field: "spec"    , caption: "規格"    , size: "40%" , sortable: true }
        ],
        sortData: [
            { field: 'stk_no', direction: 'asc' },
            { field: 'stk_namc', direction: 'asc' },
            { field: 'spec', direction: 'asc' }
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
            { field: "stk_no", caption: "貨品編號", type: "text", operator: "contains" },
            { field: "stk_namc", caption: "貨品名稱", type: "text", operator: "contains" },
            { field: "spec", caption: "規格", type: "text", operator: "contains" }
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
                form1.record['set_date']=for1.get('set_date').el.value=today();
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
            //var frm=w2ui['form1stkm0100'];
            form1.recid="";
            config.opMode = "new";
            //frm.header= frm.header.substr(0,frm.header.indexOf("-"))+"-新增";
            $(".w2ui-input:input").attr('disabled',false);
            form1.enable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
            form1.clear();
            fldDate=form1.get('set_date').el;
            var nowDate= new Date();
            fldDate.value=nowDate.format('yyyy/mm/dd');
            //consoleLog( frm.get('date').el);
              //if (form1.recid==0 || form1.recid=='') {
                  for (i=0; i<form1.fields.length; i++) {
                    if (form1.fields[i].type=='float' || form1.fields[i].type=='number' )
                        form1.record[form1.fields[i].name] = form1.get(form1.fields[i].name).el.value= 0 ;
                  }
              //}
        }
    }
    ,
    form1: {
      name: "form1stkm0100",
      url: "stkm0100.php",
      header: "貨品資料明細-瀏覽",
      itemsKind : [{id:'1',text:'1.鈑金'},{id:'2',text:'2.特殊'},{id:'3',text:'3.套筒'},{id:'4',text:'4.板手'},{id:'5',text:'5.引擎'},{id:'6',text:'6.機械設備'},{id:'7',text:'7.氣動'}],
      //itemsKind : ["1.鈑金", "2.特殊","3.套筒","4.板手","5.引擎","6.機械設備","7.氣動"],
      itemsSal  : [{id:'A',text:'A.內銷'},{id:'B',text:'B.外銷'},{id:'C',text:'C.均有'}],
      //itemsSal  : ['A.內銷', 'B.外銷','C.均有'],
      itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}],
      //itemsYN   : ['Y.是','N.否'],
      tabs: [
          { id: 'tab1', caption: '貨品.摘要' }
         ,{ id: 'tab2', caption: '數量.價格' }
         ,{ id: 'tab3', caption: '加工.廠商' }
      ],
      fields: [
        { name  : "stk_no"  , type:"text" , required: true , html: {caption:"貨品編號", page:0 , span:11 ,attr:'size="10"'} },
        { name  : "stk_namc", type:"text" , required: true , html: {caption:"貨品名稱", page:0 , span:11 ,attr:'size="40"'} },
        { name  : "stk_name", type:"text" , required: false, html: {caption:"英文品名", page:0 , span:15 ,attr:'size="40"'} },
        { name  : "spec"    , type:"text" , required: false, html: {caption:"規格"    , page:0 , span:11 ,attr:'size="40"'} },
        { name  : "mtrl"    , type:"text" , required: false, html: {caption:"材質"    , page:0 , span:15 ,attr:'size="40"'} },
        { name  : "unit"    , type:"text" , required: false, html: {caption:"英文單位", page:0 , span:11 ,attr:'size="4"'} },
        { name  : "unitc"   , type:"text" , required: false, html: {caption:"中文單位", page:0 , span:15 ,attr:'size="4"'} },
        { name  : "kind"    , type:"list" , required: false, html: {caption:"貨品類別", page:0 , span:11 ,attr:'size="10"' },
          options:{items: [{id:'1',text:'1.鈑金'},{id:'2',text:'2.特殊'},{id:'3',text:'3.套筒'},{id:'4',text:'4.板手'},{id:'5',text:'5.引擎'},{id:'6',text:'6.機械設備'},{id:'7',text:'7.氣動'}] }},
        { name  : "sal_knd" , type:"list" , required: false, html: {caption:"內外銷別", page:0 , span:15 ,attr:'size="6"' },
          options:{items: [{id:'A',text:'A.內銷'},{id:'B',text:'B.外銷'},{id:'C',text:'C.均有'}] }},
        { name  : "always"  , type:"list" , required: false, html: {caption:"永久保固", page:0 , span:15 ,attr:'size="4"' },
          options:{items: [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}] }},
        { name  : "ntcost"  , type:"float", required: false, html: {caption:"成本價-台幣", page:1 , span:11, attr:"style='text-align:right;'" } , options:{precision:"2"}  },
        { name  : "uscost"  , type:"float", required: false, html: {caption:"成本價-美金", page:1 , span:15, attr:"style='text-align:right;'" } , options:{precision:"2"}  },
        { name  : "pricent" , type:"float", required: false, html: {caption:"外銷價-台幣", page:1 , span:11, attr:"style='text-align:right;'"} , options:{precision:"2"}  },
        { name  : "priceus" , type:"float", required: false, html: {caption:"外銷價-美金", page:1 , span:15, attr:"style='text-align:right;'"} , options:{precision:"2"}  },
        { name  : "price"   , type:"float", required: false, html: {caption:"內銷售價", page:1 , span:11, attr:"style='text-align:right;'"} , options:{precision:"2"}  },
        { name  : "price1"  , type:"float", required: false, html: {caption:"優惠價"  , page:1 , span:15, attr:"style='text-align:right;'"} , options:{precision:"2"}  },
        { name  : "slr_prcnt",type:"float", required: false, html: {caption:"業務抽成", page:1 , span:15, attr:"style='text-align:right;'" } , options:{precision:"2"}  },
        { name  : "qty"     , type:"float", required: false, html: {caption:"庫存數量", page:1 , span:11, attr:"style='text-align:right;'" } , options:{precision:"2"}  },
        { name  : "safeqty" , type:"float", required: false, html: {caption:"安全庫存-低", page:1 , span:15, attr:"style='text-align:right;'" } , options:{precision:"0"}  },
        { name  : "ord_qty" , type:"float", required: false, html: {caption:"安全庫存-高", page:1 , span:15, attr:"style='text-align:right;'" } , options:{precision:"0"}  },
        { name  : "netkg"   , type:"float", required: false, html: {caption:"重量-淨重", page:1 , span:11, attr:"style='text-align:right;'"} , options:{precision:"2"}  },
        { name  : "grwkg"   , type:"float", required: false, html: {caption:"重量-毛重", page:1 , span:15, attr:"style='text-align:right;'"} , options:{precision:"2"}  },
        { name  : "wkt"     , type:"combo", required: false, html: {caption:"加工"	  , page:2 , span:11}, options:{url:"wktm0100.php"}  },
        { name  : "flow"    , type:"text" , required: false, html: {caption:"加工流程", page:2 , span:15} },
        { name  : "flow_pri", type:"float", required: false, html: {caption:"加工單價", page:2 , span:11, attr:"style='text-align:right;'"} , options:{precision:"2"}  },
        { name  : "wkcost"  , type:"float", required: false, html: {caption:"加工成本", page:2 , span:15, attr:"size=10 style='text-align:right;'"}  , options:{precision:"2"}  },
        { name  : "cust_no" , type:"combo", required: false, html: {caption:"廠商"    , page:2 , span:11 }, options:{url:"venm0100.php"} },
        { name  : "cust_abbr",type:"text" , required: false, html: {caption:"廠名"    , page:2 , span:15 } },
        { name  : "set_date", type:"date" , required: false, html: {caption:"建檔日期", page:2 , span:11 } }
      ],
      onRefresh: function(event)  {
          switch (config.opMode)  {
            case "new" : this.header =this.header.substr(0,this.header.indexOf("-"))+"-新增"; break;
            case "edit": this.header =this.header.substr(0,this.header.indexOf("-"))+"-修改"; break;
            default    : this.header =this.header.substr(0,this.header.indexOf("-"))+"-瀏覽"; break;
          }
          //form1.get('kind').options.items = form1.itemsKind;
          //form1.get('sal_knd').options.items = form1.itemsSal;
          //form1.get('always').options.items = form1.itemsYN;
      },
      onLoad : function(event)  {
          //defineFieldFocus();
      },
      onChange: function(event)  {
          switch(event.target)  {
            case "set_date" :
                consoleLog("date");
                break;
            case "kind" :
                //consoleLog("change kind field",form1.get('kind').el.value);
                //consoleLog(form1);
                break;
            case "wkt"  :
            case "flow"  :
                if (!spForm1('wkt','wkt,flow'))  w2alert('欄位選擇不正確');
                break;
            case "cust_no"  :
            case "cust_abbr"  :
                if (!spForm1('cust_no','cust_no,cust_abbr'))  w2alert('欄位選擇不正確');
                break;
            default   :
                //consoleLog("change none process");
                break;
          }
      },
      actions: {
        "save": {caption:"存檔",onClick:function(event) {
            if (!spForm1('cust_no','cust_no,cust_abbr'))  w2alert('欄位選擇不正確');
            if (form1.record['kind']!=null) form1.record['kind'] = form1.record['kind'].id
            if (form1.record['sal_knd']!=null) form1.record['sal_knd'] = form1.record['sal_knd'].id
            if (form1.record['always']!=null) form1.record['always'] = form1.record['always'].id

            this.save(function (data) {
                if (data.status == 'success') {
                 grid1.reload();
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
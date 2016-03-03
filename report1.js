// JavaScript Document
    $(document).ready(function() {
        $("#expExcel").click(function () {
          //alert("ExportBegin");
          $("div#printData>*").clone().appendTo( $("div#xlsData") );
          $("div#xlsData>table thead.head:not(:first)").remove();
          $("div#xlsData>table tr.head:not(:first)").remove();
          $("div#xlsData>table tfoot.foot:not(:last)").remove();
          $("div#xlsData>table td.listarea td:not(.right)").each( function(index) {
             //$(this).text( String.fromCharCode(96)+$(this).text() ) ;
             $(this).attr("align","left");
             } );
          $("div#xlsData").btechco_excelexport({  containerid: "xlsData" , datatype: $datatype.Table });
          $("div#xlsData>*").remove();
        });
          //$("div#printData>table thead.head:not(:first)").addClass("dontDisplay");
          //$("div#printData>table tr.head:not(:first)").addClass("dontDisplay");
          //$("div#printData>table tfoot.foot:not(:last)").addClass("dontDisplay");
    });

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <script src="/jquery-2.1.1.min.js"></script>
    <script src="/jtable/jquery.battatech.excelexport.js"></script>
<script type="text/javascript">
    $(document).ready(function() {
        $("#btnExport").click(function () {
          alert("ExportBegin");
          $("#tblExport").btechco_excelexport({
                containerid: "tblExport"
               , datatype: $datatype.Table
            });
        });
    });
</script>
</head>
<body>
    <div id="dv">
        <table id="tblExport" style="border: 1px solid black;">
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style='background-color: red;'>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div>
        <button id="btnExport">Export</button>
    </div>
</body>
</html>

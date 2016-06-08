<%@ page isErrorPage="true" %>
<!DOCTYPE html>

<html>
<head>
</head>
<body>
	Error is : <%=exception.getMessage()%>
	<!--The exception object is available only when the error page declares it to be error page this is done by the first stmt-->
</body>
</html>

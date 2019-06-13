$(document).ready(function() {

	if (localStorage.getItem('userTable')) {
		let retrievedObject = JSON.parse(localStorage.getItem('userTable'));
		$("#queryResult").html(renderTable(retrievedObject));
		let checkboxAmount = $( "input[type=checkbox]:checked" ).length;
		countMarkedCheckboxes();
	};

  $('#countryRequest').on('submit', function(e){
		e.preventDefault();
		let countryName = $("input[name='country']").val();
    $.ajax({
			url: "./search",
			method: "GET",
			data: {"country": countryName},
			dataType: 'json',
		})
		.done(function(data) {
			$("#queryResult").html(renderTable(data));
			saveToLocalStorage(data);
		})
		.fail(function() {
			alert( "error" );
		});
	});

	$("#resetButton").on("click", function() {
		$( "#queryResult" ).empty();
		localStorage.removeItem("userTable");
		$("#score").text('0');
		$("input[name='country']").val("");
	});

	$("#queryResult").on("click", "input" , function() {
		let position = $( "input[type=checkbox]" ).index(this);
		let retrievedObject = JSON.parse(localStorage.getItem('userTable'));
		retrievedObject[position]['checked'] = !retrievedObject[position]['checked'];
		localStorage.setItem('userTable', JSON.stringify(retrievedObject));
		countMarkedCheckboxes();
	});

	function renderTable(data) {
		let tableContent = '';
		let tableRaw = "";
		for (let i = 0; i < data.length; i++) {
			tableRaw += "<tr><td>" + i + "</td>";
			for(key in data[i]) {
				if (key === 'web_page') {
					tableRaw += "<td><a href='" + data[i][key] + "'>" + data[i][key] + "</a></td>"
				} if (key === 'checked') {
					let marked = data[i][key] ? 'checked' : '';
					tableRaw += "<td><input type='checkbox'" + marked + "></td></tr>"
				} else {
					tableRaw += "<td>" + data[i][key] + "</td>"
				}
			};
			if (tableRaw.indexOf("</tr>") === -1) {
				tableContent += tableRaw + '<td><input type="checkbox"></td></tr>';
			} else {
				tableContent += tableRaw;
			}
			tableRaw = "";
		};
		return tableContent;
	};

	function saveToLocalStorage(data) {
		for (let i = 0; i< data.length; i++) {
			data[i]['checked'] = false;
		}
		localStorage.setItem('userTable', JSON.stringify(data));
	};

	function countMarkedCheckboxes() {
		let checkboxAmount = $( "input[type=checkbox]:checked" ).length;
		$("#score").text(checkboxAmount);
	}

});

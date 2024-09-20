"use strict"
let deleteId = null

function editPerson(button, id) {
	const row = button.closest("tr")
	const cells = row.querySelectorAll("td")

	const updatedPerson = {
		id: id,
		name: cells[0].innerText,
		dateOfBirth: formatDate(cells[1].innerText).toISOString(),
		married: cells[2].innerText.toLowerCase() === "true",
		phone: cells[3].innerText,
		salary: parseFloat(cells[4].innerText),
	}

	fetch(`/Persons/EditPerson`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updatedPerson),
	}).then((response) => {
		response.ok
			? alert("Record updated successfully")
			: alert("Error updating record")
	})
}

function confirmDelete(id) {
	deleteId = id
	const deleteModal = new bootstrap.Modal(
		document.getElementById("deleteModal")
	)
	deleteModal.show()
}

document.getElementById("deleteConfirmButton").addEventListener("click", () => {
	fetch(`/Persons/DeletePerson?id=${deleteId}`, {
		method: "DELETE",
	}).then((response) => {
		response.ok ? location.reload() : alert("Error deleting record")
	})
})

// Filtering
document.getElementById("search").addEventListener("input", function () {
	const filter = this.value.toLowerCase()
	const rows = document.querySelectorAll("#personTable tbody tr")

	rows.forEach((row) => {
		const columns = row.querySelectorAll("td")
		let match = false

		columns.forEach((col) => {
			if (col.innerText.toLowerCase().includes(filter)) match = true
		})

		row.style.display = match ? "" : "none"
	})
})

// Sorting
function sortTable(columnIndex) {
	const table = document.getElementById("personTable")
	const rows = Array.from(table.rows).slice(1)
	const direction = table.dataset.sortDirection === "asc" ? "asc" : "desc"
	table.dataset.sortDirection = direction === "asc" ? "desc" : "asc"

	const sortedRows = rows.sort((a, b) => {
		const x = a.getElementsByTagName("TD")[columnIndex].innerText
		const y = b.getElementsByTagName("TD")[columnIndex].innerText

		if (columnIndex === 1) {
			return direction === "asc"
				? formatDate(x) - formatDate(y)
				: formatDate(y) - formatDate(x)
		} else {
			return direction === "asc"
				? x.toLowerCase().localeCompare(y.toLowerCase())
				: y.toLowerCase().localeCompare(x.toLowerCase())
		}
	})

	const tbody = table.tBodies[0]
	tbody.innerHTML = ""
	sortedRows.forEach((row) => tbody.appendChild(row))
}

function formatDate(date) {
	date.trim()
	const parts = date.split(".")
	const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`
	return new Date(formattedDate)
}

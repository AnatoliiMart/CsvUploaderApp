using System.Globalization;
using CsvHelper;
using CsvUploaderApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CsvUploaderApp.Controllers;

public class PersonsController(AppDbContext context) : Controller
{
    private readonly AppDbContext _context = context;

    [HttpGet]
    public IActionResult Index() => View();

    [HttpPost]
    public async Task<IActionResult> UploadCsv(IFormFile file)
    {
        if (file != null && file.Length > 0)
        {
            using var stream = new StreamReader(file.OpenReadStream());
            using var csv = new CsvReader(stream, CultureInfo.InvariantCulture);
            var records = csv.GetRecords<Person>().ToList();

            await _context.Persons.AddRangeAsync(records);
            await _context.SaveChangesAsync();
        }
        return RedirectToAction("List");
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var persons = await _context.Persons.ToListAsync();
        return View(persons);
    }

    [HttpPost]
    public async Task<IActionResult> EditPerson([FromBody] Person updatedPerson)
    {
        var person = await _context.Persons.FindAsync(updatedPerson.Id);
        if (person != null)
        {
            person.Name = updatedPerson.Name;
            person.DateOfBirth = updatedPerson.DateOfBirth;
            person.Married = updatedPerson.Married;
            person.Phone = updatedPerson.Phone;
            person.Salary = updatedPerson.Salary;
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
        return NotFound();
    }

    [HttpDelete]
    public async Task<IActionResult> DeletePerson(int id)
    {
        var person = await _context.Persons.FindAsync(id);
        if (person != null)
        {
            _context.Persons.Remove(person);
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
        return NotFound();
    }
}

using Microsoft.EntityFrameworkCore;

namespace CsvUploaderApp.Models;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
  public DbSet<Person> Persons { get; set; }
}
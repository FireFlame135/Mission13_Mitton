using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreApi.Models;

namespace BookstoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        // NEW: Endpoint to get a distinct list of categories dynamically
        [HttpGet("Categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Books
                .Where(b => b.Category != null) // Avoid nulls just in case
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }

        // UPDATED: Added category parameter for filtering
        [HttpGet]
        public async Task<IActionResult> GetBooks(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 5, 
            [FromQuery] string sortOrder = "title_asc",
            [FromQuery] string? category = null) 
        {
            // Start with all books
            IQueryable<Book> query = _context.Books;

            // 1. Category Filtering
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

            // 2. Sorting logic
            query = sortOrder switch
            {
                "title_desc" => query.OrderByDescending(b => b.Title),
                "title_asc" => query.OrderBy(b => b.Title),
                _ => query.OrderBy(b => b.Title) // Default sort
            };

            // 3. Get total count for pagination metadata (adjusts dynamically based on filter!)
            var totalCount = await query.CountAsync();

            // 4. Pagination logic: Skip the previous pages and take the requested amount
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new 
                {
                    b.BookId,
                    b.Title,
                    b.Author,
                    b.Publisher,
                    b.Isbn,
                    b.Classification,
                    b.Category,
                    b.PageCount,
                    b.Price
                })
                .ToListAsync();

            // 5. Return the data along with pagination metadata
            return Ok(new
            {
                TotalItems = totalCount,
                PageSize = pageSize,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Books = books
            });
        }
    }
}
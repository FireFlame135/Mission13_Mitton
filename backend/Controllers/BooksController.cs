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

        // --- EXISTING READ ENDPOINTS ---

        [HttpGet("Categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Books
                .Where(b => b.Category != null)
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 5, 
            [FromQuery] string sortOrder = "title_asc",
            [FromQuery] string? category = null) 
        {
            IQueryable<Book> query = _context.Books;

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

            query = sortOrder switch
            {
                "title_desc" => query.OrderByDescending(b => b.Title),
                "title_asc" => query.OrderBy(b => b.Title),
                _ => query.OrderBy(b => b.Title)
            };

            var totalCount = await query.CountAsync();

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

            return Ok(new
            {
                TotalItems = totalCount,
                PageSize = pageSize,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Books = books
            });
        }

        // --- NEW CRUD ENDPOINTS ---

        // GET a single book by ID (Needed for the edit form)
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // POST: Add a new book
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Returns a 201 Created status and the new book data
            return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, book);
        }

        // PUT: Update an existing book
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            if (id != book.BookId)
            {
                return BadRequest("ID mismatch");
            }

            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Books.Any(e => e.BookId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // 204 No Content is standard for a successful PUT
        }

        // DELETE: Remove a book
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
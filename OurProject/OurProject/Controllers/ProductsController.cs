using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OurProject.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OurProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IHangHoaRepository _hanghoaRepository;

        public ProductsController(IHangHoaRepository hanghoaRepository)
        {
            _hanghoaRepository = hanghoaRepository;
        }

        [HttpGet]
        public IActionResult GetAllProducts(string sreach, double? from, double? to, string sortBy, int page = 1)
        {
            try
            {
                var result = _hanghoaRepository.GetAll(sreach, from, to, sortBy, page);
                return Ok(result);
            }
            catch
            {
                return BadRequest("We can't get the product.");
            }
        }
    }
}
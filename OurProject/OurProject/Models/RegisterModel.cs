using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OurProject.Models
{
    public class RegisterModel
    {
        [Required]
        [MaxLength(50)]
        public string UserName { get; set; }

        [Required]
        [MaxLength(250)]
        public string Password { get; set; }

        [Required]
        [MaxLength(250)]
        public string ConfirmPassword { get; set; }

        [MaxLength(250)]
        public string HoTen { get; set; }

        [MaxLength(250)]
        public string Email { get; set; }
    }
}
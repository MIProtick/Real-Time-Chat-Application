using System.Threading.Tasks;
using Back.Models;
using Back.Templates;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : Controller
    {
        private SignInManager<User> _signInManager;
        private UserManager<User> _userManager;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginInput loginInput)
        {
            var user = await _userManager.FindByEmailAsync(loginInput.Email);
            if (user != null)
            {
                var result = await _signInManager.PasswordSignInAsync(user, loginInput.Password, false, false);
                if (result.Succeeded)
                {
                    return Ok(new
                    {
                        status = "Succeed",
                        result = new { id = user.Id, firstName = user.FirstName, lastName = user.LastName, email = user.Email, password = "" }
                    });
                }
                return Ok(new
                {
                    status = "Failed",
                    result = new { id = "", firstName = "", lastName = "", email = "", password = "" }
                });
            }
            else
                return Ok(new
                {
                    status = "Failed",
                    result = new { id = "", firstName = "", lastName = "", email = "", password = "" }
                });
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterInput registerInput)
        {
            var user = await _userManager.FindByEmailAsync(registerInput.Email);
            if (user == null)
            {
                user = new User
                {
                    UserName = registerInput.Email,
                    FirstName = registerInput.FirstName,
                    LastName = registerInput.LastName,
                    Email = registerInput.Email
                };
                var result = await _userManager.CreateAsync(user, registerInput.Password);
                if (result.Succeeded)
                {
                    return Ok(new
                    {
                        status = "Succeed",
                        result = new { id = user.Id, firstName = user.FirstName, lastName = user.LastName, email = user.Email, password = "" }
                    });
                }
                return Ok(new
                {
                    status = "Failed",
                    result = new { id = "", firstName = "", lastName = "", email = "", password = "" }
                });
            }
            else return Ok(new
            {
                status = "ExistAuthFailure",
                result = new { id = user.Id, firstName = user.FirstName, lastName = user.LastName, email = user.Email, password = "" }
            });
        }

        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout([FromBody] User user)
        {
            await _signInManager.SignOutAsync();
            return Ok(new
            {
                status = "signedout",
                result = new { id = "", firstName = "", lastName = "", email = "", password = "" }
            });
        }

    }
}